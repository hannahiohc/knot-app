import { styled } from "styled-components";

export const Wrapper = styled.div`
    width: 430px;
    height: 100%;
    padding: 50px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p.policy {
        width: 90%;
        font-size: 11px;
        line-height: 15px;
        text-align: center;
        color: var(--brown);
        margin-top: 8px;
    }
`;

export const Box = styled.div`
    width: 100%;
    padding: 60px 40px 62px;
    border-radius: 30px;
    background-color: var(--white);
    display: flex;
    flex-direction: column;
    align-items: center;
    filter: drop-shadow(2px 2px 10px rgba(130, 110, 64, 0.1)); 
`;

export const Title = styled.h1`
    font-size: 38px;
    font-weight: 600;
    font-family: var(--sans-serif);
    text-align: center;
`;

export const Form = styled.form`
    width: 100%;
    margin-top: 40px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const Input = styled.input`
    width: 100%;
    padding: 13px 17px;
    border: 1px solid var(--lightgrey);
    border-radius: 8px;
    font-size: 12px;

    &::placeholder {
        font-size: 12px;
    }
    
    &:focus {
        outline: none;
        border: 1px solid var(--color-3);
    }

    &[type="submit"] {
        background-color: var(--color-4);
        color: var(--white);
        font-size: 13px;
        cursor: pointer;
        border: none;
        transition: all 350ms ease; 
        
        &:hover {
            opacity: 0.9;
        }
    }
`;

export const Sucess = styled.span`
    color: var(--grey);
    font-size: 12px;
`;

export const Error = styled.span`
    color: var(--grey);
    font-size: 12px;
`;

export const Switcher = styled.span`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 25px;

    p.createaccount {
        margin-bottom: 10px;
    }

    a {
        margin-left: 4.5px;
        color: var(--color-4);

        &:hover {
            text-decoration: underline;
        }
    }

    svg {
        width: 13px;
        margin-left: 1px;
        vertical-align: -2px;
    }
`;

// export const ErrorMessages = {
//     "auth/email-already-in-use": "That email already exists.",
//     "auth/invalid-credential": "Incorrect email or password.",
//     "auth/invalid-email": "Email not found. Please check the email address."
// }