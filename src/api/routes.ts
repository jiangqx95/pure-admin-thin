import { http } from "@/utils/http";

type Result = {
  success: boolean;
  code: string;
  message: string;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return http.request<Result>("get", "http://127.0.0.1:8000/api/menus/build");
};
