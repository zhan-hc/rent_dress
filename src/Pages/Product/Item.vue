<template>
  <div class="Item">
    <item-header></item-header>
    <div class="Item-content">
      <div class="content-img">
        <img :src="ItemList.product_img" alt="">
      </div>
      <div class="content-info">
        <div class="info-title">{{ItemList.product_name}}</div>
        <div class="info-price">
          价格：
          <span>￥{{ItemList.product_price}}</span>
        </div>
        <ul class="info-appraise">
          <li>月销量：<span>0</span></li>
          <li>累计评价：<span>0</span></li>
        </ul>
        <div class="info-color">
          颜色：
          <RadioGroup type="button" v-if="ItemList" v-model="color" class="color">
            <Radio :label="key" v-for="(item, key, i) in ItemList.product_color" :key="i" class="rad"></Radio>
          </RadioGroup>
        </div>
        <div class="info-size">
          尺寸：
          <RadioGroup type="button" v-if="color" v-model="size" class="size">
            <Radio :label="item.size" v-for="(item, i) in ItemList.product_color[color]" :key="i" class="rad"></Radio>
          </RadioGroup>
        </div>
        <div class="info-num">
          数量：
          <InputNumber :max="100" :min="1" v-model="num" style="width:40px"></InputNumber>
          <div class="operate">
            <Icon type="ios-arrow-up" class="icon" @click="operate(1)"/>
            <Icon type="ios-arrow-down" class="icon"  @click="operate(2)"/>
          </div>
        </div>
        <div class="info-stock" v-if="ItemStock" @click="test">
          库存：
          {{ItemStock['stock']}}
          件
        </div>
        <button class="add-order">立即预约</button>
        <button class="add-car">
          <!-- <Icon type="ios-cart" /> -->
          加入购物车
        </button>
      </div>
    </div>
    <item-footer></item-footer>
  </div>
</template>

<script>
import ItemHeader from '@/components/header'
import ItemFooter from '@/components/footer'
export default {
  data () {
    return {
      pid: null,
      ItemList: {},
      colorInfo: [],
      color: '',
      num: 1,
      size: ''
    }
  },
  mounted () {
    this.pid = this.$route.params.pid
    this.getItemList()
  },
  computed: {
    ItemColor () {
      for (let key in this.ItemList['product_color']) {
        return key
      }
    },
    ItemStock () {
      return this.colorInfo.filter((item) => {
        return item.size === this.size
      })[0]
    }
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
          this.color = this.ItemColor
          this.colorInfo = this.ItemList.product_color[this.color]
          this.size = this.colorInfo[0].size
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    operate (type) {
      if (type === 1) this.num += 1
      else this.num = this.num === 1 ? 1 : this.num - 1
    },
    test () {
      console.log(this.ItemStock)
    }
  },
  components: {
    ItemHeader,
    ItemFooter
  }
}
</script>

<style scoped lang="scss">
.Item{
  &-content{
    margin: 50px auto;
    width: 1000px;
    text-align: center;
    .content-img{
      display: inline-block;
      width: 300px;
      height: 415px;
      border-left: 1px solid #ccc;
      padding-left: 20px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .content-info{
      display: inline-block;
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
      margin-left: 20px;
      padding: 0 20px;
      width: 500px;
      vertical-align: top;
      font-weight: bold;
      color: #696969;
      font-size: 18px;
      text-align: left;
      .info-title{
        margin-top: 10px;
        font-weight: bold;
        font-size: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .info-price{
        margin-top: 10px;
        font-size: 18px;
        span{
          font-size: 24px;
          color: #fd3f31;
        }
      }
      .info-appraise{
        display: flex;
        font-size: 16px;
        margin-top: 10px;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        padding: 5px 0;
        list-style: none;
        li{
          flex: 1;
          text-align: center;
        }
        // font-size: 18px;
        span{
          // font-size: 24px;
          color: #fd3f31;
        }
      }
      .info-color{
        margin-top: 10px;
      }
      .info-size{
        margin: 20px 0;
      }
      .info-num{
        margin-bottom: 10px;
        padding-bottom: 10px;
        .operate{
          display: inline-block;
          height: 40px;
          width: 20px;
          vertical-align: bottom;
          .ivu-icon-ios-arrow-up{
            margin:5px 0 5px;
          }
          .icon{
            display: block;
            border: 1px solid #ccc;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
          }
        }
      }
      .info-stock{
        margin: 0 0 20px;
      }
      .rad{
        margin: 0 20px 0 0;
      }
      .add-order{
        padding: 5px 0;
        width: 178px;
        height: 38px;
        background-color: #ffeded;
        border: 1px solid #FF0036;
        color: #FF0036;
      }
      .add-car{
        background: #ff0036;
        border-style: none;
        padding: 5px 0;
        width: 178px;
        height: 38px;
        color: #fff;
        font-weight: bold;
      }
    }
  }
}
</style>
