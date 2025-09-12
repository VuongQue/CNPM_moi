import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "primary" | "danger" | "default";
};

const Button: React.FC<ButtonProps> = ({ children, onClick, type = "default" }) => {
  const styles = {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    backgroundColor:
      type === "primary" ? "#007bff" : type === "danger" ? "#dc3545" : "#6c757d",
    color: "#fff",
    margin: "4px",
  };
  return (
    <button style={styles} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
