<template>
  <div class="home-wrapper">
    <div class="barcode-area">
      <div class="barcode-title">제품 추가</div>
      <div class="barcode-scan-btn" @click="barcodeScan">바코드 스캔</div>
    </div>
    {{ barcode }}
    <div class="product-info-area" v-if="productInfoDataLoaded">
      <div v-for="product in productInfoOfBarcode">
        {{ product }}
      </div>
    </div>

    <div class="product-nutrition-info-area" v-if="nutritionInfoDataLoaded">
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
      productInfoDataLoaded: false,
      nutritionInfoOfProductName: '',
      nutritionInfoDataLoaded: false,

      barcode: '',
    }
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
      await this.getProductNutritionInfo()
    },
    async getProductInfoOfBarcode() {
      this.productInfoDataLoaded = false
      await this.req2svr.getProductInfoOfBarcode( this.barcode ).then( ( res ) => {
        this.productInfoOfBarcode = _.filter( res, ( res ) => {return res.BAR_CD === this.barcode} )// 이건 다시 확인
        this.productInfoDataLoaded = true
      } )
    },
    async getProductNutritionInfo() {
      this.nutritionInfoDataLoaded = false
      let productName = _.get( this.productInfoOfBarcode, '0.PRDLST_NM' )
      if( productName ) {
        await this.req2svr.getProductNutritionInfo( productName ).then( ( res ) => {
          this.nutritionInfoOfProductName = res
          this.nutritionInfoDataLoaded = true
        } )
      }
    },
  }
}
</script>

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

  .product-info-area {
    background-color: green;
  }

  .product-nutrition-info-area {
    background-color: pink;
  }
}
</style>
