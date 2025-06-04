<template>
  <el-card>
    <div class="box">
      <img class="avatar" :src="userStore.avatar">
      <div class="bottom">
        <h3 class="title">{{ getTime() }}好,{{ userStore.username }}</h3>
        <p class="subTitle">ggzw运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="bottoms">
    <svg-icon name="welcome" width="500px" height="500px"></svg-icon>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/stores/modules/user';
import { getTime } from '@/utils/time';

let userStore = useUserStore();


</script>

<style lang="scss" scoped>
.box {
  display: flex;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;
    .title {
      font-size: 40px;
      font-weight: 900;
      margin-bottom: 30px;
    }
    .subTitle{
      font-style: italic;
      color: skyblue;
    }
  }
}

.bottoms{
  display: flex;
  justify-content: center;
}
</style>
