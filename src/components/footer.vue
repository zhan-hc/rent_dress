<template>
  <div class="footer">
    <div class="footer-rent">
      <ul v-for="item in rentList" :key="item.id">
        <p>{{item.title}}</p>
        <li v-for="(li, index) in item.list" :key="index">{{li}}</li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      rentList: [
        {
          id: 1001,
          title: '婚纱',
          list: ['2020新款', '2020春季新款']
        },
        {
          id: 1002,
          title: '婚礼礼服',
          list: ['伴娘服', '敬酒礼服', '妈妈装', '花童礼服']
        },
        {
          id: 1003,
          title: '晚礼服',
          list: ['晚礼服', '酒会礼服', '鸡尾酒礼服', '亲子礼服', '毕业礼服', '小黑裙']
        },
        {
          id: 1004,
          title: '配饰',
          list: ['手套', '头纱']
        },
        {
          id: 1005,
          title: '品牌店',
          list: ['旗舰店展示']
        },
        {
          id: 1006,
          title: '预约服务',
          list: ['进店试纱', '上门量体']
        }
      ]
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.footer{
  // position: absolute;
  // bottom: 0;
  // left: 0;
  // right: 0;
  background-color: #1c1c1c;
  color: #fff;
  &-rent{
    width: 1200px;
    margin: 50px auto 0;
    padding: 50px 0;
    list-style: none;
    display: flex;
    ul{
      flex: 1;
      list-style: none;
    }
    p{
      font-weight: bold;
      font-size: 20px;
    }
  }
}
</style>
