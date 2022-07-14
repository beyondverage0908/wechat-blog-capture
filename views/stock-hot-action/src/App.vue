<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NLoadingBarProvider, NNotificationProvider, NDialogProvider } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-loading-bar-provider>
      <n-message-provider :placement="'bottom-right'">
        <n-notification-provider>
          <n-dialog-provider>
            <router-view></router-view>
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style>
</style>
