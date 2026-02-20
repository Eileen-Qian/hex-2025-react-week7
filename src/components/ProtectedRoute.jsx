import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { Navigate } from "react-router";

function ProtectedRoute({ children }) {
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // 從 Cookie 取得 Token
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexW2Token="))
      ?.split("=")[1];
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }
      const checkLogin = async () => {
          setIsLoading(true);
      try {
        await axios.post(`${API_BASE}/api/user/check`);
        setIsAuth(true)
      } catch (error) {
        console.error(error.response.data.message);
      } finally {
          setIsLoading(false);
      }
    };
    checkLogin();
  }, []);
    if (isLoading) return <RotatingLines color={'var(--bs-primary)'} wrapperStyle={{ justifyContent: "center" }} />
    if (!isAuth) return <Navigate to="/login" />
  return children;
}

export default ProtectedRoute;
