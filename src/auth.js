
const guestLinks = document.querySelector('.guest-links');
const userLinks = document.querySelector('.user-links');

export const changeAuth = () => {

    const auth = localStorage.getItem('auth');

    if (auth) {

        userLinks.style.display = 'block';
        guestLinks.style.display = 'none';

    } else {

        userLinks.style.display = 'none';
        guestLinks.style.display = 'block';
    }
}


export const setAuth = (userId) => {
    localStorage.setItem('auth', userId);
}

export const getAuthId = () => {
    const auth = localStorage.getItem('auth');
    return auth;
}

export const removeAuth = () => {
    localStorage.removeItem('auth');
}