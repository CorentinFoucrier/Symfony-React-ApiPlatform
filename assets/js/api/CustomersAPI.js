import axios from "axios";

function findAll() {
    return axios
        .get("https://localhost:8000/api/customers")
        .then((response) => response.data["hydra:member"]);
}

function findOne(id) {
    return axios
        .get(`https://localhost:8000/api/customers/${id}`)
        .then((response) => response.data);
}

function deleteCustomer(id) {
    return axios.delete(`https://localhost:8000/api/customers/${id}`);
}

function create(customer) {
    return axios.post("https://localhost:8000/api/customers", customer);
}

function update(id, customer) {
    return axios.put(`https://localhost:8000/api/customers/${id}`, customer);
}

export default {
    findAll,
    findOne,
    delete: deleteCustomer,
    create,
    update
};
