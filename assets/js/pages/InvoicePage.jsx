import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CustomersAPI from "../api/CustomersAPI";
import InvoicesAPI from "../api/InvoicesAPI";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import FormContentLoader from "../components/loaders/FormContentLoader";

const InvoicePage = (props) => {
    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: ""
    });
    const [customers, setCustomers] = useState([]);
    const [errors, setErrors] = useState({});
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(true);

    const { id = "new" } = props.match.params;

    useEffect(() => {
        if (id !== "new") {
            const fetchInvoice = async (id) => {
                try {
                    const data = await InvoicesAPI.findOne(id);
                    const { amount, status, customer } = data;
                    setLoading(false);
                    setInvoice({
                        amount,
                        status,
                        customer: customer.id
                    });
                } catch (error) {
                    toast.error("Une erreur est survenu !");
                    console.error(error.response);
                }
            };
            setEdit(true);
            fetchInvoice(id);
        }
    }, [id]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await CustomersAPI.findAll();
                setLoading(false);
                setCustomers(data);
            } catch (error) {
                toast.error("Une erreur est survenu !");
                console.error(error.response);
            }
        };
        fetchCustomers();
    }, []);

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setInvoice({ ...invoice, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (edit) {
                await InvoicesAPI.update(id, invoice);
                toast.success("Modification réussi !");
            } else {
                await InvoicesAPI.create(invoice);
                toast.success("Création réussi !");
            }
            props.history.replace("/invoices");
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
            } else if (
                // L'erreur d'APIPlateform passe avant l'@Assert\NotBlank dans l'entité Invoice
                // Il attent une IRI mais reçois une chaine vide.
                response.data["hydra:description"].includes("Invalid IRI")
            ) {
                // Met l'erreur custom sur le champs customer.
                setErrors({
                    customer: "Client invalide !"
                });
            }
        }
    };

    return (
        <>
            {edit ? (
                <h1>Modification d'une facture</h1>
            ) : (
                <h1>Creation d'une facture</h1>
            )}

            {loading && <FormContentLoader />}

            {!loading && (
                <form onSubmit={handleSubmit}>
                    <Field
                        name="amount"
                        label="Montant"
                        value={invoice.amount}
                        onChange={handleChange}
                        placeholder="Montant de la facture"
                        type="number"
                        error={errors.amount}
                    />
                    <Select
                        name="customer"
                        label="Clients"
                        onChange={handleChange}
                        value={invoice.customer}
                        error={errors.customer}
                    >
                        <option defaultValue value="" hidden>
                            Choisiez un client...
                        </option>
                        {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.firstName} {customer.lastName}
                            </option>
                        ))}
                    </Select>
                    <Select
                        name="status"
                        label="Status de la facture"
                        onChange={handleChange}
                        value={invoice.status}
                        error={errors.status}
                    >
                        <option defaultValue hidden>
                            Choisiez un status...
                        </option>
                        <option value="SEND">Envoyée</option>
                        <option value="PAID">Payée</option>
                        <option value="CANCELLED">Annulée</option>
                    </Select>
                    <div className="form-group">
                        <button type="submit" className="btn btn-success">
                            Enregistrer
                        </button>
                        <Link to="/invoices" className="btn btn-link">
                            Retour aux factures
                        </Link>
                    </div>
                </form>
            )}
        </>
    );
};

export default InvoicePage;
