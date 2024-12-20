import { useEffect } from "react";
import { privateAxios } from "../api/axios";
import { useGlobalProvider } from "./useGlobalProvider";
import useRefresh from "./useRefreshToken";

export const usePrivateAxios = () => {
    const refresh = useRefresh();
    const { auth } = useGlobalProvider();

    useEffect(() => {
        const requestIntercept = privateAxios.interceptors.request.use(
            config => {
                if(!config?.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
                }
                return config;
            },
            (error) => {
                return Promise.reject(error)
            }
        )

        const responseIntercept = privateAxios.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if(error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return privateAxios(prevRequest)
                }

                return Promise.reject(error)
            }
        )

        // after cleaning cencel responseIntercept
        return () => {
            privateAxios.interceptors.request.eject(requestIntercept);
            privateAxios.interceptors.response.eject(responseIntercept);
        }

    }, [auth, refresh]);

    return privateAxios;
}