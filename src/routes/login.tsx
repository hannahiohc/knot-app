import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FirebaseError } from "@firebase/util";
import { auth } from '@/firebase';
import { signInWithEmailAndPassword } from "@firebase/auth";
import { Error, Form, Input, Switcher, Title, Wrapper, Box } from "@/components/auth-components";
import Providers from "@/components/providers";

export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || email === "" || password === "") return; 
        
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch(e) {
            if (e instanceof FirebaseError) {
                console.log(e.code, e.message);
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Wrapper>
            <Box>
                <Title>Sign In</Title>
                <Form onSubmit={onSubmit}>
                    <Input name="email" onChange={onChange} value={email} placeholder="Email" type="email" required/>
                    <Input name="password" onChange={onChange} value={password} placeholder="Password" type="password" required />
                    <Input type="submit" onChange={onChange} value={isLoading ? "Loading..." : "Sign In"} /> 
                </Form>
                {error !== "" ? <Error>{error}</Error> : null}
                <Providers />
                <Switcher>
                    <p className="createaccount">Don't have an account? 
                        <Link to="/create-account">Create Account 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.4" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    </p>
                    <p className="password">
                        <Link to="/find-password">Forgot your Password?</Link>
                    </p>
                </Switcher>
            </Box>
        </Wrapper>
    )
}