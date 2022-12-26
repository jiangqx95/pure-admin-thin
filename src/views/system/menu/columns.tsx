import { IconifyIconOffline } from "@/components/ReIcon";

export function useColumns() {
  const columns: TableColumnList = [
    {
      type: "selection",
      align: "left",
      hide: ({ checkList }) => !checkList.includes("勾选列")
    },
    {
      label: "序号",
      type: "index",
      hide: ({ checkList }) => !checkList.includes("序号列")
    },
    {
      label: "菜单名称",
      prop: "label",
      width: 150,
      align: "left"
    },
    {
      label: "图标",
      prop: "icon",
      width: 70,
      align: "center",
      cellRenderer: ({ row }) => (
        <IconifyIconOffline style="display:inline-flex" icon={row.icon} />
      )
    },
    {
      label: "排序",
      prop: "menuSort"
    },
    {
      label: "权限标识",
      prop: "permission"
    },
    {
      label: "组件路径",
      prop: "component"
    },
    {
      label: "外链",
      prop: "iFrame",
      width: 70,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.iFrame ? "success" : "danger"}
          effect="plain"
        >
          {row.iFrame ? "是" : "否"}
        </el-tag>
      )
    },
    {
      label: "缓存",
      prop: "cache",
      width: 70,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.cache ? "success" : "danger"}
          effect="plain"
        >
          {row.cache ? "是" : "否"}
        </el-tag>
      )
    },
    {
      label: "可见",
      prop: "hidden",
      width: 70,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.hidden ? "success" : "danger"}
          effect="plain"
        >
          {row.hidden ? "否" : "是"}
        </el-tag>
      )
    },
    {
      label: "创建时间",
      prop: "createTime"
    },
    {
      label: "操作",
      fixed: "right",
      slot: "operation"
    }
  ];

  return {
    columns
  };
}
