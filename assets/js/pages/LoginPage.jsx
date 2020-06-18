import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import AuthAPI from "../api/AuthAPI";
import Field from "../components/forms/Field";
import AuthContext from "../contexts/AuthContext";

const LoginPage = ({ history }) => {
    const { isAuth, setIsAuth } = useContext(AuthContext);
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");

    // Update du state credentials
    const handleChange = ({ currentTarget }) => {
        const { value, name } = currentTarget;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuth(true);
            toast.success("Vous êtes connecté !");
            history.replace("/customers");
        } catch (error) {
            setError(
                "Aucun compte n'a cette adresse email ou les informations ne correspondent pas."
            );
            toast.error("Une erreur est survenu !");
        }
    };

    return (
        <>
            <h1>Page de connexion</h1>

            <form className="mt-5" onSubmit={handleSubmit}>
                <Field
                    name="username"
                    label="Address email"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Adresse email de connexion"
                    error={error}
                />
                <Field
                    name="password"
                    label="Mot de passe"
                    value={credentials.password}
                    onChange={handleChange}
                    type="password"
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Se connecter
                    </button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;
