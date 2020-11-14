<template>
  <div class="flow">
    <div class="flow-title">租赁流程</div>
    <ul class="flow-content">
      <li v-for="(item, index) in flowList" :key="index" :class="item.style">
        <div class="text">
          {{item.title}}<p>{{item.text1}}<br>{{item.text2}}</p>
        </div>
        <span class="iconfont icon-tongxinyuan"></span>
        <span class="line"></span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      flowList: [
        {
          title: '网上预约',
          text1: '留下个人信息',
          text2: '预约到店时间',
          style: 'yellow'
        },
        {
          title: '到店选款',
          text1: '确认款式，核实信息',
          text2: '签署合同，缴纳定金',
          style: 'green'
        },
        {
          title: ' 取衣',
          text1: '出示有效证件',
          text2: '并缴纳押金',
          style: 'pink'
        },
        {
          title: '使用',
          text1: '三天起租',
          text2: '保存凭证',
          style: 'deepyellow'
        },
        {
          title: '归还',
          text1: '自行送回或顺丰寄回',
          text2: '清点服装，退还押金',
          style: 'oranage'
        }
      ]
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.flow{
  margin-bottom: 50px;
  &-title{
    margin: 50px 0;
    text-align: center;
    font-size: 36px;
  }
  &-content{
    padding: 0;
    &::after{
      content: "";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }
    li{
      list-style: none;
      float: left;
      .text{
        width: 225px;
        box-sizing: border-box;
        display: block;
        border-left: 4px solid #ccc;
        padding: 10px 0 0 20px;
        margin-left: 10px;
        p{
          color: #000;
        }
      }
      .icon-tongxinyuan{
        z-index: 10;
        // color: green;
        font-size: 26px;
        background-color: #fff;
      }
      .line{
        display: block;
        margin-top: -15px;
        z-index: 1;
        width: 225px;
        border-top: 4px solid #ccc;
      }
    }
    .green{
      color: #2a8b7a;
    }
    .oranage{
      color: #FFA500;
    }
    .yellow{
      color: #fac65d;
    }
    .deepyellow{
      color:#cfa972;;
    }
    .pink{
      color: #ec6b65;
    }
  }
}
</style>
