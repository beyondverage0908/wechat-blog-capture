<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { getActionRange } from "/@/apis/jiucaigongshe";

var ROOT_PATH = "https://echarts.apache.org/examples";
type EChartsOption = echarts.EChartsOption;

const chartDom = ref<HTMLElement>();
onMounted(() => {
	console.log(chartDom.value);
	renderChart();
});

function renderChart() {
	var myChart = echarts.init(chartDom.value!);
	var option: EChartsOption;

	type RawNode = {
		[key: string]: RawNode;
	} & {
		$count: number;
	};

	interface TreeNode {
		name: string;
		value: number;
		children?: TreeNode[];
	}

	// const uploadedDataURL =
	//   ROOT_PATH + "/data/asset/data/ec-option-doc-statistics-201604.json";

	// myChart.showLoading();

	// axios.get("").then((rawData) => {
	//   console.log(rawData);
	// });
	// console.log(uploadedDataURL);

	getActionRange("2022-07-06", "2022-07-08").then((res) => {
		console.log(res);
	});

	// $.getJSON(uploadedDataURL, function (rawData) {
	//   myChart.hideLoading();

	//   function convert(source: RawNode, target: TreeNode, basePath: string) {
	//     for (let key in source) {
	//       let path = basePath ? basePath + "." + key : key;
	//       if (!key.match(/^\$/)) {
	//         target.children = target.children || [];
	//         const child = {
	//           name: path,
	//         } as TreeNode;
	//         target.children.push(child);
	//         convert(source[key], child, path);
	//       }
	//     }

	//     if (!target.children) {
	//       target.value = source.$count || 1;
	//     } else {
	//       target.children.push({
	//         name: basePath,
	//         value: source.$count,
	//       });
	//     }
	//   }

	//   const data = {
	//     children: [] as TreeNode[],
	//   } as TreeNode;

	//   convert(rawData, data, "");

	//   myChart.setOption(
	//     (option = {
	//       title: {
	//         text: "ECharts Options",
	//         subtext: "2016/04",
	//         left: "leafDepth",
	//       },
	//       tooltip: {},
	//       series: [
	//         {
	//           name: "option",
	//           type: "treemap",
	//           visibleMin: 300,
	//           data: data.children,
	//           leafDepth: 2,
	//           levels: [
	//             {
	//               itemStyle: {
	//                 borderColor: "#555",
	//                 borderWidth: 4,
	//                 gapWidth: 4,
	//               },
	//             },
	//             {
	//               colorSaturation: [0.3, 0.6],
	//               itemStyle: {
	//                 borderColorSaturation: 0.7,
	//                 gapWidth: 2,
	//                 borderWidth: 2,
	//               },
	//             },
	//             {
	//               colorSaturation: [0.3, 0.5],
	//               itemStyle: {
	//                 borderColorSaturation: 0.6,
	//                 gapWidth: 1,
	//               },
	//             },
	//             {
	//               colorSaturation: [0.3, 0.5],
	//             },
	//           ],
	//         },
	//       ],
	//     })
	//   );
	// });

	// option && myChart.setOption(option);
}
</script>
<template>
	<div ref="chartDom">1111113333</div>
</template>
