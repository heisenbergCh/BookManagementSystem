<template>
  <div class="login-container" >
    <el-form ref="formItem" :model="formItem" :rules="ruleItem" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">华北电力大学<br>图书管理系统</h3>
      </div>

      <el-form-item prop="account" label="注册账号">
        <el-input
          ref="account"
          v-model="formItem.account"
          placeholder="填写注册邮箱"
          name="account"
          type="text"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="name" label="姓名">
        <el-input
          ref="name"
          v-model="formItem.name"
          name="name"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item label="性别">
        <el-radio v-model="sex" label="男">男</el-radio>
        <el-radio v-model="sex" label="女">女</el-radio>
      </el-form-item>

      <el-form-item prop="password" label="输入密码">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="formItem.password"
          :type="passwordType"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item prop="password" label="确认密码">
        <el-input
          :key="passwordType"
          ref="password"
          v-model="formItem.conf_password"
          :type="passwordType"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">注册</el-button>
      <el-button style="width:100%;margin-bottom:30px;" @click.native.prevent="back()">已有账号，返回登陆</el-button>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度至少为6位'))
      } else {
        callback()
      }
    }
    return {
      sex: '男',
      msg: '图书管理系统',
      verifyCode: 'hello',
      formItem: {
        account: '',
        password: '',
        sex: '男',
        name: ''
      },
      ruleItem: {
        account: [{
          required: true,
          message: '请填写账号！',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入姓名！',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请填写密码',
          trigger: 'blur'
        }, {
          type: 'string',
          min: 3,
          message: '密码长度不能小于6位',
          trigger: 'blur'
        }],
        conf_password: [{
          required: true,
          message: '请填写密码',
          trigger: 'blur'
        }, {
          type: 'string',
          min: 3,
          message: '密码长度不能小于6位',
          trigger: 'blur'
        }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.createCode()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleRegister() {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.formItem).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // login
    handleSubmit () {
      this.loading = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.verifyCode === this.formItem.code) {
            this.$http.post('http://localhost:8001'+'/user/login',
              {
                account: this.formItem.account,
                password: this.formItem.password
              },
              {
                emulateJSON: true
              }
            ).then(function (res) {
              console.log(res.data.loginUser)
              if (res.data.result === 'yes') {
                this.$Message.success('登录成功!')
                window.localStorage.setItem('userId', res.data.loginUser.rid)
                window.localStorage.setItem('account', res.data.loginUser.account)
                window.localStorage.setItem('username', res.data.loginUser.name)
                window.localStorage.setItem('sex', res.data.loginUser.sex)
                window.localStorage.setItem('condi', res.data.loginUser.condi)
                console.log('hahaha' + res.data.condi)
                if (res.data.condi === 2) {
                  this.$router.replace({path: '/index'})
                } else if (res.data.condi === 1) {
                  this.$router.replace({path: '/manager'})
                } else {
                  this.$router.replace({path: '/reader'})
                }
              } else {
                this.$Message.error('账号或密码有误！')
                this.loading = false
              }
            })
          } else {
            this.$Message.error('请填写正确的验证码!')
            this.loading = false
          }
        } else {
          this.loading = false
        }
      })
    },
    createCode () {
      var code = ''
      var codeLength = 4
      var random = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      for (var i = 0; i < codeLength; i++) {
        var index = Math.floor(Math.random() * 36)
        code += random[index]
      }
      console.log(code)
      this.verifyCode = code
    },
    back () {
      this.$router.push({name: 'Login'});
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: linear-gradient( 135deg, #3d3e56 10%, #123597 100%);
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
