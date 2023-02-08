import React from "react";
import { Link } from "react-router-dom";

import { Center } from "@mantine/core";

import LoginForm from "../components/auth/LoginForm";

export default function Login() {
    return (
        <Center
            w="100vw"
            h="100vh"
            style={{
                display: "flex",
                flexFlow: "column nowrap",
                alignItems: "center",
            }}
        >
            <LoginForm />
            <Link to="/register" style={{ marginTop: "1em" }}>
                Don't have an account yet? Register here
            </Link>
        </Center>
    );
}
