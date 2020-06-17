import React, { useContext, useState } from "react";
import AuthAPI from "../api/AuthAPI";
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
            history.replace("/customers");
        } catch (error) {
            setError(
                "Aucun compte n'a cette adresse email ou les informations ne correspondent pas."
            );
        }
    };

    return (
        <>
            <h1>Page de connexion</h1>

            <form className="mt-5" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Address email</label>
                    <input
                        value={credentials.username}
                        onChange={handleChange}
                        type="text"
                        className={"form-control" + (error && " is-invalid")}
                        placeholder="Adresse email de connexion"
                        name="username"
                        id="username"
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        value={credentials.password}
                        onChange={handleChange}
                        type="password"
                        className="form-control"
                        placeholder="Mot de passe"
                        name="password"
                        id="password"
                    />
                </div>
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