import React, { useState } from "react";
import { Link } from "react-router-dom";
import UsersAPI from "../api/UsersAPI";
import Field from "../components/forms/Field";

const RegisterPage = (props) => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setUser({ ...user, [name]: value });
    };

    const handleSumbit = async (event) => {
        event.preventDefault();
        try {
            await UsersAPI.register(user);
            props.history.replace("/login");
        } catch ({ response }) {
            const { violations } = response.data;
            console.error(violations);
            if (violations) {
                const APIErrors = {};
                // Stockage des erreurs API dans APIErrors comme -> {propertyPath: "message"}
                violations.map(({ propertyPath, message }) => {
                    APIErrors[propertyPath] = message;
                });
                // On écrase l'objet actuelement dans le state par APIErrors.
                setErrors(APIErrors);
            }
        }
    };

    return (
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSumbit}>
                <Field
                    name="firstName"
                    label="Prénom"
                    value={user.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="lastName"
                    label="Nom"
                    value={user.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="email"
                    label="Adresse email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="toto@example.com"
                    type="email"
                    error={errors.email}
                />
                <div className="row">
                    <div className="col">
                        <Field
                            name="password"
                            label="Mot de passe"
                            value={user.password}
                            onChange={handleChange}
                            placeholder="*******"
                            error={errors.password}
                            type="password"
                        />
                    </div>
                    <div className="col">
                        <Field
                            name="confirmPassword"
                            label="Confirmez votre mot de passe"
                            value={user.confirmPassword}
                            onChange={handleChange}
                            placeholder="*******"
                            error={errors.confirmPassword}
                            type="password"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="offset-4 col-4 mt-4">
                        <button className="btn btn-lg btn-block btn-success">
                            S'inscrire
                        </button>
                        <Link to="/login" className="btn btn-link btn-block">
                            J'ai déjà un compte
                        </Link>
                    </div>
                </div>
            </form>
        </>
    );
};

export default RegisterPage;
