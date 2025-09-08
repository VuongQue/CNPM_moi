import React, { useState } from "react";
import axios from "axios";

const SearchFilter = () => {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("http://localhost:8080/v1/api/products/search", {
        params: {
          q,
          ...filters,
          page: 1,
          limit: 12,
        },
      });

      console.log("Kết quả API:", res.data);

      // Backend trả về { data: [...] }
      const items = res.data.data || [];

      setProducts(items);
    } catch (err) {
      console.error(err);
      setError("Có lỗi khi tìm kiếm sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Tìm kiếm sản phẩm</h2>

      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Từ khóa..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Danh mục: </label>
        <select
          onChange={(e) =>
            setFilters({ ...filters, categoryId: e.target.value })
          }
        >
          <option value="">--Tất cả--</option>
          <option value="1">Quần áo</option>
          <option value="2">Giày dép</option>
        </select>
      </div>

      <button onClick={handleSearch}>Tìm kiếm</button>

      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: 20 }}>
        {products.length === 0 && !loading && <p>Không có sản phẩm nào.</p>}
        {products.map((p) => (
          <div key={p._id} style={{ border: "1px solid #ddd", margin: "5px 0", padding: 10 }}>
            <h4>{p.productName}</h4>
            <p>{p.description}</p>
            <p>Giá: {p.price} VND</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;
