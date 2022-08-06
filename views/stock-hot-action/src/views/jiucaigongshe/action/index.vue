<script setup lang="ts">
import { ref } from "vue";
import * as echarts from "echarts";
import { useRouter } from "vue-router";
import { AnimalDog20Filled } from "@vicons/fluent";
import { getActionRange } from "/@/apis/jiucaigongshe";
import storage from "/@/libs/storage";
import { LocalCategoryRange } from "/@/constant";
import { Category, Stock } from "/@/views/jiucaigongshe/types/index";
import Header from "/@/views/jiucaigongshe/action/components/header.vue";
import ActionDetail from "/@/views/jiucaigongshe/action-detail/index.vue";

type EChartsOption = echarts.EChartsOption;
interface TreeNode {
  name: string;
  value: number;
  link?: string;
  data?: Stock[];
  children?: TreeNode[];
}
type DateRange = { startDate: string; endDate: string };
// useRouter只能在setup中使用，直接在@click的方法中，是无法拿到router对象? -- 很奇怪
// Returns the router instance. Equivalent to using $router inside templates. Must be called inside of setup().
const router = useRouter();
const chartDom = ref<HTMLElement>();
const showDrawer = ref<boolean>(false);
const clickActionName = ref<string>();
async function renderChart(recentDay?: number, range?: DateRange) {
  let option: EChartsOption;
  let myChart = echarts.init(chartDom.value!);

  myChart.showLoading();
  const data = await getActionRange(recentDay, range);
  myChart.hideLoading();
  if (data.code !== "200") {
    return;
  }
  const categoryList = data.data as Category[];
  storage.saveStorage(LocalCategoryRange, JSON.stringify(categoryList));
  const treeNodeList: TreeNode[] = categoryList.map((item) => ({
    name: item.category,
    value: item.number,
    data: item.stocks,
    // link: `${window.location.origin}/action-detail?name=${item.category}`,
  }));

  const formatUtil = echarts.format;
  function getLevelOption() {
    return [
      {
        itemStyle: {
          borderWidth: 0,
          gapWidth: 5,
        },
      },
      {
        itemStyle: {
          gapWidth: 1,
        },
      },
      {
        colorSaturation: [0.35, 0.5],
        itemStyle: {
          gapWidth: 1,
          borderColorSaturation: 0.6,
        },
      },
    ];
  }

  myChart.setOption(
    (option = {
      tooltip: {
        formatter: function (info: any) {
          let value = info.value;
          let treePathInfo = info.treePathInfo;
          let data = info.data;
          let treePath = [];
          for (let i = 1; i < treePathInfo.length; i++) {
            treePath.push(treePathInfo[i].name);
          }
          const stockInfos: string[] = [];
          let stockInfo = "";
          if (!data || !data.data) {
            return "";
          }
          data.data.forEach((item: any, index: number) => {
            if (index % 3 === 0) {
              stockInfo += `<span>${item.name}(${item.code})</span>`;
              stockInfos.push(`<div>${stockInfo}</div>`);
              stockInfo = "";
            } else {
              stockInfo += `<span>${item.name}(${item.code})</span>`;
            }
            if (index === data.data.length - 1) {
              stockInfos.push(`<div>${stockInfo}</div>`);
            }
          });
          return [
            '<div class="tooltip-title">' +
              formatUtil.encodeHTML(treePath.join("/")) +
              "</div>",
            "数量: " + formatUtil.addCommas(value),
          ].join("");
        },
      },
      series: [
        {
          name: "异动数据",
          type: "treemap",
          visibleMin: 0,
          width: "99%",
          height: "99%",
          nodeClick: "link",
          roam: false,
          label: {
            show: true,
            formatter: "{b}{c}",
            fontSize: 16,
          },
          itemStyle: {
            borderColor: "#fff",
          },
          levels: getLevelOption(),
          data: treeNodeList,
        },
      ],
    })
  );
  myChart.on("click", function (chartClickData) {
    const clickData = chartClickData as { data: { name: string } };
    const { data } = clickData;
    showDrawer.value = true;
    clickActionName.value = data.name;
  });
}
// 获取时间变更
const handleUpdateDate = (recentDay: number | DateRange) => {
  if (typeof recentDay === "number") {
    renderChart(recentDay, undefined);
  } else {
    renderChart(undefined, recentDay);
  }
};
const handleToDashboard = () => {
  router.push({
    path: "/dashboard",
  });
};
</script>
<template>
  <div class="flex flex-col h-[calc(100vh)]">
    <div class="h-12 flex items-center justify-between pl-2 pr-2">
      <n-button quaternary circle @click="handleToDashboard">
        <template #icon>
          <n-icon size="28" color="green" :depth="2">
            <AnimalDog20Filled />
          </n-icon>
        </template>
      </n-button>
      <Header @update:date="handleUpdateDate" />
    </div>
    <div
      class="flex-auto"
      style="width: 100%; height: 100%"
      ref="chartDom"
    ></div>
    <n-drawer v-model:show="showDrawer" width="90%" placement="right">
      <n-drawer-content closable>
        <template #header>
          <b>{{ clickActionName }}</b>
        </template>
        <ActionDetail :name="clickActionName" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
