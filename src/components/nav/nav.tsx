import { Link, Outlet } from "react-router-dom";
import { auth } from "@/firebase";
import { useEffect, useState } from "react";
import "./style.css";

export default function Layout() {
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []); // empty dependency array to run the effect only once on mount

    return (
        <div className="layout">
            <nav>
                <div className="logo">
                    <Link to="/">knot</Link>
                </div>
                <div className="menu">
                    <Link to="/profile">
                        <span className="nav-username">{user?.displayName ?? "Anonymous"}</span>
                        <img className="nav-profile" src={user?.photoURL ?? "null"} />
                    </Link>
                </div>
            </nav>
            <Outlet />
        </div>
    )
}