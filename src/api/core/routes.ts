import { http } from "@/utils/http";
import { baseApi } from "@/api/utils";

export const getAsyncRoutes = () => {
  return http.request<BaseApiResult<Array<any>>>(
    "get",
    baseApi("api/menus/build")
  );
};
