import { getAuthId } from "../auth.js";

const baseUrl = 'http://localhost:3000/change';

const changeFormDiv = document.getElementById('change-form');
const changeForm = changeFormDiv.querySelector('.form');
const loginFormDiv = document.getElementById('login-form');
const registerFormDiv = document.getElementById('register-form');
const successMessage = document.querySelector('.success-message');
const errorMessage = document.querySelector('.error-message3');

const firstNameInputField = changeFormDiv.querySelector('#firstNameFieldChange');
const lastNameInputField = changeFormDiv.querySelector('#lastNameFieldChange');
const phoneInputField = changeFormDiv.querySelector('#phoneFieldChange');
const emailInputField = changeFormDiv.querySelector('#emailFieldChange');



async function handleChange(e) {
    
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const password = formData.get('password');

    const data = {
        firstName,
        lastName,
        phone,
        email,
        password
    };

    if (Object.keys(data).some(x => data[x] == '')) {

        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Всички полета са задължителни!';
        return;
    }

    const response = await fetch(baseUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });

    let responseText = await response.json();



    if (response.ok) {

        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';

    } else {

        errorMessage.style.display = 'block';
        errorMessage.textContent = responseText;
        successMessage.style.display = 'none';
    }
   

}

export const changeHandler = async () => {

    successMessage.style.display = 'none';
    registerFormDiv.style.display = 'none';
    loginFormDiv.style.display = 'none';
    changeFormDiv.style.display = 'block';

    const params = new URLSearchParams({
        id: getAuthId()
    }).toString();


    const response = await fetch(`http://localhost:3000/find-by-id?${params}`);
    const data = await response.json();

    console.log(data);
    
    firstNameInputField.value = data.FirstName;
    lastNameInputField.value = data.LastName;
    phoneInputField.value = data.PhoneNumber;
    emailInputField.value = data.Email;


    changeForm.addEventListener('submit', handleChange);
}