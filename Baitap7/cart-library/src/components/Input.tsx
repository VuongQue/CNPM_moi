import React from "react";

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const Input: React.FC<InputProps> = ({ value, onChange, placeholder }) => {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: "8px", margin: "4px", borderRadius: "4px", border: "1px solid #ccc" }}
    />
  );
};

export default Input;
