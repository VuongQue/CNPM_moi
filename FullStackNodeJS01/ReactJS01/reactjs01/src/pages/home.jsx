import { useState } from "react";
import { Result } from "antd";
import { CrownOutlined } from "@ant-design/icons";
import ProductList from "../components/ProductList";
import SearchFilter from "../components/SearchFilter";

const HomePage = () => {
  const [products, setProducts] = useState([]); // quản lý state ở cha

  return (
    <div style={{ padding: "20px" }}>
      <Result
        icon={<CrownOutlined />}
        title="JSON Web Token (React/Node.js) - iotstar.vn"
      />

      {/* Truyền setProducts cho SearchFilter */}
      <SearchFilter setProducts={setProducts} />

      {/* Truyền products cho ProductList */}
      <ProductList products={products} />
    </div>
  );
};

export default HomePage;
