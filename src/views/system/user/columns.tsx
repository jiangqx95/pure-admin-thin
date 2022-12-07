import { ref } from "vue";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";

export function useColumns() {
  const switchLoadMap = ref({});

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
      label: "用户编号",
      prop: "id"
    },
    {
      label: "用户名称",
      prop: "username"
    },
    {
      label: "用户昵称",
      prop: "nickName"
    },
    {
      label: "性别",
      prop: "gender",
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.gender === "女" ? "danger" : ""}
          effect="plain"
        >
          {row.gender}
        </el-tag>
      )
    },
    {
      label: "部门",
      prop: "dept",
      formatter: ({ dept }) => dept.name
    },
    {
      label: "手机号码",
      prop: "phone"
    },
    {
      label: "状态",
      prop: "enabled",
      width: 130,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.enabled}
          active-value={false}
          inactive-value={true}
          active-text="启用"
          inactive-text="停用"
          inline-prompt
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "创建时间",
      width: 180,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.enabled ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.username
      }</strong>用户吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        setTimeout(() => {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message("已成功修改用户状态", {
            type: "success"
          });
        }, 300);
      })
      .catch(() => {
        row.enabled = !row.enabled;
      });
  }

  return {
    columns
  };
}
