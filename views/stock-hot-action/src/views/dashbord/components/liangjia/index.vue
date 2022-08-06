<template>
  <n-data-table
    :columns="pageData.columns"
    :data="pageData.tableData"
    :bordered="false"
    :size="'small'"
    :style="{ height: '100%' }"
    flex-height
  />
</template>
<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import { queryLiangJiaTarget } from "/@/apis/tonghuashun";
import { columns } from "./columns";

const pageData = reactive({
  columns: columns,
  tableData: [],
});

async function startQueryLiangJiaTarget() {
  const { data, success } = await queryLiangJiaTarget({});
  if (success && data) {
    pageData.tableData = data.data;
  }
  console.log(data);
}
onMounted(() => {
  startQueryLiangJiaTarget();
});
</script>
