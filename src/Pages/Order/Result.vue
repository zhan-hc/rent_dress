<template>
  <div class="container">
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
    this.updateSucOrder()
  },
  methods: {
    GetQueryString (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      var r = window.location.search.substr(1).match(reg) // 匹配URL的'?'符之后的正则表达式
      if (r != null) {
        return unescape(r[2])
      }
      return null
    },
    updateSucOrder () {
      const id = this.GetQueryString('out_trade_no')
      if (id) {
        this.$axios({
          method: 'post',
          url: '/order/updateSucOrder',
          data: {
            id: id,
            status: 1
          }
        }).then((res) => {
          if (res.data.status === 200) {
            console.log('支付成功')
            window.location.href = '/Order'
          } else {
            this.$Message.error(res.data.msg.sqlMessage)
          }
        })
      } else {
        console.log('更改订单状态失败')
        window.location.href = '/Order'
      }
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">

</style>
