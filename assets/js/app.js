import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import "../css/app.css";
import Navbar from "./components/Navbar";
import CustomerPage from "./pages/CustomerPage";
import HomePage from "./pages/HomePage";
import InvoicesPage from "./pages/InvoicesPage";

const App = () => {
    return (
        <HashRouter>
            <Navbar />
            <main className="container pt-5">
                <Switch>
                    <Route path="/invoices" component={InvoicesPage} />
                    <Route path="/customers" component={CustomerPage} />
                    <Route path="/" component={HomePage} />
                </Switch>
            </main>
        </HashRouter>
    );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
