<template>
  <div class="product">
    <Select v-model="category" style="width:200px;margin-bottom:20px"  placeholder='排序' @on-change='getProduct'>
      <Option :value="0">默认</Option>
      <Option :value="1">销量</Option>
      <Option :value="2">好评度</Option>
    </Select>
    <div class="product-list">
      <div class="item" v-for="item in productList" :key="item.pid" @click.stop="getItem(item.pid)">
        <div class="item-img"><img class="item-img" :src="item.product_img" alt=""></div>
        <p class="item-title">{{item.product_name}}</p>
        <p class="item-price">￥{{item.product_price}}/天</p>
      </div>
    </div>
    <Page :total="total" @on-change="changePage" class="page"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      productList: [],
      searchName: null,
      total: 0,
      pageNo: 1,
      pageSize: 10,
      category: 0,
      cid: null // category_id
    }
  },
  mounted () {
    this.searchName = this.$route.query.name
    this.cid = this.$route.query.cid
    this.getProduct()
  },
  watch: {
    '$route': function (to, from) { // 监听到路由（参数）改变
      this.$router.go(0)
    }
  },
  methods: {
    getProduct () {
      this.$axios({
        method: 'get',
        url: '/product/info/infoList',
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          name: this.searchName || null,
          cid: this.cid || null,
          category: this.category
        }
      }).then((res) => {
        if (res.data.status === 200) {
          console.log(res)
          this.productList = res.data.data
          this.total = res.data.total
        }
      })
    },
    getItem (id) {
      this.$router.push(`/Product/item/${id}`) // 待调整
    },
    changePage (currentPage) {
      this.pageNo = currentPage
      this.getProduct()
    }
    // changeCategory () {
    //   console.log(status)
    //   console.log(this.category)
    // }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.product{
  width: 1200px;
  margin: 20px auto;
  &-list{
    min-height: 142px;
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
  .page{
    text-align: right;
    margin: 20px 20px 0 0;
  }
}
</style>
