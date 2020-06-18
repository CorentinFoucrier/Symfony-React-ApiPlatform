import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/app.css";
import AuthAPI from "./api/AuthAPI";
import Loading from "./components/Loading";
import NavbarWithRouter from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AuthContext from "./contexts/AuthContext";
import CustomerPage from "./pages/CustomerPage";
import CustomersPage from "./pages/CustomersPage";
import HomePage from "./pages/HomePage";
import InvoicePage from "./pages/InvoicePage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const Root = () => {
    const [isAuth, setIsAuth] = useState();

    // Dès le démarage de l'app si l'utilisateur peux executer une requête c'est qu'il est connecté
    useEffect(() => {
        const fetchData = async () => {
            const result = await AuthAPI.setup();
            setIsAuth(result); // Update du state isAuth avec le retour booléen de l'API
        };
        fetchData();
    }, []);

    const App = () => (
        <AuthContext.Provider value={{ isAuth, setIsAuth }}>
            <NavbarWithRouter />
            <main className="container pt-5">
                <Switch>
                    <Route path="/register" component={RegisterPage} />
                    <Route path="/login" component={LoginPage} />
                    <PrivateRoute
                        path="/invoices/:id"
                        component={InvoicePage}
                    />
                    <PrivateRoute path="/invoices" component={InvoicesPage} />
                    <PrivateRoute
                        path="/customers/:id"
                        component={CustomerPage}
                    />
                    <PrivateRoute path="/customers" component={CustomersPage} />
                    <Route path="/" component={HomePage} />
                </Switch>
            </main>
        </AuthContext.Provider>
    );

    // Au premier rendu isAuth est "undefine" alors on afficher un écran de chargement après le useEffect on affiche l'app
    // Ceci pour éviter d'avoir un bref affichage en mode "non connecter" puis de recevoir la réponse de l'API que l'on est connecté
    return (
        <>
            <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
            <HashRouter>
                {typeof isAuth === "boolean" ? <App /> : <Loading />}
            </HashRouter>
        </>
    );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<Root />, rootElement);
