<template>
  <div class="h-[calc(100vh)] w-[calc(100vw)]] bg-yellow-600">
    <div class="w-1/4 p-2 bg-light-900 shadow-blue-400 min-h-1/4">
      <n-date-picker
        class="mb-2 w-60"
        v-model:value="pickDate"
        value-format="yyyy-MM-dd"
        type="date"
        clearable
      />
      <n-space>
        <n-tag
          closable
          v-for="item in selectDates"
          :key="item"
          @close="handleClose(item)"
          >{{ item }}</n-tag
        >
      </n-space>
      <n-space class="mt-2">
        <n-button type="primary" @click="handleGetGenerage">GET导出</n-button>
        <n-button type="primary" @click="handlePostGenerage">POST导出</n-button>
      </n-space>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import download from "/@/libs/download";
import dayjs from "dayjs";

const selectDates = ref<string[]>([]);
const pickDate = ref(null);

const handleGetGenerage = async () => {
  const dateList = selectDates.value;
  download.downloadFile({
    url: "/pac/api/ticket/generate",
    query: { dateList: ["2022-12-13", "2022-11-15"].join(",") },
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

watch(pickDate, () => {
  if (!pickDate.value) {
    return;
  }
  const formatDate = dayjs(pickDate.value).format("YYYY-MM-DD");
  if (selectDates.value.includes(formatDate)) {
    return;
  }
  selectDates.value.push(formatDate);
  pickDate.value = null;
});
</script>
