import { toast } from "sonner";
import axios from "../api/axios";
import { useGlobalProvider } from "./useGlobalProvider";

const useLogout = () => {
  const { setAuth, auth } = useGlobalProvider();

  const logout = async () => {
    try {
      setAuth(null); // Clear global state
      localStorage.removeItem("auth"); // Clear localStorage
      // console.log("begins");
      // const logout = await axios.post(
      //   "/auth/logout",
      //   {},
      //   { withCredentials: true }
      // );
      // console.log(logout);
     
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        toast.error(error.response.data.error);
      } else {
        console.log(error);
      }
    }
  };

  return logout;
};

export default useLogout;
