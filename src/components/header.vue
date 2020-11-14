<template>
  <div class="content">
    <ul class="content-right">
      <li><i class="iconfont icon-user"></i>登录/注册</li>
      <li><i class="iconfont icon-shoppingcarthover"></i>购物车</li>
    </ul>
    <div class="content-main">
      <p>礼服租赁</p>
      <ul class="tab">
        <li>婚纱</li>
        <li>晚礼服</li>
        <li>衬衫</li>
        <li>西服</li>
      </ul>
      <div class="search">
        <input type="text" placeholder="搜索礼服"/>
        <i class="iconfont icon--search1"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

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
    }
    .tab{
      width: 800px;
      display: flex;
      margin: 0 auto 20px;
      font-size: 24px;
      list-style: none;
      li{
        flex: 1;
      }
    }
    .search{
      position: absolute;
      right: 100px;
      bottom: 0px;
      display: inline-block;
      border: 2px solid #ccc;
      input{
        height: 24px;
        border-style: none;
        // margin-right: 10px;
        outline: none;
      }
      i{
        font-size: 14px;
        padding: 0 5px;
      }
    }
  }
}
</style>
