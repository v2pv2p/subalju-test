<template>
  <div class="home-wrapper">
    <div class="barcode-area">
      <div class="barcode-title">제품 추가</div>
      <div class="barcode-scan-btn" @click="barcodeScan">바코드 스캔</div>
    </div>
    {{ barcode }}
    <div v-if="productInfoDataLoaded" style="background-color: pink">
      <div v-for="product in productInfoOfBarcode">
        {{ product }}
      </div>
    </div>

    <div v-if="productSaleInfoDataLoaded" style="background-color: green">
      <div v-for="product in productSaleInfoOfBarcode">
        {{ product }}
      </div>
    </div>
    <div v-if="nutritionInfoDataLoaded" style="background-color: yellow">
      <div v-for="nutrition in nutritionInfoOfProductName">
        {{ nutrition }}
      </div>
    </div>
  </div>

</template>

<script>
import req2svr from './req2svr'
import addQrBarcode from '@/popup/addQrBarcode'

export default {
  name: 'home',
  computed: {
    req2svr: () => req2svr
  },
  data() {
    return {
      productInfoOfBarcode: '',
      productSaleInfoOfBarcode: '',
      nutritionInfoOfProductName: '',
      nutritionInfoDataLoaded: false,
      productInfoDataLoaded: false,
      productSaleInfoDataLoaded: false,

      barcode: '',
    }
  },
  created() {
    // this.getInitData()
  },
  methods: {
    barcodeScan() {
      this.$popupManager.open( addQrBarcode ).promise.then( res => {
        this.barcode = res
        this.getProductData()
      } )
    },
    async getProductData() {
      await this.getProductInfoOfBarcode()
      await this.getProductSaleInfoOfBarcode()
      await this.getProductNutritionInfo()
    },
    async getProductInfoOfBarcode() {
      this.productInfoDataLoaded = false
      await this.req2svr.getProductInfoOfBarcode( this.barcode ).then( ( res ) => {
        this.productInfoOfBarcode = _.filter( res, ( res ) => {return res.BAR_CD === this.barcode} )
        this.productInfoDataLoaded = true

      } )
    },
    async getProductSaleInfoOfBarcode() {
      this.productSaleInfoDataLoaded = false
      await this.req2svr.getProductSaleInfoOfBarcode( this.barcode ).then( ( res ) => {
        this.productSaleInfoOfBarcode = res
        this.productSaleInfoDataLoaded = true
      } )
    },
    async getProductNutritionInfo() {
      this.nutritionInfoDataLoaded = false
      await this.req2svr.getProductNutritionInfo( this.productInfoOfBarcode[0].PRDLST_NM ).then( ( res ) => {
        this.nutritionInfoOfProductName = res
        this.nutritionInfoDataLoaded = true
      } )
    },
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
