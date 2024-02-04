import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from '@/firebase';
import { useNavigate, Link } from "react-router-dom";
import { FirebaseError } from "@firebase/util";
import "@/styles/auth-compontnets.css"
import Providers from "@/components/providers/providers";

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
        <div className="auth">
            <div className="auth-container">
                <h1 className="auth-title">Sign Up</h1>
                <form className="auth-form" onSubmit={onSubmit}>
                    <input className="auth-input" name="name" onChange={onChange} value={name} placeholder="Name" type="text" required />
                    <input className="auth-input" name="email" onChange={onChange} value={email} placeholder="Email" type="email" required/>
                    <input className="auth-input" name="password" onChange={onChange} value={password} placeholder="Password" type="password" required />
                    <input className="auth-input" type="submit" onChange={onChange} value={isLoading ? "Loading..." : "Create Account"} /> 
                </form>
                {error !== "" ? <span className="auth-result">{error}</span> : null}
                <Providers />
                <div className="switcher">
                    <p>Already have an account?
                        <Link to="/login">Sign In 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.4" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    </p>
                </div>
            </div>
            <p className="policy">By signing up, you agree to our terms of service and privacy&nbsp;policy.</p>
        </div>
    )
}