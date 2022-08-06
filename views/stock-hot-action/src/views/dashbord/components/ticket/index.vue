<template>
  <n-card title="小票" :bordered="false">
    <template #header-extra>
      <n-date-picker
        class="flex-auto w-1/2 mr-2"
        v-model:value="pickDate"
        value-format="yyyy-MM-dd"
        placeholder="请先选择小票时间后进行导出"
        type="date"
        clearable
      />
      <n-button class="flex-1 mr-2" type="primary" @click="handleGetGenerage"
        >GET导出</n-button
      >
      <n-button class="flex-1" type="primary" @click="handlePostGenerage"
        >POST导出</n-button
      >
    </template>
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
  </n-card>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import download from "/@/libs/download";
import dayjs from "dayjs";

const selectDates = ref<string[]>([]);
const pickDate = ref(null);

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
