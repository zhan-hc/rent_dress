<template>
  <div class="content">
    <ul class="content-right">
      <router-link v-show="!userName" tag="li" to="/LogReg"><i class="iconfont icon-user"></i>登录/注册</router-link>
      <li v-show="userName">
        <Dropdown>
          <a href="javascript:void(0)" style="color:#696969">{{userName}}
            <Icon type="md-arrow-dropdown" class="dropdown"/>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem @click.native="hrefPerson">个人中心</DropdownItem>
            <DropdownItem @click.native="hrefOrder">我的订单</DropdownItem>
            <DropdownItem @click.native="chatAlert">客服聊天</DropdownItem>
            <DropdownItem @click.native="logout">退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </li>
      <router-link tag="li" to="/homepage"><Icon type="md-home" />主页</router-link>
    </ul>
    <div class="content-main">
      <slot></slot>
      <ul class="tab">
        <li v-for="item in category" :key="item.id" @click="sendCategory(item.id)">{{item.product_category}}</li>
      </ul>
      <div class="search">
        <Input type="text" search placeholder="搜索礼服" v-model="name" @on-search="sendName"/>
      </div>
    </div>
    <Modal v-model="chatModal" @on-cancel='closeModal'>
      <div slot="header">客服聊天</div>
      <!-- <p>{{list}}</p> -->
      <div class="chat-text" style="height:300px;overflow:scroll;">
        <div  v-for="(item, i) in list" :key='i' >
          <div v-show="item.type === userName" style="margin:20px 0;">
          我：<span style="background:#7FFFAA;padding:5px 10px;border-radius:5px;">{{item.content}}</span>
        </div>
        <div v-show="item.type === 'robot'" style="margin:20px 10px 20px 0;text-align:right;">
          客服：<span style="background:#E6E6FA;padding:5px 10px;border-radius:5px;">{{item.content}}</span>
        </div>
        </div>
      </div>
      <Input type="text"  v-model='content.text'/>
      <button @click="sendText">发送</button>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      name: '',
      category: [],
      chatModal: false,
      list: [],
      content: {id: 0, ws: null, text: ''},
      contentText: '',
      ws: null
    }
  },
  created () {
    window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  destroyed () {
    window.removeEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  mounted () {
    if (this.getCategory) {
      this.category = this.getCategory
    } else {
      this.getCategoryList()
    }
  },
  computed: {
    userName () {
      return this.$store.state.rent_user
    },
    userId () {
      return this.$store.state.rent_userId
    },
    getCategory () {
      return this.$store.state.category
    }
  },
  methods: {
    beforeunloadFn (e) {
      this.closeModal()
    },
    getCategoryList () {
      this.$axios({
        method: 'get',
        url: `/product/category/categoryList`
      }).then((res) => {
        if (res.data.status === 200) {
          this.$store.commit('$_setCategory', res.data.data)
          this.category = res.data.data
        }
      })
    },
    logout () {
      this.$store.commit('$_removeUser') // 清除登录信息
      this.$store.commit('$_removeUserId')
      this.$Message.success('退出登陆成功')
      this.$router.push('/')
    },
    hrefOrder () {
      this.$router.push('/Order')
    },
    hrefPerson () {
      this.$router.push('/Person')
    },
    chatAlert () {
      this.chatModal = true
      this.openWs()
      let UserChatLog = localStorage.getItem('UserChatLog')
      if (UserChatLog != null) {
        this.list = JSON.parse(UserChatLog)
      }
    },
    sendName () {
      this.$router.push({
        name: 'product',
        query: {
          name: this.name
        }
      })
    },
    sendCategory (id) {
      this.$router.push({
        name: 'product',
        query: {
          cid: id,
          name: this.name
        }
      })
    },
    openWs () {
      let that = this
      that.ws = new WebSocket('ws://192.168.43.97:8022')
      if (window.WebSocket) {
        that.ws.onopen = function (e) {
          console.log('链接服务器成功')
          that.content.id = that.userId
          that.ws.send(JSON.stringify(that.content))
        }
        that.ws.onclose = function (e) {
          console.log('服务器关闭')
        }
        that.ws.onerror = function () {
          console.log('服务器出错')
        }
        that.ws.onmessage = function (e) {
          const data = JSON.parse(e.data)
          for (let i = 0; i < data.text.length; i++) {
            if (data.text[i]) {
              that.list.push({type: 'robot', content: data.text[i]})
            }
          }
        }
      }
    },
    sendText () {
      let that = this
      this.list = [...this.list, {type: this.userName, content: this.content.text}]
      this.backText(function () {
        that.content.text = ''
      })
    },
    backText (callback) {
      let that = this
      if (window.WebSocket) {
        console.log('that.contentText is', that.content.text)
        that.ws.send(JSON.stringify(that.content))
        callback()
      }
    },
    closeModal () {
      localStorage.setItem('UserChatLog', JSON.stringify(this.list))
    }
  }
}
</script>

<style scoped lang="scss">
.content{
  border-bottom: 2px solid #ccc;
  &-right{
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
      cursor: pointer;
      i{
        margin-right: 10px;
      }
    }
  }
  &-main{
    position: relative;
    text-align: center;
    color:#696969;
    font-weight: bold;
    font-size: 0px;
    p{
      margin: 50px auto 20px;
      width: 150px;
      font-size: 36px;
      cursor: pointer;
    }
    .tab{
      width: 800px;
      display: flex;
      margin: 0 auto 20px;
      font-size: 24px;
      list-style: none;
      li{
        flex: 1;
        cursor: pointer;
      }
    }
    .search{
      position: absolute;
      right: 100px;
      bottom: 0px;
      display: inline-block;
      border: 2px solid #ccc;
      border-radius: 5px;
      /deep/ Input{
        border-style: none;
      }
    }
  }
}
</style>
