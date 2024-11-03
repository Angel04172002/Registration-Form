import { router } from "./router.js";
import { changeAuth } from "./auth.js";

const navbar = document.querySelector('.main-navigation');
const successElement = document.querySelector('.success');


navbar.addEventListener('click', (e) => {

    e.preventDefault();

    changeAuth();

    successElement.style.display = 'none';


    if (e.target.tagName == 'A') {

        const url = new URL(e.target.href);
        router(url.pathname);
    }
});


