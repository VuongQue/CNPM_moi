import { Result } from "antd";
import { CrownOutlined } from "@ant-design/icons";
import ProductList from "../components/layout/ProductList";

const HomePage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Result
        icon={<CrownOutlined />}
        title="JSON Web Token (React/Node.js) - iotstar.vn"
      />
      {/* Thêm danh sách sản phẩm */}
      <ProductList />
    </div>
  );
};

export default HomePage;
