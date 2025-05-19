<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">

          <h1>Hello</h1>
          <h2>欢迎来到硅谷zx</h2>

          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input type="password" :prefix-icon="Lock" show-password v-model="loginForm.password"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button :loading="loading" class="login_btn" type="primary" size="default"
              @click="login()">登陆</el-button>
          </el-form-item>
        </el-form>

      </el-col>
    </el-row>

  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import useUserStore from '@/stores/modules/user'
import { useRouter ,useRoute} from 'vue-router';
import { ElNotification } from 'element-plus';
import { getTime } from '@/utils/time'

let useStore = useUserStore();
let $router = useRouter();
let $route = useRoute();
let loading = ref(false);
let loginForms = ref();

let loginForm = reactive({
  username: 'admin',
  password: '111111'
});

const login = async () => {
  await loginForms.value.validate();
  loading.value = true;
  try {
    await useStore.userLogin(loginForm)
    if($route.query.redirect){
      // 如果有路由跳转到登陆页面，登陆成功后跳转到之前的路由
      $router.push($route.query.redirect as string)
    } else {
      // 如果没有路由跳转到登陆页面，登陆成功后跳转到首页
      $router.push('/')
    }
    ElNotification({
      title: 'hi' + getTime() + '好！',
      message: '欢迎来到硅谷zx',
      type: 'success',
      duration: 2000,
      showClose: true,
    })
  } catch (error) {
    ElNotification({
      title: '登陆失败',
      message: (error as Error).message,
      type: 'error',
      duration: 2000,
      showClose: true,
    })
  } finally {
    loading.value = false;
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'change' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含字母和数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'change' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含字母和数字', trigger: 'blur' }
  ]
}

</script>

<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background-color: red;
  background: url('@/assets/images/background.jpg') no-repeat center center fixed;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat center center fixed;
    background-size: cover;
    padding: 40px;

    h1 {
      color: #fff;
      font-size: 40px;
    }

    h2 {
      color: #fff;
      font-size: 20px;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
