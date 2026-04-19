<template>
  <q-page class="login-page">
    <div class="login-viewport">
      <section class="login-left">
        <div class="login-left-box"></div>
      </section>

      <section class="login-right">
        <div class="login-form-wrapper">
          <div class="text-h5 text-weight-bold q-mb-xs">
            Bem vindo ao Web Lovers <q-icon name="apple" class="q-mb-xs" color="red" />
          </div>

          <div class="text-grey-7 q-mb-lg">
            Entre em sua conta e comece uma aventura.
          </div>

          <q-form class="login-form" @submit="onSubmit">
            <q-input
              v-model="form.email"
              label="Email"
              outlined
              dense/>

            <q-input
              v-model="form.password"
              label="Senha"
              :type="showPassword ? 'text' : 'password'"
              outlined
              dense>
              <template #append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"/>
              </template>
            </q-input>

            <div class="row items-center justify-between">
              <q-checkbox v-model="form.remember" label="Lembrar senha" />
              <a href="#" class="auth-link">Esqueceu sua senha?</a>
            </div>

            <q-btn
              label="ENTRAR"
              unelevated
              type="submit"
              class="signin-btn"/>
          </q-form>

          <div class="text-center q-mt-md">
            Novo por aqui?
            <router-link :to="{ name: 'Register' }" class="auth-link">Crie uma conta</router-link>
          </div>

          <div class="divider">
            <span>ou</span>
          </div>

          <div class="social-login">
            <q-btn flat round icon="fab fa-facebook-f" class="social-btn facebook" size="sm" />
            <q-btn flat round icon="fab fa-google" class="social-btn google" size="sm" />
            <q-btn flat round icon="fab fa-x-twitter" class="social-btn twitter" size="sm" />
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';

  console.log('Teste');

  const showPassword = ref(false);

  const form = reactive({
    email: '',
    password: '',
    remember: false
  });

  function onSubmit () {
    console.log(form);
  }
</script>

<style scoped>
  .login-page {
    position: relative;
    background: #ffffff;
    overflow: hidden;
  }

  .login-viewport {
    position: absolute;
    inset: 0;
    display: flex;
    overflow: hidden;
    background: #ffffff;
  }

  .login-left {
    flex: 0 0 70%;
    padding: 24px;
    box-sizing: border-box;
    min-width: 0;
  }

  .login-left-box {
    width: 100%;
    height: 100%;
    border-radius: 20px;
    background: #f4f3f7;
  }

  .login-right {
    flex: 0 0 30%;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 40px;
    box-sizing: border-box;
    overflow-y: auto;
    background: #ffffff;
  }

  .login-form-wrapper {
    width: 100%;
    max-width: 390px;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .signin-btn {
    width: 100%;
    background: #7367f0;
    color: #ffffff;
    border-radius: 10px;
  }

  .auth-link {
    color: #7367f0;
    text-decoration: none;
    font-weight: 500;
  }

  .divider {
    position: relative;
    text-align: center;
    margin: 24px 0;
  }

  .divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    border-top: 1px solid #e5e5e5;
  }

  .divider span {
    position: relative;
    background: #ffffff;
    padding: 0 12px;
    color: #999999;
  }

  .social-login {
    display: flex;
    justify-content: center;
    gap: 12px;
  }

  .social-btn {
    width: 38px;
    height: 38px;
  }

  .facebook {
    background: #eef1ff;
    color: #7367f0;
  }

  .google {
    background: #fff1f1;
    color: #ea4335;
  }

  .twitter {
    background: #eef7ff;
    color: #1da1f2;
  }

  @media (max-width: 768px) {
    .login-left {
      display: none;
    }

    .login-right {
      flex: 1 1 auto;
      padding: 24px;
    }

    .login-form-wrapper {
      max-width: 420px;
      margin: 0 auto;
    }
  }
</style>
