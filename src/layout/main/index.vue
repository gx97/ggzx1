<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <div v-if="flag">
          <component :is="Component" />
        </div>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from 'vue'
import useLayOutSettingStore from '@/stores/modules/setting'

let layOutSettingStore = useLayOutSettingStore()

let flag = ref(true)

watch(() => layOutSettingStore.refsh, () => {
  flag.value = false
  nextTick(() => {
    flag.value = true
  })
})

</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
  /* transform: rotate(0deg); */
  /* transform: scale(0); */
}

.fade-enter-active {
  transition: all 1s;
}

.fade-enter-to {
  opacity: 1;
  /* transform: rotate(360deg); */
  /* transform: scale(1); */
}
</style>
