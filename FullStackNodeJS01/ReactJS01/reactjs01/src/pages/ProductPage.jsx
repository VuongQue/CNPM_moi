import { useState } from "react";
import SearchFilter from "../components/SearchFilter";
import ProductList from "../components/ProductList";

const ProductPage = () => {
  const [products, setProducts] = useState([]);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Quản lý sản phẩm</h2>
      {/* Truyền setProducts xuống cho SearchFilter */}
      <SearchFilter setProducts={setProducts} />

      {/* Truyền products xuống cho ProductList */}
      <ProductList products={products} />
    </div>
  );
};

export default ProductPage;
