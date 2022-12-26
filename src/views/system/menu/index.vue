<script setup lang="ts">
import { useColumns } from "./columns";
import { handleTree } from "@/utils/tree";
import { getMenuList } from "@/api/system/system";
import { FormInstance } from "element-plus";
import { reactive, ref, onMounted } from "vue";
import { TableProBar } from "@/components/ReTable";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import Manage from "./manage.vue";

defineOptions({
  name: "Menu"
});

const form = reactive({
  blurry: ""
});

interface Menu {
  cache: boolean;
  createTime: string;
  hasChildren: boolean;
  hidden: boolean;
  iFrame: boolean;
  icon: string;
  id: number;
  label: string;
  leaf: boolean;
  menuSort: number;
  path: string;
  subCount: number;
  title: string;
  type: string;
}

const dataList = ref([]);
const loading = ref(true);
const { columns } = useColumns();
const formRef = ref<FormInstance>();
const tableRef = ref();

const dialogFormVisible = ref(false);
/**
 * 初始化
 */
onMounted(() => {
  onSearch({ pid: 0 });
});

function handleUpdate(row) {
  console.log(row);
}

function handleDelete(row) {
  console.log(row);
}

function handleSelectionChange(val) {
  console.log("handleSelectionChange", val);
}

/**
 * 搜索
 */
async function onSearch(params) {
  loading.value = true;
  const { data } = await getMenuList({ ...form, ...params });
  dataList.value = handleTree(data.list as any);
  loading.value = false;
}

/**
 * 重置表单
 * @param formEl
 */
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch({ pid: 0 });
};

/**
 * 异步加载表格
 * @param row
 * @param treeNode
 * @param resolve
 */
const load = async (
  row: Dept,
  treeNode: unknown,
  resolve: (date: Menu[]) => void
) => {
  const { data } = await getMenuList({ pid: row.id });
  resolve(data.list);
};
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      label-width="auto"
      class="bg-bg_color w-[99/100] pl-4 pt-4"
    >
      <el-form-item label="菜单名称：" prop="blurry">
        <el-input
          v-model="form.blurry"
          placeholder="请输入菜单名称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon(Search)"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <TableProBar
      title="部门列表"
      :loading="loading"
      :tableRef="tableRef?.getTableRef()"
      :dataList="dataList"
      @refresh="onSearch"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(AddFill)"
          @click="dialogFormVisible = true"
        >
          新增菜单
        </el-button>
      </template>
      <template v-slot="{ size, checkList }">
        <pure-table
          ref="tableRef"
          border
          align-whole="center"
          row-key="id"
          showOverflowTooltip
          table-layout="auto"
          :size="size"
          :data="dataList"
          lazy
          :load="load"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          :columns="columns"
          :checkList="checkList"
          :header-cell-style="{
            background: 'var(--el-table-row-hover-bg-color)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
        >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :size="size"
              @click="handleUpdate(row)"
              :icon="useRenderIcon(EditPen)"
            >
              修改
            </el-button>
            <el-popconfirm title="是否确认删除?">
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(Delete)"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </TableProBar>

    <Manage v-model:dialogFormVisible="dialogFormVisible" />
  </div>
</template>
