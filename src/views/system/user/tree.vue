<script setup lang="ts">
import { handleTree } from "@/utils/tree";
import type { ElTree } from "element-plus";
import { getDeptList } from "@/api/system/system";
import { ref, watch, onMounted } from "vue";
import OfficeBuilding from "@iconify-icons/ep/office-building";
import Search from "@iconify-icons/ep/search";
import type Node from "element-plus/es/components/tree/src/model/node";

interface Tree {
  id: number;
  name: string;
  highlight?: boolean;
  children?: Tree[];
}

const defaultProps = {
  children: "children",
  label: "name",
  hasChildren: true
};

const treeData = ref([]);
const searchValue = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();

const highlightMap = ref({});

const loadNode = async (node: Node, resolve: (data: Tree[]) => void) => {
  if (node.level === 0) {
    const { data } = await getDeptList({ pid: 0 });
    return resolve(handleTree(data.list as any));
  }
  const { data } = await getDeptList({ pid: node.data.id });
  resolve(handleTree(data.list as any));
};

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.name.includes(value);
};

function nodeClick() {}

watch(searchValue, val => {
  treeRef.value!.filter(val);
});

onMounted(async () => {
  const { data } = await getDeptList();
  treeData.value = handleTree(data.list as any);
});
</script>

<template>
  <div class="max-w-[260px] h-full min-h-[780px] bg-bg_color">
    <div class="flex items-center h-[34px]">
      <p class="flex-1 ml-2 font-bold text-base truncate" title="部门列表">
        部门列表
      </p>
      <el-input
        style="flex: 2"
        size="small"
        v-model="searchValue"
        placeholder="请输入部门名称"
        clearable
      >
        <template #suffix>
          <el-icon class="el-input__icon" v-show="searchValue.length === 0">
            <IconifyIconOffline :icon="Search" />
          </el-icon>
        </template>
      </el-input>
    </div>
    <el-divider />
    <el-tree
      ref="treeRef"
      node-key="id"
      size="small"
      lazy
      :props="defaultProps"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :load="loadNode"
      @node-click="nodeClick"
    >
      <template #default="{ node }">
        <span
          :class="[
            'pl-1',
            'pr-1',
            'rounded',
            'flex',
            'items-center',
            'select-none',
            searchValue.trim().length > 0 &&
              node.label.includes(searchValue) &&
              'text-red-500',
            highlightMap[node.id]?.highlight ? 'dark:text-primary' : ''
          ]"
          :style="{
            background: highlightMap[node.id]?.highlight
              ? 'var(--el-color-primary-light-7)'
              : 'transparent'
          }"
        >
          <IconifyIconOffline :icon="OfficeBuilding" />
          {{ node.label }}
        </span>
      </template>
    </el-tree>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-divider) {
  margin: 0;
}
</style>
