<template>
  <div class="Item">
    <item-header></item-header>
    <div class="Item-content">
      <div class="content-img">
        <img :src="ItemList.product_img" alt="">
      </div>
      <div class="content-info">
        <div class="info-title">{{ItemList.product_name}}</div>
        <div class="info-price">
          价格：
          <span>￥{{ItemList.product_price}}/天</span>
        </div>
        <ul class="info-appraise">
          <li>月销量：<span>{{ItemList.product_sales}}</span></li>
          <li>累计评价：<span>{{AppraisesList.length}}</span></li>
        </ul>
        <div class="info-color">
          颜色：
          <RadioGroup type="button" v-if="ItemList" v-model="color" class="color" @on-change="colorChange">
            <Radio :label="key" v-for="(item, key, i) in ItemList.product_color" :key="i" class="rad"></Radio>
          </RadioGroup>
        </div>
        <div class="info-size">
          尺码：
          <RadioGroup type="button" v-if="color" v-model="size" class="size">
            <Radio :label="item.size" v-for="(item, i) in ItemList.product_color[color]" :key="i" class="rad"></Radio>
          </RadioGroup>
        </div>
        <div class="info-num">
          数量：
          <InputNumber :max="100" :min="1" v-model="num" style="width:40px"></InputNumber>
          <div class="operate">
            <Icon type="ios-arrow-up" class="icon" @click="operate(1)"/>
            <Icon type="ios-arrow-down" class="icon"  @click="operate(2)"/>
          </div>
        </div>
        <div class="info-stock" v-if="Info[this.color]">
          库存：
          {{ItemStock['stock']}}
          件
        </div>
        <button class="add-order" @click="rentDress">立即租赁</button>
        <button class="add-car">
          加入购物车
        </button>
      </div>
    </div>
    <appraises v-if="type" :list="AppraisesList" :total="Listtotal" @getPage="changePage" @getRadio="changeRadio"></appraises>
    <item-footer></item-footer>
    <Modal v-model="modal1">
      <div slot="header">预约订单</div>
      <Form :label-width="80"  :model="formItem" ref="formValidate" :rules="ruleValidate">
        <FormItem label="地址">
          <v-distpicker
          :province="select.province"
          :city="select.city"
          :area="select.area"
          @province="onChangeProvince"
          @city="onChangeCity"
          @area="onSelectArea"
          ></v-distpicker>
        </FormItem>
        <FormItem label="详细地址" prop="detail">
          <Input v-model="formItem.detail" placeholder="请输入详细地址" clearable style="width: 350px" />
        </FormItem>
        <FormItem label="收件人" prop="addressee">
          <Input v-model="formItem.addressee" placeholder="请输入收件人昵称" clearable style="width: 200px" />
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input v-model="formItem.mobile" placeholder="请输入收件人电话" clearable style="width: 200px" />
        </FormItem>
        <FormItem label="租期" prop="dateTime">
          <DatePicker type="daterange" v-model="formItem.dateTime" placeholder="Select date" style="width: 200px" @on-change="handlechange"></DatePicker>
        </FormItem>
      </Form>
      <div style="background:#f5f5f5;padding:10px; display:flex;margin:10px 0;">
        <div style="width: 100px;height: 100px;">
          <img :src="ItemList.product_img" alt="" style="width: 100%;height: 100%;">
        </div>
        <div class="content" style="flex:1;margin-left:20px">
          <div class="title">{{ItemList.product_name}}</div>
          <div class="color">颜色：{{color}}</div>
          <div class="size">尺码：{{size}}</div>
          <div class=num>数量：{{num}}</div>
        </div>
      </div>
      <p>日租金：￥{{ItemList.product_price}}</p>
      <p>租期：{{time}}天</p>
      <p style="color:red;font-size:18px;border-bottom:1px solid #ccc;padding:0 0 10px;">总租金：￥{{ItemList.product_price*time}}</p>
      <p style="margin:10px 0;">总费用(押金+租金)：￥{{total}}</p>
      <Input v-model="formItem.note" type="textarea" placeholder="备注" />
      <Radio v-model="radio" style="margin:20px 0 0;">我已阅读并同意<span style="color:red">《礼服租赁协议》</span></Radio>
      <div slot="footer">
        <Button type="primary" @click="validate">确认</Button>
        <Button type="text" @click="closeModal">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import ItemHeader from '@/components/header'
