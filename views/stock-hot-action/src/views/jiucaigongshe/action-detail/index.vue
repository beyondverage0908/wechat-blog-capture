<template>
  <n-data-table striped :data="tableData" :columns="columns" />
</template>
<script setup lang="ts">
import { computed, onMounted, ref, h } from "vue";
import { useRoute } from "vue-router";
import storage from "/@/libs/storage";
import { LocalCategoryRange } from "/@/constant";
import { Category, Stock } from "/@/views/jiucaigongshe/types/index";
import { DataTableColumn } from "naive-ui";

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
  },
  {
    title: "价格",
    key: "price",
    width: 100,
  },
  {
    title: "百分比",
    key: "percent",
    width: 100,
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

onMounted(() => {
  const data: Category[] = JSON.parse(storage.getStorage(LocalCategoryRange));
  const route = useRoute();
  const { name } = route.query;
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
    .sort((a, b) => b.length - a.length)
    .flat();
});
</script>
