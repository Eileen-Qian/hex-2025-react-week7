import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import * as bootstrap from "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

import "../../assets/scss/all.scss";

import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

import ProductModal from "../../components/ProductModal";
import Pagination from "../../components/Pagination";
import { currency } from "../../utils/currency";

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
  shipping: []
};

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    has_pre: false,
    has_next: false,
  });

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const productModalRef = useRef(null);

  useEffect(() => {
    // 從 Cookie 取得 Token
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexW2Token="))
      ?.split("=")[1];
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }

    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });

    // Modal 關閉時移除焦點
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

    const checkLogin = async () => {
      try {
        await axios.post(`${API_BASE}/api/user/check`);
        getProducts();
      } catch (error) {
        console.error(error.response.data.message);
        navigate("/login");
      }
    };

    checkLogin();
  }, [navigate]);

  const openModal = (type, product) => {
    setModalType(type);
    // 不要每次都解構重建，直接傳遞
  if (type === "create") {
    setTemplateProduct(INITIAL_TEMPLATE_DATA);
  } else {
    setTemplateProduct(product);
  }
  // 延遲開啟 modal，確保 state 更新完成
  setTimeout(() => {
    productModalRef.current.show();
  }, 0);
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  const logout = async () => {
    await axios.post(`${API_BASE}/logout`);
    document.cookie = "hexW2Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/hex-2025-react-week7;";
    navigate('/login');
  }

  return (
    <>
      <div className="container">
        <div className="mt-4 d-flex justify-content-between">
          <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/")}
        >
          回前台
          </button>
          <button
          className="btn btn-outline-primary"
          onClick={() => logout()}
        >
          登出
        </button>
        </div>
        <div className="text-end mt-4">
          <button
            className="btn btn-primary"
            onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
          >
            建立新的產品
          </button>
        </div>
        <h2>產品列表</h2>
        <table className="table mt-4">
          <thead>
            <tr>
              <th>分類</th>
              <th>產品名稱</th>
              <th>原價</th>
              <th>售價</th>
              <th>是否啟用</th>
              <th>編輯</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.category}</td>
                <td>{product.title}</td>
                <td>
                  {currency(product.origin_price)}
                </td>
                <td>
                  {currency(product.price)}
                </td>
                <td className={product.is_enabled ? "text-success" : ""}>
                  {product.is_enabled ? "啟用" : "未啟用"}
                </td>
                <td>
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => openModal("edit", product)}
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => openModal("delete", product)}
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination pagination={pagination} onChangePage={getProducts} />

      <ProductModal
        getProducts={getProducts}
        modalType={modalType}
        templateProduct={templateProduct}
        closeModal={closeModal}
      />
    </>
  );
}

export default AdminProducts;
