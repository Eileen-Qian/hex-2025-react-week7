import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { ThreeDots } from "react-loader-spinner";
import { emailValidatoin, taiwanPhoneValidation } from "../../utils/validation";
import { currency } from "../../utils/currency";

const fetchCart = async () => {
  const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
  return res.data.data;
};

function CheckOut() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [isChecking, setIsChecking] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await fetchCart();
        setCart(data);
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      name: "",
      tel: "",
      address: "",
    },
  });

  const onSubmit = async (formData) => {
    const { message, ...user } = formData;
    const data = {
      user,
      message,
    };
    setIsChecking(true);
    try {
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
        data,
      });
      fetchCart();
      alert(res.data.message);
    } catch (error) {
      console.error(error);
    } finally {
      navigate("/products");
      setIsChecking(null);
    }
  };



  if (!cart) return <p className="text-center fs-2 mt-5">載入中...</p>;

  if (cart.carts.length === 0) {
    return (
      <>
        <p className="text-center fs-4 mt-5">購物車是空的</p>
        <NavLink className="nav-link" to="/products">
          <button className="btn btn-primary">前往選購</button>
        </NavLink>
      </>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">結帳頁面</h2>
      <NavLink className="nav-link text-end" to="/cart">
        <button className="btn btn-primary">回購物車</button>
      </NavLink>
      <div
        style={{
          maxHeight: "250px",
          overflowY: "auto",
        }}
      >
        <table className="table align-middle mb-0">
          <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <tr>
              <th style={{ width: "100px" }}>圖片</th>
              <th style={{ width: "200px" }}>品名</th>
              <th style={{ width: "200px" }}>數量</th>
              <th style={{ width: "120px" }}>小計</th>
            </tr>
          </thead>
          <tbody>
            {cart.carts.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{item.product.title}</td>
                <td>
                  <span className="fs-3 text-primary">{item.qty}</span>
                </td>
                <td>NT$ {currency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <table className="table align-middle mb-0">
        <tfoot>
          <tr>
            <td style={{ width: "500px" }}></td>
            <td></td>
            <td style={{ width: "200px" }} className="text-end fw-bold">
              總計
            </td>
            <td style={{ width: "200px" }} className="text-end fw-bold">
              NT$ {currency(cart.final_total)}
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="請輸入 Email"
              {...register("email", emailValidatoin)}
            />
            {errors.email && (
              <p className="text-danger">{errors?.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="請輸入姓名"
              {...register("name", {
                required: "請輸入 收件人姓名",
              })}
            />
            {errors.name && (
              <p className="text-danger">{errors?.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              name="tel"
              type="tel"
              className="form-control"
              placeholder="請輸入電話"
              {...register("tel", taiwanPhoneValidation)}
            />
            {errors.tel && <p className="text-danger">{errors?.tel.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-control"
              placeholder="請輸入地址"
              {...register("address", {
                required: "請輸入 收件人地址",
              })}
            />
            {errors.address && (
              <p className="text-danger">{errors?.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register("message")}
            ></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-primary w-100">
              {isChecking ? (
                <ThreeDots
                  visible={true}
                  height="30"
                  width="80"
                  color="#fff"
                  radius="9"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{ display: "flex", justifyContent: "center" }}
                />
              ) : (
                "送出訂單"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckOut;
