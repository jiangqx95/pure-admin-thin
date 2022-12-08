import { http } from "@/utils/http";
import { baseApi } from "@/api/utils";

/** 获取用户管理列表 */
export const getUserList = (params?: object) => {
  return http.request<BaseApiResult<Page>>("get", baseApi("api/users"), {
    params
  });
};

/** 获取角色管理列表 */
export const getRoleList = (params?: object) => {
  return http.request<BaseApiResult<Page>>("get", baseApi("api/roles"), {
    params
  });
};

/** 获取部门管理列表 */
export const getDeptList = (params?: object) => {
  return http.request<BaseApiResult<Page>>("get", baseApi("api/dept"), {
    params
  });
};
