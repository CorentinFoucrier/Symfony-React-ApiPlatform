import React, { useContext } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import AuthAPI from "../api/AuthAPI";
import AuthContext from "../contexts/AuthContext";

const Navbar = ({ history }) => {
    const { isAuth, setIsAuth } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            await AuthAPI.logout();
            setIsAuth(false);
            toast.info("Vous êtes maintenant déconnecté 😁");
            history.push("/");
        } catch (error) {
            setIsAuth(true);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <NavLink className="navbar-brand" to="/">
                SymReact
            </NavLink>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarColor01"
                aria-controls="navbarColor01"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor01">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/customers">
                            Clients
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/invoices">
                            Factures
                        </NavLink>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    {(!isAuth && (
                        <>
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    Incription
                                </a>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to="/login"
                                    className="btn btn-success"
                                >
                                    Connexion
                                </NavLink>
                            </li>
                        </>
                    )) || (
                        <li className="nav-item">
                            <button
                                onClick={handleLogout}
                                className="btn btn-danger"
                            >
                                Deconnexion
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

const NavbarWithRouter = withRouter(Navbar);

export default NavbarWithRouter;
