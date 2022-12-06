<script setup lang="ts">
import {
  ref,
  reactive,
  toRaw,
  onMounted,
  onBeforeUnmount,
  computed
} from "vue";
import Motion from "./utils/motion";
import Cookies from "js-cookie";
import { rsaEncrypt } from "@/utils/encrypt/rsaEncrypt";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { initRouter } from "@/router/utils";
import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { bg, avatar, illustration } from "./utils/static";
import { operates, thirdParty } from "./utils/enums";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
import { getCode } from "@/api/system/login";
import dayIcon from "@/assets/svg/day.svg";
import darkIcon from "@/assets/svg/dark.svg";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import Code from "@iconify-icons/ri/shield-check-fill";
import phone from "./components/phone.vue";
import qrCode from "./components/qrCode.vue";
import regist from "./components/regist.vue";
import update from "./components/update.vue";

const GLOB_APP_SHORT_NAME = "pure-admin-";
const rememberMe = ref(false);
const currentPage = computed(() => {
  return useUserStoreHook().currentPage;
});

// 验证码对象
const captcha = reactive({
  enable: false, // 是否开启验证码
  img: "", // 图片
  uuid: ""
});

const ruleForm = reactive({
  username: "admin",
  password: "123456",
  code: ""
});

// 获取cookie
const rememberMe_ = Cookies.get(GLOB_APP_SHORT_NAME + "rememberMe");
rememberMe.value = rememberMe_ === undefined ? false : Boolean(rememberMe_);
if (rememberMe.value) {
  const username = Cookies.get(GLOB_APP_SHORT_NAME + "username");
  ruleForm.username = username === undefined ? ruleForm.username : username;
  const password = Cookies.get(GLOB_APP_SHORT_NAME + "password");
  ruleForm.password = password === undefined ? ruleForm.password : password;
}

// 获取验证码
getVerificationCode();

defineOptions({
  name: "Login"
});

const router = useRouter();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, dataThemeChange } = useDataThemeChange();
dataThemeChange();
const { title } = useNav();

const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const encrypt_pass =
        ruleForm.password !== Cookies.get("pure-admin-" + "password")
          ? rsaEncrypt(ruleForm.password)
          : ruleForm.password;

      useUserStoreHook()
        .loginByUsername({
          username: ruleForm.username,
          password: encrypt_pass,
          code: ruleForm.code,
          uuid: captcha.uuid
        })
        .then(res => {
          if (res) {
            // 获取后端路由
            initRouter().then(() => {
              router.push("/");
              message("登录成功", { type: "success" });
            });
          }
        })
        .catch(() => {
          loading.value = false;
          getVerificationCode();
        });
    } else {
      loading.value = false;
      return fields;
    }
  });
};

/** 获取验证码 */
function getVerificationCode() {
  getCode().then(res => {
    if (res.data.enable) {
      captcha.enable = true;
      captcha.img = res.data.img;
      captcha.uuid = res.data.uuid;
    }
  });
}

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter") {
    onLogin(ruleFormRef.value);
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-none">{{ title }}</h2>
          </Motion>

          <el-form
            v-if="currentPage === 0"
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
                prop="username"
              >
                <el-input
                  clearable
                  v-model="ruleForm.username"
                  placeholder="账号"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item
                prop="password"
                :rules="[
                  {
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  clearable
                  show-password
                  v-model="ruleForm.password"
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150" v-if="captcha.enable">
              <el-form-item
                prop="code"
                :rules="[
                  {
                    required: true,
                    message: '请输入验证码',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  v-model="ruleForm.code"
                  placeholder="验证码"
                  :prefix-icon="useRenderIcon(Code)"
                >
                  <template #suffix>
                    <img
                      :src="captcha.img"
                      alt=""
                      @click="getVerificationCode"
                      style="cursor: pointer"
                    />
                  </template>
                </el-input>
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-form-item>
                <div class="w-full h-[20px] flex justify-between items-center">
                  <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
                  <el-button
                    link
                    type="primary"
                    @click="useUserStoreHook().SET_CURRENTPAGE(4)"
                    >忘记密码？
                  </el-button>
                </div>
                <el-button
                  class="w-full mt-4"
                  size="default"
                  type="primary"
                  :loading="loading"
                  @click="onLogin(ruleFormRef)"
                >
                  登录
                </el-button>
              </el-form-item>
            </Motion>

            <Motion :delay="300">
              <el-form-item>
                <div class="w-full h-[20px] flex justify-between items-center">
                  <el-button
                    v-for="(item, index) in operates"
                    :key="index"
                    class="w-full mt-4"
                    size="default"
                    @click="useUserStoreHook().SET_CURRENTPAGE(index + 1)"
                  >
                    {{ item.title }}
                  </el-button>
                </div>
              </el-form-item>
            </Motion>
          </el-form>

          <Motion v-if="currentPage === 0" :delay="350">
            <el-form-item>
              <el-divider>
                <p class="text-gray-500 text-xs">第三方登录</p>
              </el-divider>
              <div class="w-full flex justify-evenly">
                <span
                  v-for="(item, index) in thirdParty"
                  :key="index"
                  :title="item.title"
                >
                  <IconifyIconOnline
                    :icon="`ri:${item.icon}-fill`"
                    width="20"
                    class="cursor-pointer text-gray-500 hover:text-blue-400"
                  />
                </span>
              </div>
            </el-form-item>
          </Motion>
          <!-- 手机号登录 -->
          <phone v-if="currentPage === 1" />
          <!-- 二维码登录 -->
          <qrCode v-if="currentPage === 2" />
          <!-- 注册 -->
          <regist v-if="currentPage === 3" />
          <!-- 忘记密码 -->
          <update v-if="currentPage === 4" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
