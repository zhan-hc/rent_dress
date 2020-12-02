<template>
  <div class="Order">
    <item-header>
      <p>我的订单</p>
    </item-header>
    <div class="Order-list" v-if="OrderList">
      <div class="item" v-for="item in OrderList" :key="item.id">
        <div class="item-header">
          <span>订单号：{{item.oid}}</span>
          <span>下单日期：{{formatTime(item.createTime)}}</span>
          </div>
        <div class="item-main">
          <div class="item-img"><img :src="item.product_img" alt=""></div>
          <div class="item-info">
            <div class="item-title">{{item.product_name}}</div>
            <div class="item-price">￥ {{item.product_price}} / 天</div>
            <div class="item-color-size">{{item.product_color}} / {{item.product_size}}</div>
            <div class="item-rent">租期：{{rent_time(item.startTime,item.endTime)}}天</div>
            <div class="item-start">租期区间：{{formatTime(item.startTime,1)}}----{{formatTime(item.endTime,1)}}</div>
            <div class="item-deposit">押金：{{item.product_deposit}}</div>
          </div>
          <div class="item-address">
            <p>收货地址：{{item.address}}</p>
            收件人：{{item.addressee}}<br>
            手机号：{{item.mobile}}<br>
            <span v-show="item.note">备注：{{item.note}}</span>
          </div>
        </div>
        <div class="item-footer">
          <div class="item-total">总金额: ￥{{rent_time(item.startTime,item.endTime)*item.product_price + item.product_deposit}}</div>
          <button class="item-btn" v-if="checkStatus(item.status)" @click="changeStatus(item.oid,item.status,item.oid,item.pid)">{{checkStatus(item.status)}}</button>
          <p class="item-finish"  v-if="!checkStatus(item.status)">订单已完成</p>
        </div>
      </div>
    </div>
    <item-footer></item-footer>
    <Modal v-model="modal1" :transfer="false">
      <div slot="header">评价订单</div>
      评分：<Rate allow-half v-model="score"/>
      <Form :label-width="80">
        <div class="demo-upload-list" v-for="(item ,i) in uploadList" :key="i">
          <template v-if="item.status === 'finished'">
            <img :src="item.url">
            <div class="demo-upload-list-cover">
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
          </template>
          <template v-else>
            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
          </template>
        </div>
        <Upload
          ref="upload"
          name="test"
          :show-upload-list="false"
          :on-success="handleSuccess"
          :format="['jpg','jpeg','png']"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :before-upload="handleBeforeUpload"
          multiple
          type="drag"
          action="/api/upload/img"
          style="display: inline-block;width:58px;">
          <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
          </div>
        </Upload>
        <FormItem label="评语">
          <Input v-model="formItem.text" type="textarea" placeholder="请输入评语" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="addAppraises">确认</Button>
        <Button type="text" @click="closeModal">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import ItemHeader from '@/components/header'
import ItemFooter from '@/components/footer'
export default {
  components: {
    ItemHeader,
    ItemFooter
  },
  data () {
    return {
      OrderList: [],
      modal1: false,
      uploadList: [],
      score: 5,
      pid: 0,
      oid: 0,
      formItem: {
        text: ''
      }
    }
  },
  mounted () {
    this.getOrderList()
  },
  computed: {
    userId () {
      return this.$store.state.rent_userId
    }
  },
  methods: {
    getOrderList () {
      this.$axios({
        method: 'get',
        url: `/api/order/getIdOrder/${this.userId}`
      }).then((res) => {
        if (res.data.status === 200) {
          this.OrderList = res.data.data
        }
      })
    },
    addAppraises () {
      var formData = {
        oid: this.oid,
        pid: this.pid,
        text: this.formItem.text,
        imgurl: this.getImgUrl(this.uploadList),
        createTime: this.moment().format('YYYY-MM-DD HH:mm:ss'),
        score: this.score
      }
      this.$axios({
        method: 'POST',
        url: '/api/appraises/addAppraises',
        data: formData
      }).then((res) => {
        if (res.data.status === 200) {
          this.$Message.success(res.data.msg)
          this.closeModal()
          this.getOrderList()
        } else {
          this.$Message.error(res.data.msg.rawMessage)
        }
      })
    },
    rent_time (t1, t2) {
      return this.moment(t2).diff(this.moment(t1), 'days') + 1
    },
    formatTime (val, type) {
      if (type === 1) {
        return this.moment(val).format('YYYY-MM-DD')
      }
      return this.moment(val).format('YYYY-MM-DD HH:mm:ss')
    },
    checkStatus (status) {
      if (status === 0) return '确认收货'
      else if (status === 1) return '立即评价'
      else return ''
    },
    changeStatus (id, status, oid, pid) {
      if (status === 0) {
        this.$Modal.confirm({
          title: '确认收货提示',
          content: '是否确认收货？',
          onOk: () => {
            this.$axios({
              method: 'post',
              url: '/api/order/updateOrderStatus',
              data: {
                oid: id,
                status: 1
              }
            }).then((res) => {
              if (res.data.status === 200) {
                this.$Message.success(res.data.msg)
                this.getOrderList()
              } else {
                this.$Message.error(res.data.msg.sqlMessage)
              }
            })
          }
        })
      } else {
        this.modal1 = true
        this.oid = oid
        this.pid = pid
      }
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file, fileList) {
      file.url = `/api/static${res.data}`
      this.uploadList = fileList
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 6
      if (!check) {
        this.$Notice.warning({
          title: 'Up to five pictures can be uploaded.'
        })
      }
      return check
    },
    closeModal () {
      this.modal1 = false
      this.formItem.text = ''
    },
    getImgUrl (list) {
      let uploadList = ''
      for (let val of list) {
        uploadList += val.url + ';'
      }
      return uploadList
    }
  }
}
</script>

<style scoped lang="scss">
.Order{
  min-width: 1400px;
  &-list{
    min-height: 192px;
    width: 800px;
    margin: 50px auto;
    .item{
      border: 2px solid #ccc;
      margin-top: 20px;
      &-header{
        background: #f5f5f5;
        padding: 5px 0 5px 10px;
        span{
          margin-right: 20px;
        }
      }
      &-main{
        display: flex;
        padding: 5px 10px;
         .item-img{
          width: 120px;
          height: 120px;
          margin-right: 20px;
          box-sizing: border-box;
          img{
            border-radius: 5px;
            width: 100%;
            height: 100%;
          }
        }
        .item-info{
          flex: 1;
          .item-title{
            width: 200px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .item-address{
          width: 300px;
          p{
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
      }
      &-footer{
        display: flex;
        border-top: 1px solid #ccc;
        padding: 5px 0 5px 10px;
        height: 43px;
        .item-total{
          flex: 1;
          color: red;
          font-size: 16px;
          font-weight: bold;
          line-height: 33px;
        }
        .item-btn{
          margin-right: 30px;
          border-style: none;
          width: 150px;
          color: red;
          letter-spacing: 2px;
          padding: 5px 0;
          background: #fff;
          border: 2px solid red;
          border-radius: 20px;
          cursor: pointer;
          &:focus{
            outline: none;
          }
        }
        .item-finish{
          margin-right: 20px;
          padding: 5px 0 0;
          font-weight: bold;
        }
      }
    }
  }
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
    img{
      width: 100%;
      height: 100%;
    }
    &-cover{
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,.6);
       i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
      }
    }
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
}
</style>
