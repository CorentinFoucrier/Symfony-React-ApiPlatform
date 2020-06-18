import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomersAPI from "../api/CustomersAPI";
import Field from "../components/forms/Field";

const CustomerPage = (props) => {
    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });
    const [errors, setErrors] = useState({});
    const [edit, setEdit] = useState(false);
    const { id = "new" } = props.match.params;

    useEffect(() => {
        if (id !== "new") {
            setEdit(true);
            const fetchCustomer = async (id) => {
                try {
                    const {
                        firstName,
                        lastName,
                        email,
                        company
                    } = await CustomersAPI.findOne(id);
                    setCustomer({ firstName, lastName, email, company });
                } catch (error) {
                    console.error(error.response);
                    props.history.replace("/customers");
                }
            };
            fetchCustomer(id);
        }
    }, [id]);

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCustomer({ ...customer, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (edit) {
                await CustomersAPI.update(id, customer);
            } else {
                await CustomersAPI.create(customer);
            }
            props.history.replace("/customers");
        } catch ({ response }) {
            const { violations } = response.data;
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
            {!edit ? <h1>Créer un client</h1> : <h1>Modification un client</h1>}
            <form onSubmit={handleSubmit}>
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Nom de famille du client"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Prénom du client"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Email du client"
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="company"
                    label="Entreprise"
                    placeholder="Entreprise du client"
                    value={customer.company}
                    onChange={handleChange}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                    </button>
                    <Link to="/customers" className="btn btn-link">
                        Retour à la liste
                    </Link>
                </div>
            </form>
        </>
    );
};

export default CustomerPage;
