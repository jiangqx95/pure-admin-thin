import { http } from "@/utils/http";
import { baseApi } from "@/api/utils";

export type User = {
  token: string;
  user: {
    dataScopes: Array<number>;
    authorities: [authority: string];
    user: {
      /** 用户名 */
      username: string;
      /** 昵称 */
      nickName: string;
      /** 当前登陆用户的角色 */
      roles: Array<string>;
      isAdmin: boolean;
      jobs: Array<any>;
      deptId: number;
      dept: {
        id: number;
        name: string;
      };
      email: string;
      phone: string;
      gender: string;
      avatarName: string;
      avatarPath: string;
      pwdResetTime: Date;
    };
  };
};

type Code = {
  enable: boolean;
  img: string;
  uuid: string;
};

/** 获取验证码 */
export const getCode = () => {
  return http.request<BaseApiResult<Code>>("get", baseApi("auth/code"));
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<BaseApiResult<User>>("post", baseApi("auth/login"), {
    data
  });
};

/** 退出系统 */
export const doLogOut = () => {
  return http.request("delete", baseApi("auth/logout"));
};
