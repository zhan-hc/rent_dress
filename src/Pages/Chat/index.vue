<template>
  <div class="chat" v-show="chatStatus">
  <div class="chat-title">客服聊天</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chatStatus: false
    }
  },
  components: {
  }
}
</script>

<style scoped lang="scss">
.chat{
  top: 30%;
  width: 80%;
  left: 50%;
  opacity: 1;
  position: fixed;
  margin-left: -40%;
  font-size: 14px;
  text-align: center;
  font-family: 'Microsoft Yahei';
  background: #FFFFFF;
  border-radius: 8px;
  z-index: 999999999;
  box-sizing: content-box;
}
</style>
