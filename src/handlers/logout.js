import { removeAuth, changeAuth } from "../auth.js"

export const logoutHandler = () => {
    removeAuth();
    changeAuth();
    location.reload();
}