import { useEffect, useState } from "react";
import { Row, Col, Spin, Pagination, message } from "antd";
import ProductCard from "./ProductCard";

const ProductList = ({ products, initialLoad = true }) => {
  const [data, setData] = useState(products || []);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 12;

  const fetchProducts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/v1/api/products?page=${pageNumber}&limit=${limit}`
      );
      const result = await res.json();
      setData(result.products || []);
      setTotalItems(result.totalItems || 0);
      setPage(result.page || 1);
    } catch (err) {
      console.error("Lỗi khi load sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialLoad) fetchProducts(page);
  }, [page, initialLoad]);

  useEffect(() => {
    if (products && products.length >= 0) {
      setData(products);
      setTotalItems(products.length);
    }
  }, [products]);

  const handleFavorite = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8080/v1/api/products/${id}/favorite`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Lỗi khi thêm vào yêu thích");
      message.success("Đã thêm vào yêu thích!");
    } catch (err) {
      console.error(err);
      message.error("Không thể thêm vào yêu thích");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <p>Không có sản phẩm nào.</p>;
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        {data.map((p) => (
          <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
            <ProductCard product={p} onFavorite={handleFavorite} />
          </Col>
        ))}
      </Row>

      {initialLoad && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Pagination
            current={page}
            pageSize={limit}
            total={totalItems}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
          />
        </div>
      )}
    </>
  );
};

export default ProductList;
