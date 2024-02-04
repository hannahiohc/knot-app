import { auth } from '@/firebase';
import { GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, signInWithPopup } from "@firebase/auth";
import { useNavigate } from 'react-router';
import "./style.css";

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
        <div className="providers">
            <p>Or sign in with</p>
            <div className="providers-buttons">
                <button className="google" onClick={onClickGoogle}> 
                    <img className="provider-logo" src="/google-logo.svg"/>
                </button>
                <button className="facebook" onClick={onClickFacebook}> 
                    <img className="provider-logo" src="/facebook-logo.svg"/>
                </button>
                <button className="github" onClick={onClickGithub}> 
                    <img className="provider-logo" src="/github-logo.svg"/>
                </button>
            </div>
        </div>
    )
}