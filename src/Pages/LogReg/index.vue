<template>
<div class="login">
    <ul class="login-header">
        <li><i class="iconfont icon-user"></i>登录/注册</li>
        <li><i class="iconfont icon-shoppingcarthover"></i>购物车</li>
      </ul>
      <div class="login-title">
        <router-link tag="p" to="/">礼服租赁</router-link>
      </div>
    <Card class="login-card">
      <p slot="title">
        <ul class="card-title">
          <li :class="{'active': type}" @click="chooseLogin">用户登录</li>
          <li :class="{'active': !type}" @click="chooseRegister">用户注册</li>
        </ul>
      </p>
      <Form class="card-login" v-show="type">
        <div class="card-item">
          <Icon type="md-contact" class="item-icon"/>
          <Input name="mobile"  class="log" v-model="LoginItem.mobile" type="text" placeholder="请输入手机号"/>
        </div>
        <div class="card-item">
          <Icon type="md-lock" class="item-icon" />
          <Input name="password"  class="log" v-model="LoginItem.password" type="password" placeholder="请输入密码"/>
        </div>
      </Form>
      <Form class="card-register"  v-show="!type" ref="formValidate" :model="RegItem" :rules="RegValidate">
        <div class="card-item">
          <Icon type="md-contact" class="item-icon"/>
          <FormItem prop="username">
            <Input name="username" v-model="RegItem.username" type="text" placeholder="请输入用户名"/>
          </FormItem>
        </div>
        <div class="card-item">
          <Icon type="md-lock" class="item-icon" />
          <FormItem prop="password">
            <Input name="password" v-model="RegItem.password" type="password" placeholder="请输入密码"/>
          </FormItem>
        </div>
        <div class="card-item">
          <Icon type="md-lock" class="item-icon" />
          <FormItem prop="pwdcheck">
            <Input name="pwdcheck"  v-model="RegItem.pwdcheck" type="password" placeholder="确认密码"/>
          </FormItem>
        </div>
        <div class="card-item">
          <Icon type="ios-call" class="item-icon" />
          <FormItem prop="mobile">
            <Input name="mobile" v-model="RegItem.mobile" placeholder="请输入手机号"/>
          </FormItem>
        </div>
      </Form>
      <Button class="btn" long @click="handleSubmit">{{type === 1 ? '登录' : '注册'}}</Button>
    </Card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: 1,
      LoginItem: {
        mobile: '',
        password: ''
      },
      RegItem: {
        username: '',
        password: '',
        pwdcheck: '',
        mobile: ''
      },
      RegValidate: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { type: 'string', max: 12, message: '用户名字符不能多于12位', trigger: 'blur' },
          { type: 'string', pattern: /^[0-9a-zA-Z]*$/g, message: '用户名只能是英文或者数字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur' },
          { type: 'string', max: 16, message: '密码不能多于16位', trigger: 'blur' }
        ],
        pwdcheck: [
          { required: true, validator: this.pwdCheckValidate, trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: this.validatePhone, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 确认密码校验
    pwdCheckValidate (rule, value, callback) {
      if (value === '') {
        callback(new Error('确认密码不能为空'))
      } else if (this.RegItem.password !== value) {
        callback(new Error('新密码和确认密码应相同'))
      } else {
        callback()
      }
    },
    // 手机号校验
    validatePhone (rule, value, callback) {
      this.$axios({
        method: 'get',
        url: '/api/user/userList',
        params: {
          mobile: this.RegItem.mobile
        }
      }).then((res) => {
        if (!value) {
          return callback(new Error('手机号不能为空'))
        } else if (!/^1[34578]\d{9}$/.test(value)) {
          callback(new Error('手机号格式不正确'))
        } else if (res.data.status === 200) {
          callback(new Error('手机号已被注册'))
        } else {
          callback()
        }
      })
    },
    addUser () {
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          this.$axios({
            method: 'POST',
            url: '/api/user/addUser',
            data: this.RegItem
          }).then((res) => {
            if (res.data.status === 200) {
              this.$Message.success(res.data.msg)
              this.type = 1
            } else {
              this.$Message.error(res.data.msg.rawMessage)
            }
          })
        }
      })
    },
    handleSubmit () {
      if (this.type === 1) {
        this.$axios({
          method: 'POST',
          url: '/api/user/checkUser',
          data: {
            'mobile': this.LoginItem.mobile,
            'password': this.LoginItem.password
          }
        }).then((res) => {
          if (res.data.status === 200) {
            this.$store.commit('$_setUser', res.data.data[0].username)
            this.$store.commit('$_setUserId', res.data.data[0].uid)
            this.$router.push('/homepage')
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      } else {
        this.addUser()
      }
    },
    chooseRegister () {
      this.type = 0
    },
    chooseLogin () {
      this.type = 1
    }
  },
  computed: {
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.login{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background: rgba(28,28,28,0.7);
  background: #f5f5f5;
  // color: #fff;
  &-header{
    list-style: none;
    font-weight: bold;
    margin: 20px 0;
    &:after{
      content: "";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }
    li{
      float: right;
      margin-right: 50px;
      i{
        margin-right: 10px;
      }
    }
  }
  &-title{
    z-index: 2;
    position: relative;
    text-align: center;
    // color:#696969;
    font-weight: bold;
    font-size: 0px;
    p{
      margin: 50px auto 20px;
      width: 150px;
      font-size: 36px;
      cursor: pointer;
    }
  }
  &-card{
    position: absolute;
    top: 50%;
    left: 50%;
    width:340px;
    padding: 10px;
    transform: translate(-50%,-50%);
    .btn{
      background: #696969;
      color: #fff;
      font-weight: bold;
      letter-spacing: 5px;
    }
    /deep/ .ivu-card-head{
      padding: 0;
    }
    .ivu-card-head p, .ivu-card-head-inner{
      height: 50px;
    }
    .card-title{
      list-style: none;
      display: flex;
      font-weight: bold;
      margin: 0;
      padding: 0;
      li{
        flex: 1;
        text-align: center;
        padding: 10px 0;
        border-radius: 5px;
        &.active{
          // background:#2D8CF0;
          background: #696969;
          color: #fff;
        }
      }
    }
    .card-item{
      display: flex;
      .item-icon{
        color: #ccc;
        line-height: 34px;
        width: 34px;
        height: 34px;
        font-size: 24px;
        background: #F5F5F5;
        border-radius: 3px 0 0 3px;
        border: 1px solid #ccc;
        border-right: none;
      }
      /deep/ .ivu-input{
        flex: 1;
        height: 34px;
        border-style: none;
        padding: 5px 10px;
        border: 1px solid #ccc;
        border-radius: 0 3px 3px 0;
        width: 250px;
      }
      .log{
        margin-bottom: 20px;
      }
    }

  }
}
</style>
