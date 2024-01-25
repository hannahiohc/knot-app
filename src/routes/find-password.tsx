import React, { useState } from "react";
import { auth } from "@/firebase";
import { fetchSignInMethodsForEmail, sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import { Box, Error, Form, Input, Sucess, Switcher, Title, Wrapper } from "@/components/auth-components";
import { FirebaseError } from "firebase/app";

export default function CreateAccount() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setLoading] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (email === "" || isLoading) return;
        try {
            setLoading(true);
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (signInMethods.length === 0) {
                await sendPasswordResetEmail(auth, email);
                setSuccess("Password reset email sent. Check your inbox.");
            }
        } catch (e) {
            if (e instanceof FirebaseError) {
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Wrapper>
            <Box>
                <Title>Reset Your Password</Title>
                <Form onSubmit={onSubmit}>
                    <Input name="email" onChange={onChange} value={email} placeholder="Email" type="email" required />
                    <Input type="submit" value={isLoading ? "Loading..." : "Reset Password"} />
                </Form>
                {error !== "" ? <Error>{error}</Error> : null}
                {success && <Sucess>{success}</Sucess>}
                <Switcher>
                    <Link to="/login">Back to Sign In
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.4" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link>
                </Switcher>
            </Box>
        </Wrapper>
    )
}