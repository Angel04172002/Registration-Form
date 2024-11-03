const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const sql = require("msnodesqlv8");

const connectionString = require('./config/dbconfig');
const authQueries = require('./queries/authQueries');

const PORT = 3000;


const app = express();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});


app.get('/find-by-id', async (req, res) => {

    const userId = req.query.id;


    sql.query(connectionString, authQueries.getCustomerById, [userId], async (err, rows) => {

        if (err) {
            return res.status(400).json('Възникна непредвидена грешка!');
        }

        if (rows.length == 0) {
            return res.status(400).json('Потребител с този идентификатор не съществува!');

        }

        return res.status(200).json(rows[0]);
    })
});

app.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json("Моля, попълнете всички полета правилно!");
    }

    sql.query(connectionString, authQueries.findCustomerByEmail, [email], async (err, rows) => {

        if (err) {
            return res.status(400).json('Възникна непредвидена грешка!');
        }

        if (rows.length == 0) {
            return res.status(400).json('Потребител с този имейл не съществува!');
        }


        try {

            const isValid = await bcrypt.compare(password, rows[0].Password);

            if (isValid == false) {
                return res.status(400).json('Грешна парола!');
            }


            const userId = rows[0]?.Id;

            if (userId !== undefined) {

                res.cookie('auth', userId);
            }

            return res.status(200).json({ userId });

        } catch {

            return res.status(400).json('Възникна непредвидена грешка!');
        }
    });
});


app.post('/register', async (req, res) => {

    const { firstName, lastName, phone, email, password, rePassword } = req.body;

    if (!firstName || !lastName || !phone || !email || !password || password != rePassword) {
        return res.status(400).json("Моля, попълнете всички полета правилно!");
    }

    const emailPattern = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'g');

    if (email.match(emailPattern) == false) {
        return res.status(400).json("Имейлът е в невалиден формат!");
    }

    if (password.length < 6) {
        return res.status(400).json("Паролата трябва да е дълга поне 6 символа!");
    }


    sql.query(connectionString, authQueries.findCustomerByEmail, [email], async (err, customerRows) => {

        if (err) {
            return res.status(400).json('Възникна непредвидена грешка!');
        }

        if (customerRows.length >= 1) {
            return res.status(400).json('Потребител с този имейл вече съществува!');
        }

        try {

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const params = [firstName, lastName, phone, email, hashedPassword];


            sql.query(connectionString, authQueries.registerNewCustomer, params, (err, rows) => {

                if (err) {
                    return res.status(400).json('Възникна непредвидена грешка!');
                }

                const userId = customerRows[0]?.Id;

                if (userId !== undefined) {

                    res.cookie('auth', userId);
                }

                return res.status(200).json({ userId });
            });

        } catch (err) {

            return res.status(400).json('Възникна непредвидена грешка!');
        }

    });
});


app.put('/change', async (req, res) => {

    const { firstName, lastName, phone, email, password } = req.body;


    if (!firstName || !lastName || !phone || !email || !password) {
        return res.status(400).json("Моля, попълнете всички полета правилно!");
    }

    const emailPattern = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'g');

    if (email.match(emailPattern) == false) {
        return res.status(400).json("Имейлът е в невалиден формат!");
    }

    if (password.length < 6) {
        return res.status(400).json("Паролата трябва да е дълга поне 6 символа!");
    }


    sql.query(connectionString, authQueries.findCustomerByEmail, [email], async (err, rows) => {

        console.log(err?.message);

        if (err) {
            return res.status(400).json('Възникна непредвидена грешка!');
        }


        try {

            const oldUserEmail = rows[0].Email;

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const params = [firstName, lastName, phone, email, hashedPassword, oldUserEmail];

            sql.query(connectionString, authQueries.updateCustomerByEmail, params, (err, rows) => {

                console.log(err?.message);

                if (err) {
                    return res.status(400).json('Възникна непредвидена грешка!');
                }

                const userId = rows[0]?.Id;
                return res.status(200).json({ userId });
            });

        } catch {

            return res.status(400).json('Възникна непредвидена грешка!');

        }
    });
});


app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));


module.exports = app;

