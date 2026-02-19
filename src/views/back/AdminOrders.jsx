import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import * as bootstrap from "bootstrap";

import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

import Pagination from "../../components/Pagination";
import OrderModal from "../../components/OrderModal";
import { currency } from "../../utils/currency";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [tempOrder, setTempOrder] = useState({});
  const [modalType, setModalType] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    has_pre: false,
    has_next: false,
  });

  const orderModalRef = useRef(null);

  const getOrders = async (page = 1) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/orders?page=${page}`,
      );
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  useEffect(() => {
    // 從 Cookie 取得 Token
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexW2Token="))
      ?.split("=")[1];
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }

    orderModalRef.current = new bootstrap.Modal("#orderModal", {
      keyboard: false,
    });

    document
      .querySelector("#orderModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

    const checkLogin = async () => {
      try {
        await axios.post(`${API_BASE}/api/user/check`);
        getOrders();
      } catch (error) {
        console.error(error.response.data.message);
        navigate("/login");
      }
    };

    checkLogin();
  }, [navigate]);

  const openModal = (type, order) => {
    setModalType(type);
    setTempOrder({ ...order });
    setTimeout(() => {
      orderModalRef.current.show();
    }, 0);
  };

  const closeModal = () => {
    orderModalRef.current.hide();
  };

  const logout = async () => {
    await axios.post(`${API_BASE}/logout`);
    document.cookie =
      "hexW2Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/hex-2025-react-week7;";
    navigate("/login");
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

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
          <button className="btn btn-outline-primary" onClick={() => logout()}>
            登出
          </button>
        </div>
        <h2 className="mt-4">訂單列表</h2>
        <div className="table-responsive">
          <table className="table mt-4 align-middle">
            <thead>
              <tr>
                <th style={{ width: "120px" }}>訂單編號</th>
                <th>訂購人 Email</th>
                <th>訂購人姓名</th>
                <th className="text-end">金額</th>
                <th className="text-center">付款狀態</th>
                <th>建立時間</th>
                <th style={{ width: "140px" }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span title={order.id}>{order.id.substring(0, 8)}...</span>
                  </td>
                  <td>{order.user?.email}</td>
                  <td>{order.user?.name}</td>
                  <td className="text-end">NT$ {currency(order.total)}</td>
                  <td className="text-center">
                    <span
                      className={`badge ${order.is_paid ? "bg-success" : "bg-danger"}`}
                    >
                      {order.is_paid ? "已付款" : "未付款"}
                    </span>
                  </td>
                  <td>{formatDate(order.create_at)}</td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal("view", order)}
                      >
                        查看
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openModal("delete", order)}
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
      </div>

      <Pagination pagination={pagination} onChangePage={getOrders} />

      <OrderModal
        modalType={modalType}
        tempOrder={tempOrder}
        closeModal={closeModal}
        getOrders={getOrders}
      />
    </>
  );
}

export default AdminOrders;
