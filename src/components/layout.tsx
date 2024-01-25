import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";
import { auth } from "@/firebase";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    max-width: 700px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const Nav = styled.nav`
    width: 98%;
    padding: 15px 0 20px 0;
    display: flex;
    justify-content: space-between;
`;
const Logo = styled.div`
    display: flex;
    align-items: center;
    a {
        font-family: var(--sans-serif);
        font-weight: 600;
        font-size: 24px;
        text-decoration: none;
        color: var(--black);
        letter-spacing: 2px;
    }
`;
const Menu = styled.div`
    a {
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
    }
`;
const Avatar = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
`;
const Name = styled.span`
    font-weight:500;
    font-size: 15px;
`;

export default function Layout() {
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []); // empty dependency array to run the effect only once on mount

    return (
        <Wrapper>
            <Nav>
                <Logo>
                    <Link to="/">knot</Link>
                </Logo>
                <Menu>
                    <Link to="/profile">
                        <Name>{user?.displayName ?? "Anonymous"}</Name>
                        <Avatar src={user?.photoURL ?? "null"}></Avatar>
                    </Link>
                </Menu>
            </Nav>
            <Outlet />
        </Wrapper>
    )
}