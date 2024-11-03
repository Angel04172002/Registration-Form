import { changeAuth, setAuth } from "../auth.js";

const baseUrl = 'http://localhost:3000/login';

const changeFormDiv = document.getElementById('change-form');
const registerFormDiv = document.getElementById('register-form');
const loginFormDiv = document.getElementById('login-form');
const loginForm = loginFormDiv.querySelector('.form');
const errorMessage = document.querySelector('.error-message2');
const successMessage = document.querySelector('.success');


async function handleLogin(e) {

    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    
    const email = formData.get('email');
    const password = formData.get('password');

    const data = {
        email,
        password
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
        body: JSON.stringify(data),
    });


    let responseText = await response.json();


    if (response.ok) {

        loginFormDiv.style.display = 'none';
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none'; 
        // responseText = JSON.parse(responseText);   
       
        setAuth(responseText.userId);
        changeAuth();

    } else {


        loginFormDiv.style.display = 'block';
        errorMessage.style.display = 'block';
        errorMessage.textContent = responseText;
        successMessage.style.display = 'none';
    }

    // loginForm.removeEventListener('submit', handleLogin);

}

export const loginHandler = () => {

    registerFormDiv.style.display = 'none';
    loginFormDiv.style.display = 'block';
    changeFormDiv.style.display = 'none';

    loginForm.addEventListener('submit', handleLogin);
}