import ItemFooter from '@/components/footer'
import Appraises from '@/Pages/Appraises'
export default {
  components: {
    ItemHeader,
    ItemFooter,
    Appraises
  },
  data () {
    return {
      pid: null,
      ItemList: {},
      Info: {},
      color: '',
      num: 1,
      size: '',
      time: null,
      Listtotal: 0,
      modal1: false,
      radio: false,
      AppraisesList: [],
      type: false,
      imgStatus: null,
      pageNo: 1,
      pageSize: 10,
      select: { province: '', city: '', area: '' },
      formItem: {
        addressee: '',
        mobile: '',
        detail: '',
        dateTime: [],
        note: ''
      },
      ruleValidate: {
        detail: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
        ],
        addressee: [
          { required: true, message: '收件人姓名不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: this.validatePhone, trigger: 'blur' }
        ],
        dateTime: [
          {
            type: 'array',
            required: true,
            fields:
              {
                0: {type: 'date', required: true, message: '请输入有效期', trigger: 'blur'},
                1: {type: 'date', required: true, message: '请输入有效期', trigger: 'blur'}
              }
          }
        ]
      }
    }
  },
  mounted () {
    this.pid = this.$route.params.pid
    this.getItemList()
    this.getAppraisesList()
  },
  computed: {
    ItemColor () { // 第一个颜色
      for (let key in this.ItemList['product_color']) {
        return key
      }
    },
    ItemStock () { // 当前尺寸对象(id,size,stock)
      return this.Info[this.color].filter((item) => {
        return item.size === this.size
      })[0]
    },
    area () { // 租金
      return this.select.province + this.select.city + this.select.area + this.formItem.detail
    },
    total () { // 总金额
      return this.ItemList.product_price * this.time + this.ItemList.product_deposit
    },
    userId () {
      return this.$store.state.rent_userId
    }
  },
  methods: {
    // 手机号校验
    validatePhone (rule, value, callback) {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else if (!/^1[34578]\d{9}$/.test(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    },
    validate () { // 校验
      this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          if (this.select.province === '' || this.select.city === '' || this.select.area === '') {
            this.$Message.error('省市区不能为空')
            return
          }
          if (this.radio === false) {
            this.$Message.error('请勾选同意礼服租赁协议')
            return false
          }
          this.addOrder()
        }
      })
    },
    addOrder () {
      var formData = {
        pid: this.pid,
        sid: this.ItemStock['id'],
        uid: this.userId,
        address: this.area,
        startTime: this.moment(this.formItem.dateTime[0]).format('YYYY-MM-DD'),
        endTime: this.moment(this.formItem.dateTime[1]).format('YYYY-MM-DD'),
        createTime: this.moment().format('YYYY-MM-DD HH:mm:ss'),
        note: this.formItem.note,
        addressee: this.formItem.addressee,
        mobile: this.formItem.mobile,
        product_sales: this.ItemList.product_sales + this.num
      }
      this.$axios({
        method: 'POST',
        url: '/api/order/addOrder',
        data: formData
      }).then((res) => {
        if (res.data.status === 200) {
          this.$Message.success(res.data.msg)
          this.closeModal()
          this.getItemList()
        } else {
          this.$Message.error(res.data.msg.rawMessage)
        }
      })
    },
    getAppraisesList () {
      this.$axios({
        method: 'get',
        url: '/api/appraises/getPidAppraises',
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          pid: this.pid,
          img: this.imgStatus
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.AppraisesList = res.data.data
          this.Listtotal = res.data.total
          this.type = true
        }
      })
    },
    changePage (current) {
      this.pageNo = current
      this.getAppraisesList()
    },
    changeRadio (val) {
      if (val === 0) this.imgStatus = null
      else this.imgStatus = val
      this.getAppraisesList()
    },
    getItemList () {
      this.$axios({
        method: 'get',
        url: '/api/product/info/getPidInfo',
        params: {
          pid: this.pid
        }
      }).then((res) => {
        if (res.data.status === 200) {
          this.ItemList = res.data.data
          this.color = this.ItemColor
          this.Info = this.ItemList.product_color
          this.size = this.ItemList.product_color[this.color][0].size
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    rentDress () {
      if (this.$store.state.rent_userId === '') {
        // this.$Message.error( '请先登录账号')
        alert('请先登录账号')
        this.$router.push('/LogReg')
      } else {
        this.modal1 = true
      }
    },
    operate (type) {
      if (type === 1) this.num += 1
      else this.num = this.num === 1 ? 1 : this.num - 1
    },
    colorChange () {
      this.size = this.ItemList.product_color[this.color][0].size
    },
    closeModal () {
      this.modal1 = false
      // this.color = ''
      this.$refs['formValidate'].resetFields()
    },
    handlechange (data) {
      this.time = this.moment(data[1]).diff(this.moment(data[0]), 'days') + 1
    },
    onChangeProvince (data) {
      this.select.province = data.value
    },
    onChangeCity (data) {
      this.select.city = data.value
    },
    onSelectArea (data) {
      this.select.area = data.value
    }
  }
}
</script>

<style scoped lang="scss">
.Item{
  min-width: 1400px;
  &-content{
    margin: 50px auto;
    width: 1000px;
    text-align: center;
    .content-img{
      display: inline-block;
      width: 300px;
      height: 415px;
      border-left: 1px solid #ccc;
      padding-left: 20px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .content-info{
      display: inline-block;
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
      margin-left: 20px;
      padding: 0 20px;
      width: 500px;
      vertical-align: top;
      font-weight: bold;
      color: #696969;
      font-size: 18px;
      text-align: left;
      .info-title{
        margin-top: 10px;
        font-weight: bold;
        font-size: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .info-price{
        margin-top: 10px;
        font-size: 18px;
        span{
          font-size: 24px;
          color: #fd3f31;
        }
      }
      .info-appraise{
        display: flex;
        font-size: 16px;
        margin-top: 10px;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        padding: 5px 0;
        list-style: none;
        li{
          flex: 1;
          text-align: center;
        }
        // font-size: 18px;
        span{
          // font-size: 24px;
          color: #fd3f31;
        }
      }
      .info-color{
        margin-top: 10px;
      }
      .info-size{
        margin: 20px 0;
      }
      .info-num{
        margin-bottom: 10px;
        padding-bottom: 10px;
        .operate{
          display: inline-block;
          height: 40px;
          width: 20px;
          vertical-align: bottom;
          .ivu-icon-ios-arrow-up{
            margin:5px 0 5px;
          }
          .icon{
            display: block;
            border: 1px solid #ccc;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
          }
        }
      }
      .info-stock{
        margin: 0 0 20px;
      }
      .rad{
        margin: 0 20px 0 0;
      }
      .add-order{
        padding: 5px 0;
        width: 178px;
        height: 38px;
        background-color: #ffeded;
        border: 1px solid #FF0036;
        color: #FF0036;
        cursor: pointer;
        &:focus{
          outline: 0;
        }
      }
      .add-car{
        background: #ff0036;
        border-style: none;
        padding: 5px 0;
        width: 178px;
        height: 38px;
        color: #fff;
        font-weight: bold;
        cursor: pointer;
        &:focus{
          outline: 0;
        }
      }
    }
  }

}
</style>
