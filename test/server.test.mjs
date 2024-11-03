import chaiHttp from 'chai-http';
import { use, expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import sql from 'msnodesqlv8';
import app from '../server/server.js';

const chai = use(chaiHttp);
const { request } = chai;



describe('Server Endpoints', () => {


    let queryStub;

    beforeEach(() => {
        queryStub = sinon.stub(sql, 'query');
    });

    afterEach(() => {
        queryStub.restore();
    });


    this.enableTimeouts(false);


    describe('GET request to /find-by-id endpoint', () => {

        it('should return 400 if query param id is missing', async (done) => {

            const res = await request.execute(app)
                .get('/find-by-id');

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error', 'ID is missing');

            done();

        });


        it('should return 400 if user is not found', (done) => {
            queryStub.yields(null, []);

            chai.request(app)
                .get('/find-by-id')
                .query({ id: 'nonexistentId' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.equal('Потребител с този идентификатор не съществува!');
                    done();
                });
        });

        it('should return 200 with user data if user is found', (done) => {

            queryStub.yields(null, [{ id: '1', name: 'Peter Ivanov' }]);

            chai.request(server)
                .get('/find-by-id')
                .query({ id: '1' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.deep.equal({ id: '1', name: 'Peter Ivanov' });
                    done();
                });
        });
    });

    describe('POST request to /login endpoint', () => {

        it('should return 400 if email or password is missing', (done) => {

            chai.request(server)
                .post('/login')
                .send({ email: '', password: '' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.equal("Моля, попълнете всички полета правилно!");
                    done();
                });
        });

        it('should return 400 if user with email does not exist', (done) => {

            queryStub.yields(null, []);
            chai.request(server)
                .post('/login')
                .send({ email: 'peter.ivv@gmail.com', password: 'password123' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.equal('Потребител с този имейл не съществува!');
                    done();
                });
        });

        it('should return 400 if password is incorrect', async () => {

            queryStub.yields(null, [{ Password: await bcrypt.hash('asdf123', 10) }]);

            chai.request(server)
                .post('/login')
                .send({ email: 'peter.ivv@gmail.com', password: 'aaaaaa' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.equal('Грешна парола!');
                });
        });


        it('should return 200 and set cookie if login is successful', async () => {

            const hashedPassword = await bcrypt.hash('asdf123', 10);
            queryStub.yields(null, [{ Id: '1', Password: hashedPassword }]);

            chai.request(server)
                .post('/login')
                .send({ email: 'peter.ivv@gmail.com', password: 'asdf123' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.deep.equal({ userId: '1' });
                    expect(res).to.have.cookie('auth');
                });
        });
    });


    describe('POST request to /register endpoint', () => {

        it('should return 400 if required fields are missing', (done) => {
            chai.request(server)
                .post('/register')
                .send({ firstName: '', lastName: '', email: '' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.equal("Моля, попълнете всички полета правилно!");
                    done();
                });
        });

        it('should return 400 if email format is invalid', (done) => {
            chai.request(server)
                .post('/register')
                .send({ email: 'aaaaamqk' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.equal("Имейлът е в невалиден формат!");
                    done();
                });
        });

        it('should return 400 if password is less than 6 characters', (done) => {
            chai.request(server)
                .post('/register')
                .send({ password: 'asd' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.equal("Паролата трябва да е дълга поне 6 символа!");
                    done();
                });
        });

        it('should return 400 if user with email already exists', (done) => {
            queryStub.yields(null, [{ email: 'peter.ivv@gmail.com' }]);
            chai.request(server)
                .post('/register')
                .send({ email: 'peter.ivv@gmail.com' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.equal('Потребител с този имейл вече съществува!');
                    done();
                });
        });


        it('should return 200 and set cookie if registration is successful', async () => {

            queryStub.onFirstCall().yields(null, []);
            queryStub.onSecondCall().yields(null, [{ Id: '1' }]);

            chai.request(server)
                .post('/register')
                .send({
                    firstName: 'Peter',
                    lastName: 'Ivanov',
                    phone: '0887654321',
                    email: 'peter.ivv@gmail.com',
                    password: 'aaaaaa',
                    rePassword: 'aaaaaa'
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.deep.equal({ userId: '1' });
                    expect(res).to.have.cookie('auth');
                });
        });
    });

});
