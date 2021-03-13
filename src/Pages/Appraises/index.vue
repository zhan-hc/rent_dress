<template>
  <div class="Appraises">
    <h2>累计评价({{total}})</h2>
    <div class="Appraises-header">
      <div class="header-rate">
        <h3>与描述相符</h3>
        <strong >{{avgScore}}</strong>
        <Rate v-if="list != []" allow-half disabled :value="avgScore"/>
      </div>
      <RadioGroup v-model="selectType" style="margin-left:20px" @on-change="changeRadio">
        <Radio :label="0">全部</Radio>
        <Radio :label="1">图片</Radio>
    </RadioGroup>
    </div>
    <div class="Appraises-list" >
      <table v-if="list">
        <tr class="item" v-for="item in list" :key="item.id">
          <td width="70%">
            <div class="item-content">
              <Rate allow-half disabled :value="item.score"/>
              <div class="item-text">{{item.text ? item.text : '此用户没有评价内容'}}</div>
              <div class="item-img" v-for="(gitem, i) in imgSplit(item.imgUrl)" :key="i">
                <img :src="gitem" alt="">
              </div>
              <div class="item-time">{{moment(item.createTime).format('YYYY-MM-DD')}}</div>
            </div>
          </td>
          <td>
            <div class="item-info">
              <div class="info-color">颜色分类：{{item.product_color}}</div>
              <div class="info-size">尺码：{{item.product_size}}</div>
            </div>
          </td>
          <td>
            <div class="item-user">{{item.username}}</div>
          </td>
        </tr>
      </table>
    </div>
    <Page :total="total" @on-change="changePage" class="page"/>
  </div>
</template>

<script>
export default {
  props: ['list', 'total'],
  data () {
    return {
      selectType: 0
    }
  },
  computed: {
    avgScore () {
      let sum = 0
      for (var i = 0; i < this.list.length; i++) {
        sum += this.list[i].score
      }
      var avg = (sum / this.list.length).toFixed(1)
      return Number(avg)
    }
  },
  methods: {
    imgSplit (list) {
      return list.split(';').filter(item => item !== '')
    },
    changePage (currentPage) {
      this.$emit('getPage', currentPage)
    },
    changeRadio (data) {
      this.$emit('getRadio', data)
    }
  }
}
</script>

<style scoped lang="scss">
.Appraises{
  width: 800px;
  margin: 50px auto;
  h2{
    border: 2px solid #ccc;
    padding: 5px;
  }
  &-header{
    border: 2px solid #ccc;
    border-top-width: 0;
    padding: 10px 20px;
    .header-rate{
      border-right: 2px solid #ccc;
      display: inline-block;
      strong{
        height: 35px;
        color: #f60;
        display: block;
        font-size: 32px;
      }
    }
  }
  &-list{
    padding: 10px;
    table{
      width: 100%;
      border-collapse: collapse;
    }
    .item{
      border-bottom: 2px solid #ccc;
      &-content{
        margin-right: 20px;
        .item-img{
          display: inline-flex;
          margin-top: 10px;
          width: 80px;
          height:80px;
          margin-right: 10px;
          img{
            width: 100%;
            height: 100%;
            cursor: pointer;
            &:hover{
              transform: scale(2,2);
            }
          }
        }
        .item-time{
          margin-top: 5px;
        }
      }
    }
  }
  .page{
    margin: 20px 20px 0 0;
    text-align: right;
  }
}

</style>
