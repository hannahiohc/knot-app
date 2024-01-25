import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from '@/firebase';
import { useNavigate, Link } from "react-router-dom";
import { FirebaseError } from "@firebase/util";
import { Error, Form, Input, Switcher, Title, Wrapper, Box } from "@/components/auth-components";
import Providers from "@/components/providers";

export default function CreateAccount() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { name, value } } = e;
        if (name === "name") {
            setName(value);
        } else if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (isLoading || name === "" || email === "" || password === "") return; // if it's loading or input tags are empty, kill the function

        try {
            setLoading(true);

            // create an account
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            console.log(credentials.user);

            // set the name of the user
            await updateProfile(credentials.user, {
                displayName: name,
            });

            // redirect to the homepage
            navigate("/");
        } catch(e) {
            // setError
            if (e instanceof FirebaseError) {
                console.log(e.code, e.message);
                setError(e.message);
            }
        } finally {
            setLoading(false);
        }
        console.log(name, email, password);
    };

    return (
        <Wrapper>
            <Box>
                <Title>Sign Up</Title>
                <Form onSubmit={onSubmit}>
                    <Input name="name" onChange={onChange} value={name} placeholder="Name" type="text" required />
                    <Input name="email" onChange={onChange} value={email} placeholder="Email" type="email" required/>
                    <Input name="password" onChange={onChange} value={password} placeholder="Password" type="password" required />
                    <Input type="submit" onChange={onChange} value={isLoading ? "Loading..." : "Create Account"} /> 
                </Form>
                {error !== "" ? <Error>{error}</Error> : null}
                <Providers />
                <Switcher>
                    <p>Already have an account?
                        <Link to="/login">Sign In 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.4" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    </p>
                </Switcher>
            </Box>
            <p className="policy">By signing up, you agree to our terms of service and privacy&nbsp;policy.</p>
        </Wrapper>
    )
}