import { http } from "@/utils/http";
import { baseApi } from "@/api/utils";

type Result = {
  code: number;
  message: string;
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总数 */
    total?: number;
  };
};

/** 获取用户管理列表 */
export const getUserList = (params?: object) => {
  return http.request<Result>("get", baseApi("api/users"), { params });
};

/** 获取角色管理列表 */
export const getRoleList = (params?: object) => {
  return http.request<Result>("get", baseApi("api/roles"), { params });
};

/** 获取部门管理列表 */
export const getDeptList = (params?: object) => {
  return http.request<Result>("get", baseApi("api/dept"), { params });
};
