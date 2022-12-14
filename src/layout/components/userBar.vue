<script setup lang="ts">
import Search from "./search/index.vue";
import Notice from "./notice/index.vue";
import Setting from "@iconify-icons/ri/settings-3-line";
import avatar from "@/assets/svg/avatar.svg";
import { useNav } from "@/layout/hooks/useNav";
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { updatePass } from "@/api/core/login";
import { rsaEncrypt } from "@/utils/encrypt/rsaEncrypt";
import { message } from "@/utils/message";
import Cookies from "js-cookie";
import { useUserStoreHook } from "@/store/modules/user";

const {
  layout,
  device,
  username,
  avatarsStyle,
  formData,
  formRules,
  logout,
  onPanel
} = useNav();

const loading = ref(false);
const dialogFormVisible = ref(false);
const formRef = ref<FormInstance>();

// 清空表单
const resetForm = async (formEl: FormInstance | undefined) => {
  dialogFormVisible.value = false;
  loading.value = false;
  if (!formEl) return;
  formEl.resetFields();
};

// 修改密码
const modifyPwd = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      updatePass({
        oldPass: rsaEncrypt(formData.oldPass),
        newPass: rsaEncrypt(formData.newPass)
      })
        .then(() => {
          message("修改密码成功，请用新密码重新登录!", { type: "success" });
          // 删除记住密码信息
          Cookies.remove("rememberPwd");
          // 退出并跳转到登陆页
          useUserStoreHook().logOut();
        })
        .catch(error => {
          loading.value = false;
          message(error.response.data.message || "请求失败", { type: "error" });
        });
    } else {
      loading.value = false;
      return fields;
    }
  });
};
</script>

<template>
  <div
    :class="
      layout === 'vertical'
        ? 'vertical-header-right'
        : 'horizontal-header-right'
    "
  >
    <!-- 菜单搜索 -->
    <Search />
    <!-- 通知 -->
    <Notice id="header-notice" />
    <!-- 修改密码|退出登录 -->
    <el-dropdown trigger="click">
      <span class="el-dropdown-link navbar-bg-hover select-none">
        <avatar :style="avatarsStyle" />
        <p v-if="username" class="dark:text-white">{{ username }}</p>
      </span>
      <template #dropdown>
        <el-dropdown-menu class="logout">
          <el-dropdown-item @click="dialogFormVisible = true">
            <el-icon>
              <Edit />
            </el-icon>
            修改密码
          </el-dropdown-item>
          <hr style="color: #e0ebf6" />
          <el-dropdown-item @click="logout">
            <el-icon>
              <SwitchButton />
            </el-icon>
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span
      class="set-icon navbar-bg-hover"
      title="打开项目配置"
      @click="onPanel"
    >
      <IconifyIconOffline :icon="Setting" />
    </span>
  </div>

  <!-- 修改密码弹窗 -->
  <el-dialog
    title="修改密码"
    :width="device !== 'mobile' ? '30%' : '95%'"
    v-model="dialogFormVisible"
    @closed="resetForm(formRef)"
  >
    <el-form
      ref="formRef"
      :rules="formRules"
      :model="formData"
      label-width="auto"
    >
      <el-form-item
        label="当前密码"
        prop="oldPass"
        :rules="[
          {
            required: true,
            message: '请输入旧密码',
            trigger: 'blur'
          }
        ]"
      >
        <el-input v-model="formData.oldPass" clearable show-password />
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="newPass"
        :rules="[
          {
            required: true,
            message: '请输入新密码',
            trigger: 'blur'
          }
        ]"
      >
        <el-input v-model="formData.newPass" clearable show-password />
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="repeatPass"
        :rules="[
          {
            required: true,
            message: '请再次输入',
            trigger: 'blur'
          }
        ]"
      >
        <el-input v-model="formData.repeatPass" clearable show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="resetForm(formRef)" icon="close">取 消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="modifyPwd(formRef)"
          icon="check"
          >确 定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.vertical-header-right {
  display: flex;
  min-width: 280px;
  height: 48px;
  align-items: center;
  color: #000000d9;
  justify-content: flex-end;

  .el-dropdown-link {
    height: 48px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
    color: #000000d9;

    p {
      font-size: 14px;
    }

    svg {
      width: 22px;
      height: 22px;
      border-radius: 50%;
    }
  }
}

.logout {
  max-width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    min-width: 100%;
    display: inline-flex;
    flex-wrap: wrap;
  }
}
</style>
