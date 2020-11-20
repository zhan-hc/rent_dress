<template>
  <div class="Index-content">
    <category></category>
    <flow></flow>
    <img src="http://www.sunvary.com.cn/upload/2017/03/29/149079616210853a553.jpg" alt="">
    <rule></rule>
  </div>
</template>

<script>
import Category from '../components/Category'
import Flow from '../components/Flow'
import Rule from '../components/Rule'
export default {
  data () {
    return {

    }
  },
  components: {
    Category,
    Flow,
    Rule
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
