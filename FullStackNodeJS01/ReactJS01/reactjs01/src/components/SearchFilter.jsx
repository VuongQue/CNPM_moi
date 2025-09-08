import { useState } from "react";
import axios from "axios";

function SearchFilter() {
  const [q, setQ] = useState("");
  const [products, setProducts] = useState([]);

  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    discount: "",
    sort: "views" // hoặc "price"
  });

  const handleSearch = async () => {
    try {
      const res = await axios.get("http://localhost:8080/v1/api/search", {
        params: {
          q,
          ...filters,
          page: 1,
          limit: 12
        }
      });
      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>Tìm kiếm sản phẩm</h2>
      <input
        type="text"
        placeholder="Nhập từ khóa..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button onClick={handleSearch}>Tìm kiếm</button>

      <div>
        <h4>Bộ lọc</h4>
        <select onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">--Danh mục--</option>
          <option value="1">Quần áo</option>
          <option value="2">Giày dép</option>
        </select>
        <input
          type="number"
          placeholder="Giá từ"
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />
        <input
          type="number"
          placeholder="Đến"
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
        <input
          type="number"
          placeholder="Khuyến mãi từ %"
          onChange={(e) => setFilters({ ...filters, discount: e.target.value })}
        />
        <select onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
          <option value="views">Lượt xem</option>
          <option value="price">Giá</option>
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginTop: "20px" }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ddd", padding: "10px" }}>
            <h3>{p.productName}</h3>
            <p>{p.price} đ</p>
            <p>Giảm: {p.discountPercent}%</p>
            <p>Lượt xem: {p.views}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchFilter;
