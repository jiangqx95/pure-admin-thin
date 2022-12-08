<script setup lang="ts">
import Search from "./search/index.vue";
import Notice from "./notice/index.vue";
import mixNav from "./sidebar/mixNav.vue";
import { useNav } from "@/layout/hooks/useNav";
import Breadcrumb from "./sidebar/breadCrumb.vue";
import topCollapse from "./sidebar/topCollapse.vue";
import Setting from "@iconify-icons/ri/settings-3-line";
import { ref } from "vue";
import { FormInstance } from "element-plus";
import { message } from "@/utils/message";
import { updatePass } from "@/api/core/login";
import { rsaEncrypt } from "@/utils/encrypt/rsaEncrypt";
import { useUserStoreHook } from "@/store/modules/user";

const {
  layout,
  device,
  logout,
  onPanel,
  pureApp,
  username,
  avatarsStyle,
  toggleSideBar,
  formData,
  formRules
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
          useUserStoreHook().logOut();
        })
        .catch(() => {
          loading.value = false;
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
    class="navbar bg-[#fff] shadow-sm shadow-[rgba(0, 21, 41, 0.08)] dark:shadow-[#0d0d0d]"
  >
    <topCollapse
      v-if="device === 'mobile'"
      class="hamburger-container"
      :is-active="pureApp.sidebar.opened"
      @toggleClick="toggleSideBar"
    />

    <Breadcrumb
      v-if="layout !== 'mix' && device !== 'mobile'"
      class="breadcrumb-container"
    />

    <mixNav v-if="layout === 'mix'" />

    <div v-if="layout === 'vertical'" class="vertical-header-right">
      <!-- 菜单搜索 -->
      <Search />
      <!-- 通知 -->
      <Notice id="header-notice" />
      <!-- 修改密码|退出登录 -->
      <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover select-none">
          <img
            src="https://avatars.githubusercontent.com/u/44761321?v=4"
            :style="avatarsStyle"
          />
          <p v-if="username" class="dark:text-white">{{ username }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="dialogFormVisible = true"
              >修改密码
            </el-dropdown-item>
            <hr style="color: #e0ebf6" />
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
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
      width="30%"
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
          label="旧密码"
          prop="oldPass"
          :rules="[
            {
              required: true,
              message: '请输入旧密码',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model="formData.oldPass" clearable />
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
          <el-button @click="resetForm(formRef)">取 消</el-button>
          <el-button
            type="primary"
            :loading="loading"
            @click="modifyPwd(formRef)"
            >确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;

  .hamburger-container {
    line-height: 48px;
    height: 100%;
    float: left;
    cursor: pointer;
  }

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

      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 16px;
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
