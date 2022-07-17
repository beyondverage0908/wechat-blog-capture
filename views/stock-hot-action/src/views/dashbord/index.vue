<template>
  <div class="p-2 h-[calc(100vh)] w-[calc(100vw)]] grid grid-cols-2 gap-2">
    <div
      class="min-h-1/4 border-1px border-solid border-gray-300 rounded-sm shadow-sm p-2"
    >
      <n-space>
        <n-date-picker
          class="mb-2 w-full flex-auto"
          v-model:value="pickDate"
          value-format="yyyy-MM-dd"
          placeholder="请先选择小票时间后进行导出"
          type="date"
          clearable
        />
        <n-button class="flex-1" type="primary" @click="handleGetGenerage"
          >GET导出</n-button
        >
        <n-button class="flex-1" type="primary" @click="handlePostGenerage"
          >POST导出</n-button
        >
      </n-space>
      <n-space>
        <n-tag
          v-for="item in selectDates"
          :key="item"
          @close="handleClose(item)"
          round
          closable
          >{{ item }}</n-tag
        >
      </n-space>
    </div>
    <div class="bg-blue-300 min-h-1/4"></div>
    <div class="bg-blue-300 min-h-1/4"></div>
    <div class="bg-blue-300 min-h-1/4"></div>
    <div class="bg-blue-300 min-h-1/4"></div>
    <div class="bg-blue-300 min-h-1/4"></div>
    <div class="bg-blue-300 min-h-1/4"></div>
    <div class="bg-blue-300 min-h-1/4"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import download from "/@/libs/download";
import dayjs from "dayjs";
import { useMessage } from "naive-ui";

const selectDates = ref<string[]>([]);
const pickDate = ref(null);
const message = useMessage();

const handleGetGenerage = async () => {
  const dateList = selectDates.value;
  download.downloadFile({
    url: "/pac/api/ticket/generate",
    query: { dateList: dateList.join(",") },
  });
};

const handlePostGenerage = async () => {
  download.downloadFileWithPost("/pac/api/ticket/generate", {
    dateList: selectDates.value,
  });
};

const handleClose = (str: string) => {
  const index = selectDates.value.indexOf(str);
  if (index > -1) {
    selectDates.value.splice(index, 1);
  }
};

const appendSelectDate = (date: string | number | Date) => {
  const formatDate = dayjs(date).format("YYYY-MM-DD");
  if (selectDates.value.includes(formatDate)) {
    return;
  }
  selectDates.value.push(formatDate);
};

watch(pickDate, () => {
  if (!pickDate.value) {
    return;
  }
  appendSelectDate(pickDate.value);
  pickDate.value = null;
});
</script>
