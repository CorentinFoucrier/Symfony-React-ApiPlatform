import React from "react";

const Loading = () => (
    <div
        style={{ height: "100vh" }}
        className="d-flex flex-column justify-content-center align-items-center"
    >
        <div
            className="spinner-grow"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
        <h2 className="pt-4">Loading...</h2>
    </div>
);

export default Loading;
