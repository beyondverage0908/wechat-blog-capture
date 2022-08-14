<template>
  <div>
    <header
      class="flex items-center justify-between pl-3 pr-3 h-9 border-b border-gray-300 border-solid"
    >
      <b>热门标签</b>
      <div>
        <n-button size="tiny" type="primary" @click="handleSaveHotTags">
          <template #icon>
            <n-icon>
              <Save16Regular />
            </n-icon>
          </template>
          保存
        </n-button>
      </div>
    </header>
    <div class="p-2">
      <n-checkbox-group v-model:value="checkTags">
        <n-space item-style="display: flex;">
          <n-checkbox
            v-for="item in hots"
            :value="item._id"
            :label="`${item._id}(${item.count})`"
          />
        </n-space>
      </n-checkbox-group>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getJcgsHotTags,
  saveJcgsHotTags,
  getJcgsCheckedHotTags,
} from "/@/apis/tonghuashun";
import { Save16Regular } from "@vicons/fluent";

type HotType = {
  _id: string;
  count: number;
};

const hots = ref<HotType[]>([]);
const checkTags = ref<string[]>([]);

const handleSaveHotTags = async () => {
  const data = await saveJcgsHotTags(checkTags.value);
  if (data && data.success) {
    window.$message.success("保存成功");
  }
};

onMounted(async () => {
  const checkedData = await getJcgsCheckedHotTags();
  if (checkedData.success && checkedData.data) {
    checkTags.value = checkedData.data.map(
      (item: { name: string }) => item.name
    );
  }
  const data = await getJcgsHotTags(10);
  if (data.success) {
    hots.value = data.data as HotType[];
  }
});
</script>
