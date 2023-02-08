import { Link } from "react-router-dom";

import { Center } from "@mantine/core";

import RegisterForm from "../components/auth/RegisterForm";

export default function Register() {
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
            <RegisterForm />
            <Link to="/login" style={{ marginTop: "1em" }}>
                Already have an account? Log in here
            </Link>
        </Center>
    );
}
