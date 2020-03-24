<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      @submit.native.prevent
      auto-complete="on"
      label-position="left"
    >
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          :disabled="loading"
          name="password"
          tabindex="2"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error("The password can not be less than 4 digits"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        password: ""
      },
      loginRules: {
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      passwordType: "password",
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch(
              "user/login",
              Object.assign({}, this.loginForm, { username: "admin" })
            )
            .then(() => {
              this.$router.push({ path: "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
$bg: #fff;
$dark_gray: #889aa4;

/* reset element-ui css */
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  display: flex;
  align-items: center;
  .login-form {
    position: relative;
    width: 300px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
  }
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;

    input {
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 0px 5px 0px 15px;
      color: #333;
      height: 40px;
      background-color: transparent;
    }
  }

  .svg-container {
    padding: 0px 0px 0px 11px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

