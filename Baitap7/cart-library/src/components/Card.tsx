import React from "react";

type CardProps = {
  title: string;
  children: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", margin: "8px" }}>
      <h3>{title}</h3>
      {children}
    </div>
  );
};

export default Card;
