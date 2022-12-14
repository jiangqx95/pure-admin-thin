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
      label: "部门名称",
      prop: "name",
      align: "left"
    },
    {
      label: "排序",
      prop: "deptSort"
    },
    {
      label: "状态",
      prop: "enabled",
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.enabled ? "success" : "danger"}
          effect="plain"
        >
          {row.enabled ? "开启" : "关闭"}
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
