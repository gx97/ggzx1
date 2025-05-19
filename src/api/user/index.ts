import request from "@/utils/request";
import type { loginForm, loginResponseData, userInfoResponseData } from "./type";

enum API {
    LONGIN_URL = "/acl/user/login",
    USERINFO_URL = "/acl/user/info",
    LOGOUT_URL = "/user/info",
}

export const reqLogin = (data: loginForm) => request.post<any, loginResponseData>(API.LONGIN_URL, data);
export const reqUserInfo = () => request.get<any, userInfoResponseData>(API.USERINFO_URL);
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL);