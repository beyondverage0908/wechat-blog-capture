<template>
  <n-data-table :data="tableData" :columns="columns" />
</template>
<script setup lang="ts">
import { computed, onMounted, ref, h, PropType, watch } from "vue";
import { useRoute } from "vue-router";
import storage from "/@/libs/storage";
import { LocalCategoryRange } from "/@/constant";
import { Category, Stock } from "/@/views/jiucaigongshe/types/index";
import { DataTableColumn } from "naive-ui";

const props = defineProps({
  name: {
    type: String as PropType<string>,
    default: null,
  },
});

const columns = computed((): DataTableColumn[] => [
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
    width: 100,
  },
  {
    title: "证券代码",
    key: "code",
    width: 100,
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
    title: "发生日期",
    key: "day",
    width: 120,
  },
  {
    title: "价格",
    key: "price",
    width: 80,
  },
  {
    title: "百分比",
    key: "percent",
    width: 80,
  },
  {
    title: "链接",
    key: "descLink",
    width: 360,
    render(row) {
      const descLink: string = row.descLink as string;
      if (!descLink) return;
      return h(
        "a",
        {
          style: {
            textDecoration: "underline",
            cursor: "pointer",
          },
          onClick: () => {
            window.open(descLink, "_blank");
          },
        },
        descLink
      );
    },
  },
  {
    title: "描述",
    key: "desc",
    ellipsis: {
      tooltip: {
        width: 600,
      },
    },
  },
]);
const tableData = ref<Stock[]>([]);

const buildTableDataByName = (name: string) => {
  const data: Category[] = JSON.parse(storage.getStorage(LocalCategoryRange));
  const findCategory = data.find((item) => item.category === name);
  if (!findCategory) {
    return;
  }
  const stocks = findCategory.stocks || [];
  const map = new Map<string, Stock[]>();
  stocks.forEach((stock) => {
    const has = !!map.get(stock.code);
    if (has) {
      map.get(stock.code)?.push(stock);
    } else {
      map.set(stock.code, [stock]);
    }
  });
  tableData.value = [...map.values()]
    .map((stocks) => stocks.sort((a, b) => (b.day!! > a.day!! ? 1 : -1)))
    .sort((a, b) => b.length - a.length)
    .flat();
};

// 监听
watch(
  () => props.name,
  (val: string) => {
    buildTableDataByName(val);
  },
  { immediate: true }
);

// onMounted(() => {
//   const route = useRoute();
//   const { name } = route.query;
//   buildTableDataByName(name as string);
// });
</script>
