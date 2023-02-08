import { Routes, Route } from "react-router-dom";

import Thiscord from "./pages/Thiscord";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Thiscord />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Thiscord />} />
        </Routes>
    );
}
