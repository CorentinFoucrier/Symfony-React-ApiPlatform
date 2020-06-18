import axios from "axios";
import { CUSTOMER_API } from "../config";

function findAll() {
    return axios
        .get(CUSTOMER_API)
        .then((response) => response.data["hydra:member"]);
}

function findOne(id) {
    return axios.get(`${CUSTOMER_API}/${id}`).then((response) => response.data);
}

function deleteCustomer(id) {
    return axios.delete(`${CUSTOMER_API}/${id}`);
}

function create(customer) {
    return axios.post(CUSTOMER_API, customer);
}

function update(id, customer) {
    return axios.put(`${CUSTOMER_API}/${id}`, customer);
}

export default {
    findAll,
    findOne,
    delete: deleteCustomer,
    create,
    update
};
