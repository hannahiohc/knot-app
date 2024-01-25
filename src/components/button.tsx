import React from 'react';
import styled, { css } from 'styled-components';

interface StyledButtonProps {
    primary?: boolean;
    secondary?: boolean;
}

const primaryStyles = css<StyledButtonProps>`
    padding: 5px 15px;
    background-color: var(--color-4);
    color: var(--white);
    font-size: 13px;
    font-weight: 600;
`;

const secondaryStyles = css<StyledButtonProps>`
    padding: 3px 10px;
    background-color: var(--color-2);
    color: var(--brown);
    font-size: 12px;
`;

const StyledButton = styled.button<StyledButtonProps>`
    border: none;
    cursor: pointer;
    border-radius: 20px;
    transition: all 350ms ease; 
    display: inline-block;
    width: fit-content;
    &:hover,
    &:active {
        opacity: 0.9;
    }

    ${(props) => props.primary && primaryStyles}
    ${(props) => props.secondary && secondaryStyles}
`;

interface ButtonProps extends StyledButtonProps {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    children?: React.ReactNode;
    submitValue?: string;
    buttonValue?: string;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ type = 'button', primary, secondary, submitValue, buttonValue, children, ...props }) => {
    return (
        <StyledButton {...props} type={type} primary={primary} secondary={secondary}>
            {type === 'submit' && submitValue ? submitValue : buttonValue || children}
        </StyledButton>
    );
};

export default Button;
