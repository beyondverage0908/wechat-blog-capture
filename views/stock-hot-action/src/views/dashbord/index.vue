<template>
  <div class="p-2 min-h-[calc(100vh)] w-[calc(100vw)]] grid grid-cols-2 gap-4">
    <div
      class="border-1px border-solid border-gray-300 rounded-sm shadow-sm p-2 h-[calc(50vh)]"
    >
      <Ticket />
    </div>
    <div class="bg-orange-500 h-[calc(50vh)] rounded-sm"></div>
    <div
      class="border-1px border-solid border-gray-300 h-[calc(50vh)] col-span-2 rounded-sm"
    >
      <Liangjia />
    </div>
    <div class="bg-blue-300 h-[calc(50vh)]"></div>
    <div class="bg-blue-300 h-[calc(50vh)]"></div>
  </div>
</template>
<script setup lang="ts">
import Ticket from "/@/views/dashbord/components/ticket/index.vue";
import Liangjia from "/@/views/dashbord/components/liangjia/index.vue";
</script>
