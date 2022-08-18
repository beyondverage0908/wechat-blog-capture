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
    <div class="h-[calc(100%-30px)]">
      <n-data-table
        :row-props="handleRowProps"
        :row-class-name="handleRowClassName"
        :columns="pageData.columns"
        :data="pageData.tableData"
        :bordered="false"
        size="medium"
        :loading="isLoading"
        :style="{ height: '90%' }"
        flex-height
      />
    </div>
    <n-drawer v-model:show="isShowDrawer" width="90%">
      <n-drawer-content>
        <template #header>
          <div class="flex items-center justify-between">
            <n-space :align="'center'">
              <b>监控中详情列表</b>
              <n-date-picker
                clearable
                size="small"
                v-model:value="pickDate"
                value-format="yyyy-MM-dd"
                type="date"
              />
            </n-space>
          </div>
        </template>
        <n-data-table
          :row-props="handleRowProps"
          :row-class-name="handleRowClassName"
          :columns="pageData.columns"
          :data="filterTableData"
          :bordered="false"
          :size="'small'"
          :loading="isLoading"
          :style="{ height: '100%' }"
          flex-height
        />
      </n-drawer-content>
    </n-drawer>
    <n-drawer v-model:show="isShowStockDetail" width="50%">
      <n-drawer-content
        ><StockDetail :code="stockDetailCode"
      /></n-drawer-content>
    </n-drawer>
  </div>
</template>
<script lang="ts" setup>
import { ArrowExpand20Filled, ArrowClockwise12Regular } from "@vicons/fluent";
import { reactive, ref, onMounted, watch } from "vue";
import { getSimpleColumns, ActionTrigger } from "./columns";
import { queryLiangJiaTarget } from "/@/apis/tonghuashun";
import { MonitType, LiangJiaType } from "./types";
import dayjs from "dayjs";
import StockDetail from "./stock-detail.vue";

const handleAction = (type: ActionTrigger, extendPrams?: any) => {
  if (type === ActionTrigger.refresh) {
    startQueryLiangJiaTarget(liangJiaType.value);
  } else if (type === ActionTrigger.detailStock) {
    getJcgsStockDetail(extendPrams as string);
  }
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
const currentClickRowIndex = ref<number>();
const isShowDrawer = ref<boolean>(false);
const pickDate = ref<string>();
const filterTableData = ref(pageData.tableData);
const isShowStockDetail = ref<boolean>(false);
const stockDetailCode = ref<string>();

async function getJcgsStockDetail(code: string) {
  stockDetailCode.value = code;
  isShowStockDetail.value = true;
}

const handleRowProps = (rowData: object, rowIndex: number) => {
  return {
    style: "cursor: pointer;",
    onClick: () => {
      currentClickRowIndex.value = rowIndex;
    },
  };
};
const handleRowClassName = (row: any, index: number) => {
  if (currentClickRowIndex.value === index) {
    return "row-highlight";
  }
  return "";
};

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
    pageData.tableData = data.data;
    if (isShowDrawer.value && pickDate.value) {
      const formatDate = dayjs(pickDate.value).format("YYYY-MM-DD");
      filterTableData.value = pageData.tableData.filter(
        (item: any) => item.checkTime === formatDate
      );
    } else {
      filterTableData.value = pageData.tableData;
    }
  }
}
watch(pickDate, (nval) => {
  if (nval) {
    const formatDate = dayjs(nval).format("YYYY-MM-DD");
    filterTableData.value = pageData.tableData.filter(
      (item: any) => item.checkTime === formatDate
    );
  } else {
    filterTableData.value = pageData.tableData;
  }
});

onMounted(() => {
  startQueryLiangJiaTarget(liangJiaType.value);
});
</script>
