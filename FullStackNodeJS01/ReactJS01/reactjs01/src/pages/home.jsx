import { Result } from "antd";
import { CrownOutlined } from "@ant-design/icons";
import ProductList from "../components/ProductList";
import SearchFilter from "../components/SearchFilter";

const HomePage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <Result
        icon={<CrownOutlined />}
        title="JSON Web Token (React/Node.js) - iotstar.vn"
      />

      {/* Thêm ô tìm kiếm + bộ lọc */}
      <SearchFilter />

      {/* Danh sách sản phẩm */}
      <ProductList />
    </div>
  );
};

export default HomePage;
