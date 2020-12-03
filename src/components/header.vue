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
            <DropdownItem>个人中心</DropdownItem>
             <DropdownItem @click.native="hrefOrder">我的订单</DropdownItem>
            <DropdownItem @click.native="logout">退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </li>
      <li><i class="iconfont icon-shoppingcarthover"></i>购物车</li>
    </ul>
    <div class="content-main">
      <!-- <router-link tag="p" to="/">礼服租赁</router-link> -->
      <slot></slot>
      <ul class="tab">
        <li v-for="item in category" :key="item.id" @click="sendCategory(item.id)">{{item.product_category}}</li>
      </ul>
      <div class="search">
        <Input type="text" search placeholder="搜索礼服" v-model="name" @on-search="sendName"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      category: []
    }
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
    getCategory () {
      return this.$store.state.category
    }
  },
  methods: {
    getCategoryList () {
      this.$axios({
        method: 'get',
        url: `/api/product/category/categoryList`
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
    }
  },
  components: {
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
