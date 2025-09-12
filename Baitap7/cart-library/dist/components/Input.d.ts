import React from "react";
type InputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};
declare const Input: React.FC<InputProps>;
export default Input;
