<template>
  <div class="person">
    <item-header>
      <p>个人中心</p>
    </item-header>
    <div class="person-content">
      <div class="info">
        <p>您的基础信息</p>
        <ul>
          <li>会员名：<span>{{userList.username}}</span></li>
          <li>绑定手机号：{{userList.mobile}}</li>
        </ul>
      </div>
      <p>您的安全服务</p>
      <table class="safe">
        <tr>
          <td class="safe-title">登录密码</td>
          <td class="safe-desc" width='50%'>安全性高的密码可以使账号更安全。建议您定期更换密码，且设置一个包含数字和字母，并长度超过6位以上的密码。</td>
          <td class="safe-change" width='20%' @click="modal1=true;type=1;">修改</td>
        </tr>
        <tr>
          <td class="safe-title">绑定手机</td>
          <td class="safe-desc" width='50%'>绑定手机后，您即可享受丰富的手机服务，如手机找回密码等。</td>
          <td class="safe-change" width='20%' @click="modal1=true;type=2;">修改</td>
        </tr>
      </table>
    </div>
    <Modal v-model="modal1" :transfer="false">
      <div slot="header">修改{{type===1 ? '密码': '手机号'}}</div>
      <Form v-show="type===1" ref='PassValidate' :label-width="80" :model="passItem" :rules="PassValidate">
        <FormItem label="原密码" prop='oldpassword'>
          <Input v-model="passItem.oldpassword" type="password" placeholder="请输入原密码" style="width:200px;"/>
        </FormItem>
        <FormItem label="新密码" prop='password'>
          <Input v-model="passItem.password" type="password" placeholder="请输入新密码" style="width:200px;"/>
        </FormItem>
        <FormItem label="确认密码" prop='pwdcheck'>
          <Input v-model="passItem.pwdcheck" type="password" placeholder="请输入确认密码" style="width:200px;"/>
        </FormItem>
      </Form>
      <Form v-show="type===2" ref='MbValidate' :label-width="80" :model="mobileItem" :rules="MbValidate">
        <FormItem label="原手机号" prop='oldmobile'>
          <Input v-model="mobileItem.oldmobile" placeholder="请输入原手机号" style="width:200px;"/>
        </FormItem>
        <FormItem label="新手机号" prop='mobile'>
          <Input v-model="mobileItem.mobile" placeholder="请输入新手机号" style="width:200px;"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="updatePsOrMb">确认</Button>
        <Button type="text" @click="closeModal">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import ItemHeader from '@/components/header'
export default {
  data () {
    return {
      userList: {},
      passItem: {
        oldpassword: '',
        password: null,
        pwdcheck: ''
      },
      mobileItem: {
        oldmobile: '',
        mobile: null
      },
      MbValidate: {
        oldmobile: [
          { required: true, message: '原手机号不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: this.validatePhone, trigger: 'blur' }
        ]
      },
      PassValidate: {
        oldpassword: [
          { required: true, message: '原密码不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur' },
          { type: 'string', max: 16, message: '密码不能多于16位', trigger: 'blur' }
        ],
        pwdcheck: [
          { required: true, validator: this.pwdCheckValidate, trigger: 'blur' }
        ]
      },
      modal1: false,
      type: 1
    }
  },
  mounted () {
    this.getUserInfo()
  },
  computed: {
    userId () {
      return this.$store.state.rent_userId
    }
  },
  methods: {
    // 确认密码校验
    pwdCheckValidate (rule, value, callback) {
      if (value === '') {
        callback(new Error('确认密码不能为空'))
      } else if (this.passItem.password !== value) {
        callback(new Error('新密码和确认密码应相同'))
      } else {
        callback()
      }
    },
    // 手机号校验
    validatePhone (rule, value, callback) {
      this.$axios({
        method: 'get',
        url: '/user/userList',
        params: {
          mobile: this.mobileItem.mobile
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
    // 退出登录
    logout () {
      this.$store.commit('$_removeUser') // 清除登录信息
      this.$store.commit('$_removeUserId')
      this.$Message.success('更改成功，请重新登录！')
      this.$router.push('/LogReg')
    },
    getUserInfo () {
      this.$axios({
        method: 'get',
        url: `/user/getIdUser/${this.userId}`
      }).then((res) => {
        if (res.data.status === 200) {
          this.userList = res.data.data[0]
        } else {
          this.userList = null
        }
      })
    },
    updatePsOrMb () {
      if (this.type === 1) {
        if (this.userList.password !== this.passItem.oldpassword) {
          this.$Message.error('原密码错误')
          return false
        }
      } else {
        if (this.userList.mobile !== this.mobileItem.oldmobile) {
          this.$Message.error('原手机号错误')
          return false
        }
      }
      this.$axios({
        method: 'post',
        url: this.type === 1 ? '/user/updatePassword' : '/user/updateMobile',
        data: {
          'uid': this.userId,
          'password': this.passItem.password,
          'mobile': this.mobileItem.mobile
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.logout()
        } else {
          this.$Message.error(res.data.msg.sqlMessage)
        }
      })
    },
    closeModal () {
      this.modal1 = false
      this.$refs['PassValidate'].resetFields()
      this.$refs['MbValidate'].resetFields()
    }
  },
  components: {
    ItemHeader
  }
}
</script>

<style scoped lang="scss">
.person{
  min-width: 1400px;
  &-content{
    margin: 50px auto;
    width: 1000px;
    height: 400px;
    padding: 0 30px;
    border-left: 2px solid #ccc;
    border-right: 2px solid #ccc;
    p{
      font-size: 18px;
      font-weight: bold;
      letter-spacing: 2px;
    }
    .info{
      ul{
        list-style: none;
        margin: 20px 0;
        margin-left: 20px;
        li{
          margin-bottom: 10px;
          span{
            color: red;
          }
        }
      }
    }
    .safe{
      text-align: center;
      height: 200px;
      border-collapse: collapse;
      width: 80%;
      margin: 0 auto;
      tr{
        border-bottom: 2px dotted #c0c0c0;
      }
      &-title{
        font-weight: bold;
        font-size: 16px;
      }
      &-change{
        color: blue;
        font-size: 16px;
        font-weight: bold;
        letter-spacing: 2px;
        cursor: pointer;
      }
    }
  }
}
</style>
