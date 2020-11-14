<template>
  <div class="Rule">
    <div class="Rule-title">租赁须知</div>
    <table class="Rule-content">
      <tr><th>①预订下单</th><th>②租赁时间</th><th>③退换押金</th><th>④超期计费</th></tr>
      <tr>
        <td>为了提高服务质量，请提前7天到店选款，以便我们为您安排服装；</td>
        <td>三天起租，请在租赁当天10:00以后取衣，租赁到期之日20:00前到店归还；邮寄归还，请在租赁到期之日24小时之内顺丰邮寄，邮费由用户支付；</td>
        <td>我们收到衣服后，清点无误，立即退还押金，租金从押金中扣除，衣服丢失或损坏的情况下，有权要求赔偿；</td>
        <td>超出天数，延期租金按照每天租金收取;</td>
      </tr>
    </table>
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
.Rule{
  &-title{
    margin: 50px 0;
    text-align: center;
    font-size: 36px;
  }
  &-content{
    th{
      width: 300px;
    }
    td{
    box-sizing: border-box;
    padding: 40px;
    text-align: center;
    }
  }
}
</style>
