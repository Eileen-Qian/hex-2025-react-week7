import { useEffect, useState } from "react";

import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

import { currency } from "../utils/currency";
import useMessage from "../hooks/useMessage";

function OrderModal({ modalType, tempOrder, closeModal, fetchOrders }) {
  const { showSuccess, showError } = useMessage();
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    const setPaymentStatus = () => {
      setIsPaid(!!tempOrder.is_paid);
    };
    setPaymentStatus();
  }, [tempOrder]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const updateOrder = async () => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/${API_PATH}/admin/order/${tempOrder.id}`,
        {
          data: {
            ...tempOrder,
            is_paid: isPaid,
          },
        },
      );
      fetchOrders();
      closeModal();
      showSuccess(res.data.message);
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  const deleteOrder = async () => {
    try {
      const res = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/order/${tempOrder.id}`,
      );
      fetchOrders();
      closeModal();
      showSuccess(res.data.message);
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  const products = tempOrder.products ? Object.values(tempOrder.products) : [];

  return (
    <div
      id="orderModal"
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="orderModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content border-0">
          <div
            className={`modal-header bg-${
              modalType === "delete" ? "danger" : "dark"
            } text-white`}
          >
            <h5 id="orderModalLabel" className="modal-title">
              {modalType === "delete" ? "刪除訂單" : "訂單詳情"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {modalType === "delete" ? (
              <p className="fs-4">
                確定要刪除訂單
                <span className="text-danger"> {tempOrder.id} </span>
                嗎？
              </p>
            ) : (
              <>
                <div className="mb-3">
                  <h6>訂單資訊</h6>
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td className="text-muted" style={{ width: "120px" }}>
                          訂單編號
                        </td>
                        <td
                          className="text-start"
                          style={{ wordBreak: "break-all" }}
                        >
                          {tempOrder.id}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted">建立時間</td>
                        <td className="text-start">
                          {formatDate(tempOrder.create_at)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <hr />
                <div className="mb-3">
                  <h6>訂購人資訊</h6>
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td className="text-muted" style={{ width: "120px" }}>
                          Email
                        </td>
                        <td className="text-start">{tempOrder.user?.email}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">姓名</td>
                        <td className="text-start">{tempOrder.user?.name}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">電話</td>
                        <td className="text-start">{tempOrder.user?.tel}</td>
                      </tr>
                      <tr>
                        <td className="text-muted">地址</td>
                        <td className="text-start">
                          {tempOrder.user?.address}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {tempOrder.message && (
                  <>
                    <hr />
                    <div className="mb-3">
                      <h6>留言</h6>
                      <p>{tempOrder.message}</p>
                    </div>
                  </>
                )}
                <hr />
                <div className="mb-3">
                  <h6>訂購產品</h6>
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>品名</th>
                        <th style={{ width: "80px" }}>數量</th>
                        <th style={{ width: "120px" }} className="text-end">
                          小計
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((item) => (
                        <tr key={item.id}>
                          <td>{item.product?.title}</td>
                          <td>{item.qty}</td>
                          <td className="text-end">
                            NT$ {currency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="2" className="text-end fw-bold">
                          總計
                        </td>
                        <td className="text-end fw-bold">
                          NT$ {currency(tempOrder.total)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <hr />
                <div className="mb-3">
                  <h6>付款狀態</h6>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isPaid"
                      checked={isPaid}
                      onChange={(e) => setIsPaid(e.target.checked)}
                    />
                    <label
                      className={`form-check-label ${isPaid ? "text-success" : "text-danger"}`}
                      htmlFor="isPaid"
                    >
                      {isPaid ? "已付款" : "未付款"}
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            {modalType === "delete" ? (
              <>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={deleteOrder}
                >
                  確認刪除
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                >
                  關閉
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={updateOrder}
                >
                  儲存變更
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;
