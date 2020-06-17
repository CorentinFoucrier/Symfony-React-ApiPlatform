import Axios from "axios";

async function authenticate(credentials) {
    const response = await Axios.post(
        "https://localhost:8000/api/login_check",
        credentials
    );
    return true;
}

async function setup() {
    try {
        const response = await Axios.get(
            "https://localhost:8000/api/users?pagination=true&count=1"
        );
        return true;
    } catch (error) {
        return false;
    }
}

async function logout() {
    try {
        const response = await Axios.post("https://localhost:8000/logout");
        return true;
    } catch (error) {
        return console.error(error);
    }
}

export default { authenticate, setup, logout };
