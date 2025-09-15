import { useState } from "react";
import axios from "axios";

const SearchFilter = ({ setProducts }) => {
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🔍 Gửi request với params:", { q, ...filters, page: 1, limit: 12 });

      const res = await axios.get("http://localhost:8080/v1/api/products/search", {
        params: { q, ...filters, page: 1, limit: 12 },
      });

      console.log("✅ Response từ API:", res.data);

      const items = res.data.data || [];
      console.log("📦 Danh sách sản phẩm nhận được:", items);

      if (typeof setProducts !== "function") {
        console.error("❌ Lỗi: setProducts không phải là function!", setProducts);
      } else {
        setProducts(items); // cập nhật danh sách sản phẩm
      }
    } catch (err) {
      console.error("❌ Lỗi khi gọi API search:", err);
      setError("Có lỗi khi tìm kiếm sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Từ khóa..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: 6, width: 200 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Danh mục: </label>
        <select
          onChange={(e) =>
            setFilters({ ...filters, categoryId: e.target.value })
          }
          style={{ padding: 6 }}
        >
          <option value="">--Tất cả--</option>
          <option value="1">Quần áo</option>
          <option value="2">Giày dép</option>
        </select>
      </div>

      <button onClick={handleSearch} style={{ padding: "6px 12px" }}>
        Tìm kiếm
      </button>

      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SearchFilter;
