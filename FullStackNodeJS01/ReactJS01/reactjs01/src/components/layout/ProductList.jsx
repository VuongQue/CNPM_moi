import { useState, useEffect } from "react";
import axios from "axios";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (pageNum) => {
    try {
      const res = await axios.get("http://localhost:8080/v1/api/products", {
        params: { page: pageNum, limit: 12 },
      });

      console.log("API response:", res.data);

      // Lấy dữ liệu theo format ở controller
      setProducts(res.data.products || []); 
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.page || pageNum);
    } catch (err) {
      console.error("API error:", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2 style={{ marginBottom: "10px" }}>Danh sách sản phẩm</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        {products.length > 0 ? (
          products.map((p) => (
            <div
              key={p._id || p.id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <img
                src={p.imageUrl}
                alt={p.productName}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <h3 style={{ fontSize: "16px", margin: "8px 0" }}>
                {p.productName}
              </h3>
              <p style={{ color: "red", fontWeight: "bold" }}>
                {p.price?.toLocaleString()} đ
              </p>
            </div>
          ))
        ) : (
          <p>Không có sản phẩm nào</p>
        )}
      </div>

      {/* Nút phân trang */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          style={{ marginRight: "10px" }}
        >
          ⬅ Trang trước
        </button>
        <span>
          Trang {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          style={{ marginLeft: "10px" }}
        >
          Trang sau ➡
        </button>
      </div>
    </div>
  );
}

export default ProductList;
