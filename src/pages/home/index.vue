<template>
  <div class="home-wrapper">
    <div class="barcode-area">
      <div class="barcode-scan-btn" @click="openModal">바코드 스캔</div>
      <custom-modal @close="closeModal" v-if="isShowModal">
        <add-qr-barcode @readResult="readResult"></add-qr-barcode>
      </custom-modal>
    </div>

    <!--    <div v-if="productInfoDataLoaded" style="background-color: pink">-->
    <!--      <div v-for="product in productInfoOfBarcode">-->
    <!--        {{ product }}-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    <div v-else style="background-color: pink">로딩중</div>-->

    <!--    <div v-if="productSaleInfoDataLoaded" style="background-color: green">-->
    <!--      <div v-for="product in productSaleInfoOfBarcode">-->
    <!--        {{ product }}-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    <div v-else style="background-color: green">로딩중</div>-->
  </div>

</template>

<script>
import req2svr from './req2svr'
import customModal from '@/components/customModal'
import addQrBarcode from '@/popup/addQrBarcode'

export default {
  name: 'home',
  components: {
    addQrBarcode,
    customModal
  },
  computed: {
    req2svr: () => req2svr
  },
  data() {
    return {
      isShowModal: false,

      productInfoOfBarcode: '',
      productSaleInfoOfBarcode: '',
      productInfoDataLoaded: false,
      productSaleInfoDataLoaded: false,
      barcode: '8802039211424',
      isShowReadBarcode: false
    }
  },
  created() {
    // this.getInitData()
  },
  methods: {
    readResult(resultCode) {
      alert(resultCode)
    },
    openModal() {
      this.isShowModal = true
    },
    closeModal() {
      this.isShowModal = false
    },
    barcodeScan() {
    },
    getInitData() {
      this.getProductInfoOfBarcode()
      this.getProductSaleInfoOfBarcode()
      // this.getProductNutritionInfo()
    },
    getProductInfoOfBarcode() {
      this.productInfoDataLoaded = false
      this.req2svr.getProductInfoOfBarcode( '8802039211424' ).then( ( res ) => {
        this.productInfoOfBarcode = _.filter( res, ( res ) => {return res.BAR_CD === this.barcode} )
        this.productInfoDataLoaded = true

      } )
    },
    getProductSaleInfoOfBarcode() {
      this.productSaleInfoDataLoaded = false
      this.req2svr.getProductSaleInfoOfBarcode( '8802039211424' ).then( ( res ) => {
        this.productSaleInfoOfBarcode = res
        this.productSaleInfoDataLoaded = true
      } )
    },
    getProductNutritionInfo() {
      this.req2svr.getProductNutritionInfo( '19930443028350' ).then( ( res ) => {
        this.productSaleInfoOfBarcode = res
        this.productSaleInfoDataLoaded = true
      } )
    },
    readFinish( res ) {
      if( _.get( res.readCode ) ) {
        this.barcode = res.readCode
        this.getInitData()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.home-wrapper {
  height: 100%;
  width: 100%;

  //background-color: #42b983;
  .barcode-area {
    .barcode-title {
      display: flex;
      justify-content: center;
      align-items: center;

      margin-bottom: 30px;

      font-size: 20px;
      font-weight: bold;
    }

    .barcode-scan-btn {
      display: flex;
      justify-content: center;
      align-items: center;

      padding: 5px 10px;
      background-color: #42b983;
    }
  }

}
</style>
