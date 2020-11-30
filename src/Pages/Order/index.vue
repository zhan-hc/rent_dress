<template>
  <div class="Order">
    <item-header>
      <p>我的订单</p>
    </item-header>
    <div class="Order-list">
      <div class="item" v-for="item in OrderList" :key="item.id">
        <div class="item-header">
          <span>订单号：{{item.oid}}</span>
          <span>下单日期：{{formatTime(item.createTime)}}</span>
          </div>
        <div class="item-main">
          <div class="item-img"><img :src="item.product_img" alt=""></div>
          <div class="item-info">
            <div class="item-title">{{item.product_name}}</div>
            <div class="item-price">￥ {{item.product_price}} / 天</div>
            <div class="item-color-size">{{item.product_color}} / {{item.product_size}}</div>
            <div class="item-rent">租期：{{rent_time(item.startTime,item.endTime)}}天</div>
            <div class="item-start">租期区间：{{formatTime(item.startTime,1)}}----{{formatTime(item.endTime,1)}}</div>
            <div class="item-deposit">押金：{{item.product_deposit}}</div>
          </div>
          <div class="item-address">
            <p>收货地址：{{item.address}}</p>
            收件人：{{item.addressee}}<br>
            手机号：{{item.mobile}}<br>
            <span v-show="item.note">备注：{{item.note}}</span>
          </div>
        </div>
        <div class="item-footer">
          <div class="item-total">总金额: ￥{{rent_time(item.startTime,item.endTime)*item.product_price + item.product_deposit}}</div>
          <button class="item-btn" v-if="checkStatus(item.status)" @click="changeStatus(item.oid,item.status)">{{checkStatus(item.status)}}</button>
        </div>
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
      OrderList: []
    }
  },
  mounted () {
    this.getOrderList()
  },
  computed: {
    userId () {
      return this.$store.state.rent_userId
    }
  },
  methods: {
    getOrderList () {
      this.$axios({
        method: 'get',
        url: `/api/order/getIdOrder/${this.userId}`
      }).then((res) => {
        if (res.data.status === 200) {
          this.OrderList = res.data.data
          console.log(res)
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    rent_time (t1, t2) {
      return this.moment(t2).diff(this.moment(t1), 'days') + 1
    },
    formatTime (val, type) {
      if (type === 1) {
        return this.moment(val).format('YYYY-MM-DD')
      }
      return this.moment(val).format('YYYY-MM-DD HH:mm:ss')
    },
    checkStatus (status) {
      if (status === 0) return '确认收货'
      else if (status === 1) return '立即评价'
      else return ''
    },
    changeStatus (id, status) {
      if (status === 0) {
        this.$Modal.confirm({
          title: '确认收货提示',
          content: '是否确认收货？',
          onOk: () => {
            this.$axios({
              method: 'post',
              url: '/api/order/updateOrderStatus',
              data: {
                oid: id,
                status: 1
              }
            }).then((res) => {
              if (res.data.status === 200) {
                this.$Message.success(res.data.msg)
                this.getOrderList()
              } else {
                this.$Message.error(res.data.msg.sqlMessage)
              }
            })
          }
        })
      }
    }
  },
  components: {
    ItemHeader,
    ItemFooter
  }
}
</script>

<style scoped lang="scss">
.Order{
  &-list{
    min-height: 192px;
    width: 800px;
    margin: 50px auto;
    .item{
      border: 2px solid #ccc;
      margin-top: 20px;
      &-header{
        background: #f5f5f5;
        padding: 5px 0 5px 10px;
        span{
          margin-right: 20px;
        }
      }
      &-main{
        display: flex;
        padding: 5px 10px;
         .item-img{
          width: 120px;
          height: 120px;
          margin-right: 20px;
          box-sizing: border-box;
          img{
            border-radius: 5px;
            width: 100%;
            height: 100%;
          }
        }
        .item-info{
          flex: 1;
          .item-title{
            width: 200px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .item-address{
          width: 300px;
          p{
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
      }
      &-footer{
        display: flex;
        border-top: 1px solid #ccc;
        padding: 5px 0 5px 10px;
        height: 43px;
        .item-total{
          flex: 1;
          color: red;
          font-size: 16px;
          font-weight: bold;
          line-height: 33px;
        }
        .item-btn{
          margin-right: 30px;
          border-style: none;
          width: 150px;
          color: red;
          letter-spacing: 2px;
          padding: 5px 0;
          background: #fff;
          border: 2px solid red;
          border-radius: 20px;
          cursor: pointer;
          &:focus{
            outline: none;
          }
        }
      }
    }
  }
}
</style>
