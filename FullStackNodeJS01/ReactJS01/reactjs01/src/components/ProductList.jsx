import { useEffect, useState } from "react";
import { Card, Pagination, Row, Col, Spin } from "antd";

const { Meta } = Card;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 12; // số sản phẩm / trang

  const fetchProducts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/v1/api/products?page=${pageNumber}&limit=${limit}`
      );
      const data = await res.json();
      setProducts(data.products || []);
      setTotalItems(data.totalItems || 0);
      setPage(data.page || 1);
    } catch (error) {
      console.error("Lỗi khi load sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  return (
    <div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {products.map((p) => (
              <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
                <Card
                  hoverable
                  style={{ width: "100%" }}
                  cover={
                    <img
                      src={p.image} 
                      alt={p.name}
                    
                      style={{ height: 180, objectFit: "cover" }}
                    />
                  }
                >
                  <Meta
                    title={p.name}
                    description={
                      <>
                        <p
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            marginBottom: 4,
                          }}
                        >
                          {p.price.toLocaleString()} đ
                        </p>
                        <p
                          style={{
                            color: "rgba(0,0,0,0.65)",
                            fontSize: 13,
                            margin: 0,
                          }}
                        >
                          {p.description}
                        </p>
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Pagination
              current={page}
              pageSize={limit}
              total={totalItems}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
