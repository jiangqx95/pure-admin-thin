import { reactive } from "vue";
import { isPhone } from "@pureadmin/utils";
import type { FormRules } from "element-plus";
import { REGEXP_PWD } from "@/utils/regexp";

/** 登录校验 */
const loginRules = reactive(<FormRules>{
  // password: [
  //   {
  //     validator: (rule, value, callback) => {
  //       if (value === "") {
  //         callback(new Error(transformI18n($t("login.passwordReg"))));
  //       } else if (!REGEXP_PWD.test(value)) {
  //         callback(new Error(transformI18n($t("login.passwordRuleReg"))));
  //       } else {
  //         callback();
  //       }
  //     },
  //     trigger: "blur"
  //   }
  // ],
});

/** 手机登录校验 */
const phoneRules = reactive(<FormRules>{
  phone: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入手机号码"));
        } else if (!isPhone(value)) {
          callback(new Error("请输入正确的手机号码格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

/** 忘记密码校验 */
const updateRules = reactive(<FormRules>{
  phone: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入手机号码"));
        } else if (!isPhone(value)) {
          callback(new Error("请输入正确的手机号码格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else if (!REGEXP_PWD.test(value)) {
          callback(
            new Error("密码格式应为8-18位数字、字母、符号的任意两种组合")
          );
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

export { loginRules, phoneRules, updateRules };
