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
      <div class="chat-text" ref='chatText' style="height:300px;overflow:scroll;letter-spacing:1px;margin-bottom:10px;">
        <div  v-for="(item, i) in list" :key='i'>
          <div class="chatText-mine" v-show="item.type === userName"
            style="margin:0 0 10px;padding:5px 10px;display:flex;">
            <div  style="padding:5px 0;white-space:nowrap;">我：</div>
            <div style="background:#7FFFAA;padding:5px 10px;border-radius:5px;word-wrap:break-word;word-break:normal;">{{item.content}}</div>
            <div style="flex: 0 0 230px;"></div>
          </div>
          <div v-show="item.type === 'robot'"
            style="margin:0 10px 10px;display:flex;flex-direction:row-reverse;">
            <div style="padding:5px 0;white-space:nowrap;">：客服</div>
            <div style="background:#E6E6FA;padding:5px 10px;border-radius:5px;word-wrap:break-word;word-break:normal;">{{item.content}}</div>
            <div style="flex: 0 0 220px;"></div>
          </div>
        </div>
      </div>
      <div class="chat-send" style="display:flex;">
        <Input  v-model='content.text' type="textarea" :autosize="{minRows: 2,maxRows: 5}" style="width:400px;flex:1;"/>
        <Button type="primary" @click="sendText" style="margin: 10px 20px;">发送</Button>
      </div>
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
  watch: {
    list () {
      let that = this
      setTimeout(() => {
        that.$refs.chatText.scrollTop = that.$refs.chatText.scrollHeight
      }, 0)
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
      localStorage.setItem('UserChatLog', '{}')
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
      that.ws = new WebSocket('ws://172.16.155.125:8022')
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
          console.log(e.data)
          const data = JSON.parse(e.data)
          if (data.text) {
            for (let i = 0; i < data.text.length; i++) {
              if (data.text[i]) {
                that.list.push({type: 'robot', content: data.text[i]})
              }
            }
          }
          that.closeModal()
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
      console.log('当前聊天记录：', this.list)
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
