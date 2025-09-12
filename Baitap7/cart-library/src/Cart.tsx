import React, { useState } from "react";
import Button from "./components/Button";
import Input from "./components/Input";
import Card from "./components/Card";

type Product = {
  id: number;
  name: string;
  quantity: number;
};

const Cart: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");

  const addProduct = () => {
    if (!name) return;
    setCart([...cart, { id: Date.now(), name, quantity: parseInt(quantity) }]);
    setName("");
    setQuantity("1");
  };

  const removeProduct = (id: number) => {
    setCart(cart.filter((p) => p.id !== id));
  };

  const updateQuantity = (id: number, qty: number) => {
    setCart(cart.map((p) => (p.id === id ? { ...p, quantity: qty } : p)));
  };

  return (
    <div>
      <h2>Giỏ hàng</h2>
      <Input value={name} onChange={setName} placeholder="Tên sản phẩm" />
      <Input value={quantity} onChange={setQuantity} placeholder="Số lượng" />
      <Button type="primary" onClick={addProduct}>Thêm</Button>

      <div>
        {cart.map((item) => (
          <Card key={item.id} title={item.name}>
            <p>Số lượng: {item.quantity}</p>
            <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
            <Button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</Button>
            <Button type="danger" onClick={() => removeProduct(item.id)}>Xóa</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Cart;
