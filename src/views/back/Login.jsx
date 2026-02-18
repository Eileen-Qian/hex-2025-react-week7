import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ThreeDots } from "react-loader-spinner";

import { emailValidatoin, passwordValidation } from "../../utils/validation";

const API_BASE = import.meta.env.VITE_API_BASE;

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(null);
  const [loginMessage, setLoginMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = res.data;
      document.cookie = `hexW2Token=${token}; expires=${new Date(expired)}; path=/hex-2025-react-week7;`;
      axios.defaults.headers.common["Authorization"] = token;
      setIsSuccess(true);
      setLoginMessage("登入成功");
      setTimeout(() => {
        navigate("/admin");
      }, 500);
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setLoginMessage(error?.response.data?.message);
    } finally {
      setTimeout(() => {
        setLoginMessage("");
        setIsLoading(false);
      }, 1000);
    }
  };
  return (
    <>
      <div className="container login">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/")}
        >
          回前台
        </button>
        <div className="row justify-content-center">
          <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
          <div className="col-8">
            <form
              id="form"
              className="form-signin"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="name@example.com"
                  {...register("username", emailValidatoin)}
                  autoFocus
                />
                <label htmlFor="username">Email address</label>
                {errors.username && (
                  <p className="text-danger">{errors.username.message}</p>
                )}
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Password"
                  {...register("password", passwordValidation)}
                />
                <label htmlFor="password">Password</label>
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </div>
              <button
                className="btn btn-lg btn-primary w-100 mt-3"
                type="submit"
              >
                {isLoading ? (
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
                  "登入"
                )}
              </button>
            </form>
            {loginMessage && (
              <p
                className={`h3 mt-3
                  ${isSuccess ? "text-success" : "text-danger"}`}
              >
                {loginMessage}
              </p>
            )}
          </div>
        </div>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>
    </>
  );
}

export default Login;
