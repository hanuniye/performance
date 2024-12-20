import { usePrivateAxios } from "../HOOKS/usePrivateAxios";

export const HRApi = () => {


  const getHRs = async () => {
    try {
      const { data } = await Axios.get("/HR");
      return data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return error.message;
      }
    }
  };

  const getHR = async (id) => {
    try {
      const { data } = await Axios.get(`/HR/${id}`);
      return data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return error.message;
      }
    }
  };

  const addHR = async (postData) => {
    try {
      const { data } = await Axios.post("/HR", JSON.stringify(postData), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return error.message;
      }
    }
  };

  const updateHR = async ({ id, postData }) => {
    try {
      const { data } = await Axios.patch(
        `/HR/${id}`,
        JSON.stringify(postData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return error.message;
      }
    }
  };

  const deleteHR = async (id) => {
    try {
      const { data } = await Axios.delete(`/HR/${id}`);
      return data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      } else {
        return error.message;
      }
    }
  };

  return {
    getHRs,
    getHR,
    addHR,
    updateHR,
    deleteHR,
  };
};
