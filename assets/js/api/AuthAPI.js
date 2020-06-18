import Axios from "axios";
import { BASE_URL, LOGIN_API, USERS_API } from "../config";

async function authenticate(credentials) {
    const response = await Axios.post(LOGIN_API, credentials);
    return true;
}

async function setup() {
    try {
        const response = await Axios.get(
            USERS_API + "?pagination=true&count=1"
        );
        return true;
    } catch (error) {
        return false;
    }
}

async function logout() {
    try {
        const response = await Axios.post(BASE_URL + "/logout");
        return true;
    } catch (error) {
        return console.error(error);
    }
}

export default { authenticate, setup, logout };
