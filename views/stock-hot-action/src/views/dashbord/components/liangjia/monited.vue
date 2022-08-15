<template>
  <div class="h-full">
    <header
      class="flex items-center justify-between pl-3 pr-3 h-9 border-b border-gray-300 border-solid"
    >
      <div><b>监控中</b></div>
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
      </n-space>
    </header>
    <div class="h-[calc(100%-30px)]">
      <n-data-table
        :columns="pageData.columns"
        :data="pageData.tableData"
        :bordered="false"
        :size="'small'"
        :loading="isLoading"
        :style="{ height: '90%' }"
        flex-height
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ArrowClockwise12Regular } from "@vicons/fluent";
import { reactive, ref, onMounted } from "vue";
import { getSimpleColumns } from "./columns";
import { queryLiangJiaTarget } from "/@/apis/tonghuashun";
import { MonitType, LiangJiaType } from "./types";

const handleAction = () => {
  startQueryLiangJiaTarget(liangJiaType.value);
};

const isLoading = ref<boolean>(false);
const pageData = reactive({
  columns: getSimpleColumns(handleAction),
  tableData: [],
  liangjiaLabelList: [
    { label: "量价齐跌", value: LiangJiaType.ljqd },
    { label: "量价齐升", value: LiangJiaType.ljqs },
  ],
});
const liangJiaType = ref<LiangJiaType>(LiangJiaType.ljqd);

const handleRefresh = () => {
  startQueryLiangJiaTarget(liangJiaType.value);
};
const handleUpdateLiangJia = (value: LiangJiaType) => {
  liangJiaType.value = value;
  startQueryLiangJiaTarget(liangJiaType.value);
};

async function startQueryLiangJiaTarget(liangJiaType: LiangJiaType) {
  isLoading.value = true;
  const { data, success } = await queryLiangJiaTarget({
    monit: MonitType.moniting,
    ljtype: liangJiaType,
  });
  isLoading.value = false;
  if (success && data) {
    console.log(data.data);
    pageData.tableData = data.data;
  }
}

onMounted(() => {
  startQueryLiangJiaTarget(liangJiaType.value);
});
</script>
