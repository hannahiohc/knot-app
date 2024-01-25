import { auth } from '@/firebase';
import { GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, signInWithPopup } from "@firebase/auth";
import { useNavigate } from 'react-router';
import { styled } from "styled-components";

const Wrapper = styled.div`
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    p {
        margin-right: 5px;
    }
`;

const Buttons = styled.div`
    width: 130px;
    display: flex;
    justify-content: space-around;

    button {
        width: 32px;
        height: 32px;
        border: 1px solid var(--lightgrey);
        border-radius: 50%;
        background-color: var(--white);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:hover {
            border: 1px solid rgba(170, 71, 58, 0.3);
        }
    }
`;

const Logo = styled.img`
    height: 18px;
`;

export default function Providers() {
    const navigate = useNavigate();
    const onClickGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            // await signInWithRedirect(auth, provider);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    }

    const onClickFacebook = async () => {
        try {
            const provider = new FacebookAuthProvider();
            await signInWithPopup(auth, provider);
            // await signInWithRedirect(auth, provider);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    }

    const onClickGithub = async () => {
        try {
            const provider = new GithubAuthProvider();
            await signInWithPopup(auth, provider);
            // await signInWithRedirect(auth, provider);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Wrapper>
            <p>Or sign in with</p>
            <Buttons>
                <button className="google" onClick={onClickGoogle}> 
                    <Logo src="/google-logo.svg"/>
                </button>
                <button className="facebook" onClick={onClickFacebook}> 
                    <Logo src="/facebook-logo.svg"/>
                </button>
                <button className="github" onClick={onClickGithub}> 
                    <Logo src="/github-logo.svg"/>
                </button>
            </Buttons>
        </Wrapper>
    )
}