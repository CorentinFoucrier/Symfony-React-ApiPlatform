import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import InvoicesAPI from "../api/InvoicesAPI";
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";

const STATUS = {
    PAID: {
        class: "success",
        label: "Payée",
        icon: "fas fa-check-square"
    },
    SEND: {
        class: "primary",
        label: "Envoyée",
        icon: "fas fa-paper-plane"
    },
    CANCELLED: {
        class: "danger",
        label: "Annulée",
        icon: "fas fa-exclamation-triangle"
    }
};

const InvoicesPage = (props) => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Gestion du changement de page
    const handlePageChange = (page) => setCurrentPage(page);

    /**
     * Gestion de la recherche
     * @param {string} event
     */
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    // Gestion de supperssion d'une invoice
    const handleDelete = async (id) => {
        const originalInvoices = [...invoices]; // copie de invoices[]
        setInvoices(invoices.filter((invoice) => invoice.id !== id));
        try {
            await InvoicesAPI.delete(id);
            toast.success("la facture a bien été supprimé !");
        } catch (error) {
            toast.error("Une erreur est survenu !");
            setInvoices(originalInvoices);
        }
    };

    const invoicesPerPage = 10;

    // Filtrage des invoices en fonction de la recherche
    const filteredInvoices = invoices.filter(
        (i) =>
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS[i.status].label.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination des données
    const paginatedInvoices = Pagination.getData(
        filteredInvoices,
        currentPage,
        invoicesPerPage
    );

    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
            setLoading(false);
        } catch (error) {
            toast.error("Une erreur est survenu !");
            console.error(error.response);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const formatDate = (str) => moment(str).format("DD/MM/YYYY");

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link to="/invoices/new" className="btn btn-primary">
                    Créer une facture
                </Link>
            </div>

            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher... (Clients, montants, status)"
                    onChange={handleSearch}
                    value={search}
                />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoie</th>
                        <th className="text-center">Montant</th>
                        <th className="text-center">Status</th>
                        <th></th>
                    </tr>
                </thead>

                {!loading && (
                    <tbody>
                        {paginatedInvoices.map((invoice) => (
                            <tr key={invoice.id}>
                                <td>{invoice.chrono}</td>
                                <td>
                                    <Link
                                        to={"/customers/" + invoice.customer.id}
                                    >
                                        {invoice.customer.firstName +
                                            " " +
                                            invoice.customer.lastName}
                                    </Link>
                                </td>
                                <td className="text-center">
                                    {formatDate(invoice.sentAt)}
                                </td>
                                <td className="text-center">
                                    <span
                                        className={
                                            "badge badge-" +
                                            STATUS[invoice.status].class
                                        }
                                    >
                                        <i
                                            className={
                                                STATUS[invoice.status].icon +
                                                " mr-2"
                                            }
                                        ></i>
                                        {STATUS[invoice.status].label}
                                    </span>
                                </td>
                                <td className="text-center">
                                    {invoice.amount.toLocaleString()} €
                                </td>
                                <td>
                                    <Link
                                        to={"/invoices/" + invoice.id}
                                        className="btn btn-sm btn-primary mr-1"
                                    >
                                        Editer
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(invoice.id)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>
            {loading && <TableLoader />}
            <Pagination
                currentPage={currentPage}
                itemsPerPage={invoicesPerPage}
                onPageChange={handlePageChange}
                length={filteredInvoices.length}
            />
        </>
    );
};

export default InvoicesPage;
