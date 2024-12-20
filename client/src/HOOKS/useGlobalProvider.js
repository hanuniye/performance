import { useContext } from "react";
import { GlobalContext } from "../context/GlobalProvider";

export const useGlobalProvider = () => {
    return useContext(GlobalContext);
}
