<script setup lang="ts">
import dayjs from "dayjs";
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { getActionRange } from "/@/apis/jiucaigongshe";
import storage from "/@/libs/storage";
import { LocalCategoryRange } from "/@/constant";
import { Category, Stock } from "/@/views/jiucaigongshe/types/index";

type EChartsOption = echarts.EChartsOption;
interface TreeNode {
	name: string;
	value: number;
	link: string;
	data?: Stock[];
	children?: TreeNode[];
}
const chartDom = ref<HTMLElement>();
onMounted(() => {
	renderChart();
});

async function renderChart() {
	let option: EChartsOption;
	let myChart = echarts.init(chartDom.value!);
	const startDate = dayjs().subtract(7, "day").format("YYYY-MM-DD");
	const endDate = dayjs().format("YYYY-MM-DD");

	myChart.showLoading();
	const data = await getActionRange(startDate, endDate);
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
		link: `${window.location.origin}/action-detail?name=${item.category}`,
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
					if (!data.data) {
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
					]
						.concat(stockInfos)
						.join("");
				},
			},
			series: [
				{
					name: "异动数据",
					type: "treemap",
					visibleMin: 0,
					width: "98%",
					height: "95%",
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
}
</script>
<template>
	<div style="width: 100%; height: 100vh" ref="chartDom"></div>
</template>
