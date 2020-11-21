<template>
  <div class="Item">
    <div class="Item-img">
      <img :src="ItemList.product_img" alt="">
    </div>
    <div class="Item-title">{{ItemList.product_name}}</div>
    <div class="Item-price">{{ItemList.product_price}}</div>
    <div class="Item-size"></div>
    <div class="Item-color"></div>
    <div class="Item-num"></div>
    <div class="Item-stock"></div>
    <button></button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pid: null,
      ItemList: {}
    }
  },
  mounted () {
    this.pid = this.$route.params.pid
    this.getItemList()
  },
  methods: {
    getItemList () {
      this.$axios({
        method: 'get',
        url: '/api/product/info/getPidInfo',
        params: {
          pid: this.pid
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.ItemList = res.data.data
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.Item{
  &-img{
    width: 300px;
    height: 500px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  &-title{
    font-size: 20px;
    font-weight: bold;
  }
  &-price{
    font-size: 24px;
    color: #fd3f31;
  }
}
</style>
