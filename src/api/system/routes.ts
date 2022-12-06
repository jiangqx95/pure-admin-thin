import { http } from "@/utils/http";
import { baseApi } from "@/api/utils";

type Result = {
  code: number;
  message: string;
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return http.request<Result>("get", baseApi("api/menus/build"));
};
