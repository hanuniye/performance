import { toast } from "sonner";
import axios from "../api/axios";
import { useGlobalProvider } from "./useGlobalProvider";

const useLogout = () => {
  const { setAuth } = useGlobalProvider();

  const logout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      setAuth(null); // Clear global state
      localStorage.removeItem("auth"); // Clear localStorage
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        console.log(error);
      }
    }
  };

  return logout;
};

export default useLogout;
