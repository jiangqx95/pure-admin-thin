import { ref } from "vue";

export function useColumns() {
  ref({});
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left",
      hide: ({ checkList }) => !checkList.includes("勾选列")
    },
    {
      label: "序号",
      type: "index",
      width: 70,
      hide: ({ checkList }) => !checkList.includes("序号列")
    },
    {
      label: "角色编号",
      prop: "id"
    },
    {
      label: "角色名称",
      prop: "name"
    },
    {
      label: "数据权限",
      prop: "dataScope"
    },
    {
      label: "角色级别",
      prop: "level"
    },
    {
      label: "描述",
      prop: "description\n"
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
