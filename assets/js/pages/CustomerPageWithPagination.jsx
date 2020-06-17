/**
 * Juste pour l'exemple:
 * Ce component utilise l'ApiPlatform pour la pagination
 * des clients, c'est-à-dire que pour chaque page l'on a
 * une resquête API pour afficher les n clients suivants
 */

import axios from "axios";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";

const CustomerPageWithPagination = (props) => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;
    const paginatedCustomers = Pagination.getData(
        customers,
        currentPage,
        itemsPerPage
    );

    useEffect(() => {
        axios
            .get(
                `https://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`
            )
            .then((response) => {
                setCustomers(response.data["hydra:member"]);
                setTotalItems(response.data["hydra:totalItems"]);
                setLoading(false);
            })
            .catch((error) => console.error(error.response));
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setLoading(true);
    };

    const handleDelete = (id) => {
        const originalCustomer = [...customers]; // copie de customers[]
        setCustomers(customers.filter((customer) => customer.id !== id));
        return axios
            .delete("https://localhost:8000/api/customers/" + id)
            .then((response) => console.log("ok"))
            .catch((error) => {
                console.error(error.response);
                setCustomers(originalCustomer);
            });
    };

    return (
        <>
            <h1>List des clients (pagination)</h1>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entriprise</th>
                        <th className="text-center">Facture</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {loading && (
                        <tr>
                            <td>Chargement...</td>
                        </tr>
                    )}
                    {!loading &&
                        customers.map((customer) => (
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
                                        onClick={() =>
                                            handleDelete(customer.id)
                                        }
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
            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={totalItems}
                onPageChange={handlePageChange}
            />
        </>
    );
};

export default CustomerPageWithPagination;
