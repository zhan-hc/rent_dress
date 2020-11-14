<template>
  <div class="Index">
    <index-header></index-header>
    <div class="Index-content">
      <category></category>
      <flow></flow>
    </div>
  </div>
</template>

<script>
import IndexHeader from '@/components/header.vue'
import Category from './components/Category'
import Flow from './components/Flow'
export default {
  data () {
    return {
    }
  },
  components: {
    IndexHeader,
    Category,
    Flow
  }
}
</script>

<style scoped lang="scss">
.Index{
  min-width: 1400px;
  &-content{
    width: 1200px;
    margin: 40px auto;
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
  }
}
</style>
