import { http } from "@/utils/http";

export type UserResult = {
  code: boolean;
  message: string;
  success: boolean;
  data: {
    user: {
      dataScopes: Array<string>;
      user: {
        avatarPath: string;
        /** 用户名 */
        username: string;
        /** 昵称 */
        nickName: string;
        /** 当前登陆用户的角色 */
        roles: Array<string>;
      };
    };
    /** `token` */
    token: string;
  };
};

export type CodeResult = {
  code: boolean;
  message: string;
  success: boolean;
  data: {
    show: boolean;
    img: string;
    uuid: string;
  };
};

/** 获取验证码 */
export const getCode = () => {
  return http.request<CodeResult>("get", "http://localhost:8000/auth/code");
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "http://localhost:8000/auth/login", {
    data
  });
};
