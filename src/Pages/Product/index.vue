<template>
  <div class="product">
    <div class="product-list">
      <div class="item" v-for="item in productList" :key="item.pid" @click.stop="getItem(item.pid)">
        <div class="item-img"><img class="item-img" :src="item.product_img" alt=""></div>
        <p class="item-title">{{item.product_name}}</p>
        <p class="item-price">￥{{item.product_price}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      productList: []
    }
  },
  mounted () {
    this.getProduct()
  },
  methods: {
    getProduct () {
      this.$axios({
        method: 'get',
        url: '/api/product/info/infoList'
      }).then((res) => {
        if (res.data.status === 200) {
          this.productList = res.data.data
        }
      })
    },
    getItem (id) {
      this.$router.push(`/Product/item/${id}`) // 待调整
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.product{
  width: 1200px;
  margin: 50px auto;
  &-list{
    // display: flex;
    // flex-wrap: wrap;
    // justify-content: space-between;
    // align-content: space-between;
    .item{
      float: left;
      width: 240px;
      height: 350px;
      font-size: 0;
      padding: 20px;
      border: 1px solid #ccc;
      box-sizing: border-box;
      text-align: center;
      cursor: pointer;
      &-img{
        height: 250px;
        width: 200px;
        box-sizing: border-box;
        img{
          width: 100%;
          height: 100%;
        }
      }
      &-title{
        margin-top: 10px;
        font-size: 18px;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &-price{
        font-size: 18px;
        // font-weight: bold;
        color: #fd3f31;
      }
    }
    &::after{
      content: "";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }
    // &:nth-of-type(4n+0){
    //   margin-top: 20px;
    // }
  }
}
</style>
