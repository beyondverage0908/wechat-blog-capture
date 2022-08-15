<template>
  <header
    class="h-9 flex items-center justify-between border-b border-solid border-gray-300"
  >
    <div class="ml-2">
      <b>监控表</b>
    </div>
    <n-space>
      <n-radio-group
        name="liangjiaRadioName"
        :default-value="liangJiaType"
        :on-update:value="handleUpdateLiangJia"
      >
        <n-radio
          v-for="item in pageData.liangjiaLabelList"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </n-radio>
      </n-radio-group>
      <n-button
        type="primary"
        class="align-middle"
        size="tiny"
        @click="handleRefresh"
      >
        <template #icon>
          <n-icon>
            <ArrowClockwise12Regular />
          </n-icon>
        </template>
        刷新
      </n-button>
      <n-icon
        class="mr-2 cursor-pointer align-middle"
        :size="22"
        color="rgb(249, 115, 22)"
        @click="isShowDrawer = true"
      >
        <ArrowExpand20Filled />
      </n-icon>
    </n-space>
  </header>
  <n-data-table
    :columns="pageData.columns"
    :data="pageData.tableData"
    :bordered="false"
    :size="'small'"
    :loading="isLoading"
    :style="{ height: '90%' }"
    flex-height
  />
  <n-drawer v-model:show="isShowDrawer" width="90%">
    <n-drawer-content>
      <template #header>监控表详情</template>
      <n-data-table
        :columns="pageData.columns"
        :data="detailTableData"
        :bordered="false"
        :size="'small'"
        :loading="isDetailTableLoading"
        :style="{ height: '100%' }"
        flex-height
      />
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import { queryLiangJiaTarget } from "/@/apis/tonghuashun";
import { columns } from "./columns";
import { ArrowExpand20Filled, ArrowClockwise12Regular } from "@vicons/fluent";
import { LiangJiaType } from "./types";

const isLoading = ref<boolean>(false);
const isShowDrawer = ref<boolean>(false);
const pageData = reactive({
  columns: columns,
  tableData: [],
  liangjiaLabelList: [
    { label: "量价齐跌", value: LiangJiaType.ljqd },
    { label: "量价齐升", value: LiangJiaType.ljqs },
  ],
});
const liangJiaType = ref<LiangJiaType>(LiangJiaType.ljqd);
const detailTableData = ref([]);
const isDetailTableLoading = ref(false);

async function startQueryLiangJiaTarget(liangjiaType: LiangJiaType) {
  isLoading.value = true;
  const { data, success } = await queryLiangJiaTarget({
    ljtype: liangjiaType,
  });
  isLoading.value = false;
  if (success && data) {
    pageData.tableData = data.data;
  }
}
const handleRefresh = async () => {
  startQueryLiangJiaTarget(liangJiaType.value);
};
const handleUpdateLiangJia = (value: LiangJiaType) => {
  liangJiaType.value = value;
  startQueryLiangJiaTarget(liangJiaType.value);
};
watch(isShowDrawer, (nval) => {
  console.log(nval);
  if (nval) {
    isDetailTableLoading.value = true;
    setTimeout(() => {
      detailTableData.value = pageData.tableData;
      isDetailTableLoading.value = false;
    }, 200);
  } else {
    detailTableData.value = [];
  }
});
onMounted(() => {
  startQueryLiangJiaTarget(liangJiaType.value);
});
</script>
