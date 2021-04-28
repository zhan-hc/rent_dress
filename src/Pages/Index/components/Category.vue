<template>
  <div class="list">
    <div class="item" v-for="item in imgList" :key="item.id">
      <img :src="item.imgUrl" alt="礼服图片">
      <p>{{item.text}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgList: [
        {
          id: 1001,
          imgUrl: require('@/assets/image/content_1.jpg'),
          text: '婚礼西服'
        },
        {
          id: 1002,
          imgUrl: require('@/assets/image/content_2.jpg'),
          text: '面试西服'
        },
        {
          id: 1003,
          imgUrl: require('@/assets/image/content_3.jpg'),
          text: '婚宴会礼服'
        },
        {
          id: 1004,
          imgUrl: require('@/assets/image/content_4.jpg'),
          text: '商务西装'
        },
        {
          id: 1005,
          imgUrl: require('@/assets/image/content_4.jpg'),
          text: '商务西装'
        }
      ]
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.list{
  .item{
    position: relative;
    display: inline-block;
    width: 300px;
    height: 400px;
    box-sizing: border-box;
    p{
      position: absolute;
      top: 45%;
      left: 50%;
      color: #fff;
      font-size: 28px;
      font-weight: bold;
      transform: translate(-45%,-50%);
    }
  }
}
</style>
