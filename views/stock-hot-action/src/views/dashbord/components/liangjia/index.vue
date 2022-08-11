<template>
  <header class="h-9 flex items-center justify-between">
    <div class="ml-2">
      <b>监控表</b>
    </div>
    <div class="cursor-pointer">
      <n-icon
        class="mr-2"
        :size="22"
        color="rgb(249, 115, 22)"
        @click="isShowDrawer = true"
      >
        <ArrowExpand20Filled />
      </n-icon>
    </div>
  </header>
  <n-data-table
    :columns="pageData.columns"
    :data="pageData.tableData"
    :bordered="false"
    :size="'small'"
    :loading="isLoading"
    :style="{ height: '100%' }"
    flex-height
  />
  <n-drawer v-model:show="isShowDrawer" width="90%">
    <n-drawer-content>
      <n-data-table
        :columns="pageData.columns"
        :data="pageData.tableData"
        :bordered="false"
        :size="'small'"
        :loading="isLoading"
        :style="{ height: '100%' }"
        flex-height
      />
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { queryLiangJiaTarget } from "/@/apis/tonghuashun";
import { columns } from "./columns";
import { ArrowExpand20Filled } from "@vicons/fluent";

const isLoading = ref<boolean>(false);
const isShowDrawer = ref<boolean>(false);
const pageData = reactive({
  columns: columns,
  tableData: [],
});

async function startQueryLiangJiaTarget() {
  isLoading.value = true;
  const { data, success } = await queryLiangJiaTarget({});
  isLoading.value = false;
  if (success && data) {
    pageData.tableData = data.data;
  }
  console.log(data);
}
onMounted(() => {
  startQueryLiangJiaTarget();
});
</script>
