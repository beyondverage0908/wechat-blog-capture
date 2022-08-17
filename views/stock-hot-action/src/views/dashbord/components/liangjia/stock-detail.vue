<template>
  <div>
    <n-space vertical>
      <n-card v-for="item in pageData.list">
        <header class="text-sm pb-3">
          <n-space>
            <div>
              <span class="text-sm">入选分类：</span>
              <b>{{ item.categoryName }}</b>
            </div>
            <div>
              <span>证券名称：</span>
              <b>{{ item.name }}</b>
            </div>
            <div>
              <span>证券代码：</span>
              <a
                class="underline cursor-pointer"
                @click="handleOpen(item.code)"
              >
                <b>{{ item.code }}</b></a
              >
            </div>
            <div>
              <span>时间：</span>
              <b>{{ item.day }} {{ item.time }}</b>
            </div>
            <div>
              <span>价格：</span>
              <b>{{ item.price }}</b>
            </div>
            <div>
              <span>涨幅：</span>
              <b>{{ item.percent }}</b>
            </div>
          </n-space>
        </header>
        <div>{{ item.desc }}</div>
      </n-card>
    </n-space>
  </div>
</template>
<script lang="ts" setup>
import { getStockDetail } from "/@/apis/jiucaigongshe";
import { PropType, reactive, watch } from "vue";
import { openLinkCodeByWindow } from "/@/libs/util";

type StockDetailRow = {
  name: string;
  code: string;
  percent: string;
  price: string;
  desc: string;
  desc_link: string;
  time: string;
  day: string;
  categoryName: string;
  number: number;
  category: {
    category: string;
    number: number;
    day: string;
  }[];
};

const props = defineProps({
  code: {
    type: String as PropType<string>,
    default: null,
  },
});

const pageData = reactive<{ list: StockDetailRow[] }>({
  list: [],
});

const handleGetDetail = async (code: string) => {
  const data = await getStockDetail(code);
  if (data && data.success && data.data) {
    pageData.list = (data.data as StockDetailRow[]).map((item) => ({
      ...item,
      categoryName: item.category.map((ele) => ele.category).join(","),
      day: item.category.map((ele) => ele.day).join(","),
      number: item.category
        .map((ele) => ele.number)
        .reduce((prev, curr) => prev + curr),
    }));
  }
  console.log(data);
};
const handleOpen = (code: string) => {
  openLinkCodeByWindow(code);
};

watch(
  () => props.code,
  async (first) => {
    if (!first) {
      return;
    }
    handleGetDetail(first);
  },
  { immediate: true }
);
</script>
