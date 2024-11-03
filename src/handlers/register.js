import { changeAuth, setAuth } from "../auth.js";

const baseUrl = 'http://localhost:3000/register';

const changeFormDiv = document.getElementById('change-form');
const registerFormDiv = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const registerForm = registerFormDiv.querySelector('.form');
const errorMessage = document.querySelector('.error-message1');
const successMessage = document.querySelector('.success');


async function handleRegister(e) {

    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const password = formData.get('password');
    const rePassword = formData.get('rePassword');


    if (password != rePassword) {

        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Паролите не съвпадат!';
        return;

    } else {

        errorMessage.style.display = 'none';
    }



    const data = {
        firstName,
        lastName,
        phone,
        email,
        password,
        rePassword
    };


    if (Object.keys(data).some(x => data[x] == '')) {

        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Всички полета са задължителни!';
        return;
    }


    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });


    let responseText = await response.json();

    if (response.ok) {

        registerFormDiv.style.display = 'none';
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';

        // responseText = JSON.parse(responseText);   

        console.log(responseText);

        setAuth(responseText.userId);
        changeAuth();

    } else {


        registerFormDiv.style.display = 'block';
        errorMessage.style.display = 'block';
        errorMessage.textContent = responseText;
        successMessage.style.display = 'none';
    }

    // e.currentTarget.removeEventListener('submit');
}

export const registerHandler = () => {

    registerFormDiv.style.display = 'block';
    loginForm.style.display = 'none';
    changeFormDiv.style.display = 'none';

    registerForm.addEventListener('submit', handleRegister);
}





