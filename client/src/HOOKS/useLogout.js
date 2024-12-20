import axios from "../api/axois";
import { useAuth } from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      setAuth(null); // Clear global state
      localStorage.removeItem("auth"); // Clear localStorage
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  };

  return logout
};

export default useLogout;
