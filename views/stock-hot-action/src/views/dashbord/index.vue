<template>
  <div class="p-2 min-h-[calc(100vh)] w-[calc(100vw)]] grid grid-cols-2 gap-4">
    <div
      class="border-1px border-solid border-gray-300 rounded-sm shadow-sm p-2 h-[calc(50vh)]"
    >
      <Ticket />
    </div>
    <div
      class="border-1px border-solid border-gray-300 h-[calc(50vh)] rounded-sm"
    >
      <HotTags />
    </div>
    <div
      class="border-1px border-solid border-gray-300 h-[calc(50vh)] col-span-2 rounded-sm"
    >
      <Liangjia />
    </div>
    <div
      class="h-[calc(50vh)] border-1px border-solid border-gray-300 rounded-sm col-span-2"
    >
      <LiangJiaMonited />
    </div>
    <div
      class="h-[calc(50vh)] border-1px border-solid border-gray-300 rounded-sm"
    ></div>
  </div>
</template>
<script setup lang="ts">
import Ticket from "/@/views/dashbord/components/ticket/index.vue";
import Liangjia from "/@/views/dashbord/components/liangjia/index.vue";
import HotTags from "/@/views/dashbord/components/hot-tag/index.vue";
import LiangJiaMonited from "/@/views/dashbord/components/liangjia/monited.vue";
</script>
