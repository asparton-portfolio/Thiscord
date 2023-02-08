import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./resources/styles/index.css";

import { ClientSocket, ClientSocketContext } from "./services/ClientSocket";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <ClientSocketContext.Provider value={new ClientSocket()}>
            <App />
        </ClientSocketContext.Provider>
    </BrowserRouter>,
);
