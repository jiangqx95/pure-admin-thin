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
export const getUserList = (data?: object) => {
  return http.request<Result>("post", baseApi("/api/users/list"), { data });
};

/** 获取角色管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<Result>("post", "/role", { data });
};

/** 获取部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.request<Result>("post", "/dept", { data });
};
