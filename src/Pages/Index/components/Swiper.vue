<template>
  <div class="swiper-wrapper">
    <div class="swiper-container" v-if="newList&&newList.length">
      <swiper ref="mySwiper" :options="swiperOptions" v-if="swiperOptions">
        <swiper-slide v-for="(item, i) in newList" :key="i">
          <router-link tag="img" :to="`Product/item/${item.pid}`" :src="item.product_img" alt="" />
        </swiper-slide>
      </swiper>
      <div class="swiper-button-prev swiper-button-black" @click="prev"></div>
      <div class="swiper-button-next swiper-button-black" @click="next"></div>
    </div>
    <category v-else></category>
  </div>
</template>

<script>
import Category from './Category'
export default {
  components: {
    Category
  },
  data () {
    return {
      swiperOptions: {
        loop: true,
        slidesPerView: 3,
        centeredSlides: true,
        loopAdditionalSlides: 1,
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        // 设置点击箭头
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      newList: []
    }
  },
  mounted () {
    this.getNewProduct()
  },
  methods: {
    getNewProduct () {
      this.$axios({
        method: 'get',
        url: `product/info/getNewProduct`
      }).then((res) => {
        if (res.data.status === 200) {
          this.newList = res.data.data
        } else {
          this.newList = null
        }
      })
    },
    handleClick () {
      window.location.href = 'Product/item/10001'
    },
    prev () {
      this.$refs.mySwiper.$swiper.slidePrev()
    },
    next () {
      this.$refs.mySwiper.$swiper.slideNext()
    }
  }
}
</script>

<style scoped lang="scss">
.swiper-wrapper{
  height: 500px;
  // width: 750px;
  margin-bottom: 50px;
  .swiper-container{
    .swiper-slide-active{
      img{
        transform: scale(1);
      }
    }
    .swiper-slide-next,.swiper-slide-prev{
      img{
        transform: scale(0.8);
      }
    }
    .swiper-slide{
      img{
        width: 400px;
        height: 500px;
        cursor: pointer;
      }
    }
  }
}

</style>
