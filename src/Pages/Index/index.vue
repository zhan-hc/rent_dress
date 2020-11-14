<template>
  <div class="Index">
    <index-header></index-header>
    <div class="Index-content">
      <category></category>
      <flow></flow>
      <img src="http://www.sunvary.com.cn/upload/2017/03/29/149079616210853a553.jpg" alt="">
      <rule></rule>
    </div>
    <index-footer></index-footer>
  </div>
</template>

<script>
import IndexHeader from '@/components/header'
import Category from './components/Category'
import Flow from './components/Flow'
import Rule from './components/Rule'
import IndexFooter from '@//components/footer'
export default {
  data () {
    return {
    }
  },
  components: {
    IndexHeader,
    IndexFooter,
    Category,
    Flow,
    Rule
  }
}
</script>

<style scoped lang="scss">
.Index{
  min-width: 1400px;
  &-content{
    width: 1200px;
    margin: 40px auto;
    img{
      width: 1200px;
    }
  }
}
</style>
