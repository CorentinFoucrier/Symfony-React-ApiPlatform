import React from "react";

const Select = ({ name, label, onChange, value, error = "", children }) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select
                onChange={onChange}
                name={name}
                id={name}
                value={value}
                className={"custom-select" + (error && " is-invalid")}
            >
                {children}
            </select>
            <p className="invalid-feedback">{error}</p>
        </div>
    );
};

export default Select;
