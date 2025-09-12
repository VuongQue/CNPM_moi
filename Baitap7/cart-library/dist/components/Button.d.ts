import React from "react";
type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "primary" | "danger" | "default";
};
declare const Button: React.FC<ButtonProps>;
export default Button;
