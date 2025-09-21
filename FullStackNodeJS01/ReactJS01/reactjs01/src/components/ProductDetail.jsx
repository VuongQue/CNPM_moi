import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Card, Spin, Button, message } from "antd";
import { HeartOutlined } from "@ant-design/icons";

const { Meta } = Card;

const ProductDetail = () => {
  const { id } = useParams(); // lấy id từ URL
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [recentViews, setRecentViews] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  // Gọi API lấy chi tiết sản phẩm
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8080/v1/api/products/${id}`);
      const data = await res.json();
      setProduct(data);

      // Ghi nhận lượt xem
      await fetch(`http://localhost:8080/v1/api/products/${id}/view`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("❌ Lỗi khi load chi tiết:", err);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API lấy sản phẩm tương tự
  const fetchRelated = async () => {
    try {
      const res = await fetch(`http://localhost:8080/v1/api/products/${id}/related`);
      const data = await res.json();
      setRelated(data || []);
    } catch (err) {
      console.error("❌ Lỗi khi load sản phẩm tương tự:", err);
    }
  };

  // Gọi API lấy sản phẩm đã xem
  const fetchRecentViews = async () => {
    try {
      const res = await fetch(`http://localhost:8080/v1/api/products/views`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRecentViews(data || []);
    } catch (err) {
      console.error("❌ Lỗi khi load sản phẩm đã xem:", err);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchRelated();
    fetchRecentViews();
  }, [id]);

  const handleFavorite = async () => {
    try {
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

  if (loading || !product) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{product.productName}</h2>
      <Row gutter={16}>
        <Col span={8}>
          <img
            src={product.image}
            alt={product.productName}
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Col>
        <Col span={16}>
          <p style={{ fontSize: 20, color: "red", fontWeight: "bold" }}>
            {product.price?.toLocaleString()} đ
          </p>
          <p>{product.description}</p>
          <p>👥 {product.purchaseCount || 0} khách mua</p>
          <p>💬 {product.commentCount || 0} bình luận</p>
          <Button
            type="primary"
            icon={<HeartOutlined />}
            onClick={handleFavorite}
          >
            Thêm vào yêu thích
          </Button>
        </Col>
      </Row>

      {/* Sản phẩm tương tự */}
      <div style={{ marginTop: 40 }}>
        <h3>Sản phẩm tương tự</h3>
        <Row gutter={[16, 16]}>
          {related.map((p) => (
            <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
              <Card
                hoverable
                cover={
                  <img
                    src={p.image}
                    alt={p.productName}
                    style={{ height: 160, objectFit: "cover" }}
                  />
                }
              >
                <Meta
                  title={p.productName}
                  description={
                    <p style={{ color: "red", fontWeight: "bold" }}>
                      {p.price?.toLocaleString()} đ
                    </p>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Sản phẩm đã xem */}
      <div style={{ marginTop: 40 }}>
        <h3>Sản phẩm bạn đã xem</h3>
        <Row gutter={[16, 16]}>
          {recentViews.map((p) => (
            <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
              <Card
                hoverable
                cover={
                  <img
                    src={p.image}
                    alt={p.productName}
                    style={{ height: 160, objectFit: "cover" }}
                  />
                }
              >
                <Meta
                  title={p.productName}
                  description={
                    <p style={{ color: "red", fontWeight: "bold" }}>
                      {p.price?.toLocaleString()} đ
                    </p>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default ProductDetail;
