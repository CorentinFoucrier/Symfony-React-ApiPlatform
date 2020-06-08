import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersApi from "../services/CustomersAPI";

const CustomerPage = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    const fetchCustomer = async () => {
        try {
            const data = await CustomersApi.findAll();
            setCustomers(data);
        } catch (error) {
            console.error(error.response);
        }
    };
    // Au chargement vas chercher les Customers
    useEffect(() => {
        fetchCustomer();
    }, []);

    // Gestion du changement de page
    const handlePageChange = (page) => setCurrentPage(page);

    // Gestion de supperssion d'un customer
    const handleDelete = async (id) => {
        const originalCustomer = [...customers]; // copie de customers[]
        setCustomers(customers.filter((customer) => customer.id !== id));
        try {
            const response = await CustomersApi.delete(id);
            return console.log("ok");
        } catch (error) {
            console.error(error.response);
            setCustomers(originalCustomer);
        }
    };

    /**
     * Gestion de la recherche
     * @param {string} event
     */
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    const customersPerPage = 10;

    // Filtrage des customers en fonction de la recherche
    const filteredCustormers = customers.filter(
        (c) =>
            (c.company &&
                c.company.toLowerCase().includes(search.toLowerCase())) ||
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination des données
    const paginatedCustomers = Pagination.getData(
        filteredCustormers,
        currentPage,
        customersPerPage
    );

    return (
        <>
            <h1>List des clients</h1>
            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher... (Clients, Email, Entreprise)"
                    onChange={handleSearch}
                    value={search}
                />
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Facture</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {paginatedCustomers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <a href="#">
                                    {customer.firstName +
                                        " " +
                                        customer.lastName}
                                </a>
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center">
                                <span className="badge badge-pill badge-primary">
                                    {customer.invoices.length}
                                </span>
                            </td>
                            <td className="text-center">
                                {customer.totalAmount.toLocaleString()} €
                            </td>
                            <td>
                                <button
                                    onClick={() => handleDelete(customer.id)}
                                    disabled={customer.invoices.length > 0}
                                    className="btn btn-sm btn-danger"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {customersPerPage < filteredCustormers.length && (
                <Pagination
                    currentPage={currentPage}
                    itemsPerPage={customersPerPage}
                    length={filteredCustormers.length}
                    onPageChange={handlePageChange}
                />
            )}
        </>
    );
};

export default CustomerPage;
