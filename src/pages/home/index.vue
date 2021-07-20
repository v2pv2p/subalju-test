<template>
  <div class="cm-wrapper">
    <div>바코드</div>
    <read-qr-barcode @readFinish="readFinish" style="width: 500px; height: 500px;"></read-qr-barcode>

    <div>인원선택</div>
    <div v-if="productInfoDataLoaded" style="background-color: pink">
      <div v-for="product in productInfoOfBarcode">
        {{ product }}
      </div>
    </div>
    <div v-else style="background-color: pink">로딩중</div>

    <div v-if="productSaleInfoDataLoaded" style="background-color: green">
      <div v-for="product in productSaleInfoOfBarcode">
        {{ product }}
      </div>
    </div>
    <div v-else style="background-color: green">로딩중</div>
  </div>

</template>

<script>
import req2svr from './req2svr'
import ReadQrBarcode from '@/components/readQrBarcode'

export default {
  name: 'home',
  components: { ReadQrBarcode },
  computed: {
    req2svr: () => req2svr
  },
  data() {
    return {
      productInfoOfBarcode: '',
      productSaleInfoOfBarcode: '',
      productInfoDataLoaded: false,
      productSaleInfoDataLoaded: false,
      barcode: '8802039211424',
    }
  },
  created() {
    // this.getInitData()
  },
  methods: {
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
.cm-wrapper {
  height: 100%;
  width: 100%;

  //background-color: #42b983;

  .canvas {
    border: 1px solid #000000;
  }
}
</style>
