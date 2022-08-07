import { CheckType, ColumnRowData, LiangJiaType, MonitType } from "./types";
import { DataTableColumn, NButton } from "naive-ui";
import { h } from "vue";
import { updateLiangJiaMonit } from "/@/apis/tonghuashun";

export const columns: DataTableColumn<ColumnRowData>[] = [
  {
    title: "#",
    key: "index",
    width: 60,
    render: (_, index) => {
      return `${index + 1}`;
    },
  },
  {
    title: "证券名称",
    key: "name",
  },
  {
    title: "证券代码",
    key: "code",
    render: (row) => {
      const code: string = row.code as string;
      if (!code) return;
      return h(
        "a",
        {
          style: {
            textDecoration: "underline",
            cursor: "pointer",
          },
          onClick: () => {
            window.open(
              `http://quote.eastmoney.com/concept/${code}.html`,
              "_blank"
            );
          },
        },
        code
      );
    },
  },
  {
    // 是否监控 1：监控中 2：已移除监控 3: 暂定
    title: "监控状态",
    key: "monit",
    render: (row) => {
      if (row.monit === MonitType.moniting) {
        return h(
          "span",
          { style: { color: "green", fontWeight: 700 } },
          "监控中"
        );
      } else if (row.monit === MonitType.removed) {
        return h("span", { style: { color: "red" } }, "移除监控");
      } else if (row.monit === "3") {
        return h("span", "暂定");
      }
    },
  },
  {
    title: "入选时间",
    key: "checkTime",
  },
  {
    title: "移除时间",
    key: "uncheckTime",
  },
  {
    title: "入选价格",
    key: "checkPrice",
  },
  {
    title: "移除价格",
    key: "uncheckPrice",
  },
  {
    title: "7天后价格",
    key: "price7",
  },
  {
    title: "14天后价格",
    key: "price14",
  },
  {
    // 入选方式 1：自动 2：手动入选
    title: "入选方式",
    key: "checkType",
    render: (row) => {
      if (row.checkType === CheckType.auto) {
        return h("span", "自动程序");
      } else if (row.checkType === CheckType.manual) {
        return h(
          "span",
          { style: { color: "green", fontWeight: 700 } },
          "手动入选"
        );
      }
    },
  },
  {
    title: "量价方式",
    key: "ljtype",
    render: (row) => {
      if (row.ljtype === LiangJiaType.ljqd) {
        return h("span", "量价齐跌");
      } else if (row.ljtype === "ljqs") {
        return h("span", "量价齐升");
      }
      return h("span", "-");
    },
  },
  {
    title: "连续天数",
    key: "seriesDay",
  },
  {
    title: "jcgs类别",
    key: "category",
  },
  {
    title: "ths类别",
    key: "industry",
  },
  {
    title: "操作",
    key: "actions",
    render: (row) => {
      if (row.monit === MonitType.moniting) {
        return h(
          NButton,
          {
            size: "small",
            type: "error",
            onClick: async () => {
              const { success } = await updateLiangJiaMonit(
                row._id,
                MonitType.removed
              );
              if (success) {
                row.monit = MonitType.removed;
                window.$message.success("已经移除监控");
              }
            },
          },
          { default: () => "移除监控" }
        );
      } else if (
        row.monit === MonitType.wait ||
        row.monit === MonitType.removed
      ) {
        return h(
          NButton,
          {
            size: "small",
            type: "primary",
            onClick: async () => {
              const { success } = await updateLiangJiaMonit(
                row._id,
                MonitType.moniting
              );
              if (success) {
                row.monit = MonitType.moniting;
                window.$message.success("已经加入监控");
              }
            },
          },
          { default: () => "加入监控" }
        );
      }
    },
  },
];
