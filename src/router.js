import { loginHandler } from "./handlers/login.js";
import { registerHandler } from "./handlers/register.js";
import { logoutHandler } from "./handlers/logout.js";
import { changeHandler } from "./handlers/change.js";

const routes = {
    '/login': loginHandler,
    '/register': registerHandler,
    '/logout': logoutHandler,
    '/changeData': changeHandler
}



export const router = (path) => {

    const handler = routes[path];

    if (handler) {

        handler();
    }
}


