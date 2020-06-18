import axios from "axios";

function findAll() {
    return axios
        .get("https://localhost:8000/api/invoices")
        .then((response) => response.data["hydra:member"]);
}

function findOne(id) {
    return axios
        .get(`https://localhost:8000/api/invoices/${id}`)
        .then((response) => response.data);
}

function deleteInvoice(id) {
    return axios.delete(`https://localhost:8000/api/invoices/${id}`);
}

function create(invoice) {
    console.log(customer);
    return axios.post("https://localhost:8000/api/invoices", {
        ...invoice,
        customer: `/api/customers/${invoice.customer}`
    });
}

function update(id, invoice) {
    return axios.put(`https://localhost:8000/api/invoices/${id}`, {
        ...invoice,
        customer: `/api/customers/${invoice.customer}`
    });
}

export default {
    findAll,
    findOne,
    delete: deleteInvoice,
    create,
    update
};
