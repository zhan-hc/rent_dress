<template>
  <div class="Index-content">
    <swiper></swiper>
    <flow></flow>
    <img src="http://www.sunvary.com.cn/upload/2017/03/29/149079616210853a553.jpg" alt="">
    <rule></rule>
  </div>
</template>

<script>
import Flow from '../components/Flow'
import Rule from '../components/Rule'
import Swiper from '../components/Swiper'
export default {
  data () {
    return {

    }
  },
  components: {
    Flow,
    Rule,
    Swiper
  }
}
</script>

<style scoped lang="scss">
.Index-content{
    width: 1200px;
    margin: 40px auto;
    img{
      width: 1200px;
    }
  }
</style>
