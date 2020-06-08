import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/InvoicesAPI";

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
            const response = await InvoicesAPI.delete(id);
            return console.log("ok");
        } catch (error) {
            console.error(error.response);
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
        } catch (error) {
            console.error(error.response);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const formatDate = (str) => moment(str).format("DD/MM/YYYY");

    return (
        <>
            <h1>Liste des factures</h1>

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
                <tbody>
                    {paginatedInvoices.map((invoice) => (
                        <tr key={invoice.id}>
                            <td>{invoice.chrono}</td>
                            <td>
                                <a href="#">
                                    {invoice.customer.firstName +
                                        " " +
                                        invoice.customer.lastName}
                                </a>
                            </td>
                            <td className="text-center">
                                {formatDate(invoice.sendAt)}
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
                                <button className="btn btn-sm btn-primary mr-1">
                                    Editer
                                </button>
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
            </table>
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
