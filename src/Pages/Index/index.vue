<template>
  <div class="Index">
    <index-header>
      <router-link tag="p" to="/">礼服租赁</router-link>
    </index-header>
    <router-view></router-view>
    <index-footer></index-footer>
  </div>
</template>

<script>
import IndexHeader from '@/components/header'
import IndexFooter from '@/components/footer'
import IndexContent from './components/Content'
export default {
  data () {
    return {
    }
  },
  components: {
    IndexHeader,
    IndexFooter,
    IndexContent
  }
}
</script>

<style scoped lang="scss">
.Index{
  min-width: 1400px;
}
</style>
