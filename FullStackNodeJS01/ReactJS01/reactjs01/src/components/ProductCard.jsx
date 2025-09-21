import { Card, Tooltip, Button } from "antd";
import { HeartOutlined, EyeOutlined, ShoppingCartOutlined, MessageOutlined } from "@ant-design/icons";

const { Meta } = Card;

const ProductCard = ({ product, onFavorite }) => {
  return (
    <Card
      hoverable
      style={{ width: "100%" }}
      cover={
        <img
          src={product.image}
          alt={product.productName}
          style={{ height: 180, objectFit: "cover" }}
        />
      }
      actions={[
        <Tooltip title="Thêm yêu thích">
          <HeartOutlined onClick={() => onFavorite(product._id)} />
        </Tooltip>,
        <Tooltip title="Xem chi tiết">
          <EyeOutlined />
        </Tooltip>,
        <Tooltip title="Mua ngay">
          <ShoppingCartOutlined />
        </Tooltip>,
      ]}
    >
      <Meta
        title={product.productName}
        description={
          <>
            <p style={{ color: "red", fontWeight: "bold" }}>
              {product.price?.toLocaleString()} đ
            </p>
            <p>{product.description}</p>
            <p>
              👥 {product.purchaseCount || 0} khách mua | 💬 {product.commentCount || 0} bình luận
            </p>
          </>
        }
      />
    </Card>
  );
};

export default ProductCard;
