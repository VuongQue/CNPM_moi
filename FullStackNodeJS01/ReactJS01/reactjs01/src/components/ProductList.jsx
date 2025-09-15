import { useEffect, useState } from "react";
import { Row, Col, Card, Spin, Pagination } from "antd";

const { Meta } = Card;

const ProductList = ({ products, initialLoad = true }) => {
  const [data, setData] = useState(products || []);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 12;

  // Load mặc định từ API khi initialLoad = true
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

  // Lần đầu load
  useEffect(() => {
    if (initialLoad) fetchProducts(page);
  }, [page]);

  // Nếu SearchFilter bắn props mới xuống → update ngay
  useEffect(() => {
    if (products && products.length >= 0) {
      setData(products);
      setTotalItems(products.length);
    }
  }, [products]);

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
            <Card
              hoverable
              style={{ width: "100%" }}
              cover={
                <img
                  src={p.image}
                  alt={p.productName}
                  style={{ height: 180, objectFit: "cover" }}
                />
              }
            >
              <Meta
                title={p.productName}
                description={
                  <>
                    <p style={{ color: "red", fontWeight: "bold" }}>
                      {p.price?.toLocaleString()} đ
                    </p>
                    <p>{p.description}</p>
                  </>
                }
              />
            </Card>
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
