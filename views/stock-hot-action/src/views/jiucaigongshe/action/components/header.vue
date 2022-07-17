<template>
  <n-space>
    <n-radio-group v-model:value="pickValue">
      <n-radio-button
        v-for="item in datePickList"
        :value="item.value"
        :key="item.value"
        :label="item.label"
      />
    </n-radio-group>
    <n-date-picker
      v-model:value="customRange"
      type="daterange"
      :update-value-on-close="true"
    />
    <n-button type="primary" :loading="loading" @click="handlePickTodayAction"
      >爬取当日异动数据</n-button
    >
  </n-space>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import dayjs from "dayjs";
import { useMessage } from "naive-ui";
import { pickupTodayAction } from "/@/apis/jiucaigongshe";

const emit = defineEmits(["update:date"]);
interface DatePickType {
  label: string;
  value: number;
}
const loading = ref<boolean>();
const customRange = ref<[number, number]>();
const datePickList = ref<DatePickType[]>([
  {
    label: "当日",
    value: 0,
  },
  {
    label: "最近两日",
    value: 2,
  },
  {
    label: "最近三日",
    value: 3,
  },
  {
    label: "最近五日",
    value: 5,
  },
  {
    label: "最近七日",
    value: 7,
  },
  {
    label: "最近10日",
    value: 10,
  },
  {
    label: "最近20日",
    value: 20,
  },
  {
    label: "最近30日",
    value: 30,
  },
]);
// 默认选中最近三天
const pickValue = ref<number>(3);

function getDateRange(lastday: number): Record<string, string> {
  const startDay = dayjs().subtract(lastday, "day").format("YYYY-MM-DD");
  const endDay = dayjs().format("YYYY-MM-DD");
  return {
    startDay,
    endDay,
  };
}

watch(pickValue, () => {
  const range = getDateRange(pickValue.value);
  emit("update:date", range);
});
watch(customRange, () => {
  if (customRange.value?.length) {
    const startDate = dayjs(customRange.value[0]).format("YYYY-MM-DD");
    const endDate = dayjs(customRange.value[1]).format("YYYY-MM-DD");
    emit("update:date", {
      startDay: startDate,
      endDay: endDate,
    });
  }
});
onMounted(() => {
  const range = getDateRange(pickValue.value);
  emit("update:date", range);
});

const handlePickTodayAction = async () => {
  // const message = useMessage()
  // message.success("爬取当期异动数据成功")
  loading.value = true;
  const data = await pickupTodayAction();
  if (data.code === "200") {
    loading.value = false;
  }
};
</script>
