import axios from "../api/axios";
import { useGlobalProvider } from "./useGlobalProvider";

const REFRESH_URL = "/auth/refresh";

const useRefreshToken = () => {
  const { setAuth } = useGlobalProvider();

  const refresh = async () => {
    try {
      const resp = await axios.get(REFRESH_URL, {
        withCredentials: true, // this helps us to send cookies with request to the server
      });

      setAuth((prev) => {
        // console.log(JSON.stringify(prev));
        // console.log(resp.data.accessToken);
        return {
          ...prev,
          accessToken: resp.data.accessToken,
          role: resp.data.role,
        };
      });

      return resp.data.accessToken;
    } catch (error) {
      console.log(error.response);
    }
  };

  return refresh;
};

export default useRefreshToken;
