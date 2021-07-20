import axios from 'axios'

export default {
  getProductInfoOfBarcode( barcodeNum ) {
    return axios.get( 'https://openapi.foodsafetykorea.go.kr/api/sample/C005/json/1/5' + ( barcodeNum ? '/BAR_CD=' + barcodeNum : '' ) ).then( x => {
      console.log( x )
      return x['data']['C005']['row']
    } )
  },
  getProductSaleInfoOfBarcode( barcodeNum ) {
    return axios.get( 'https://openapi.foodsafetykorea.go.kr/api/sample/I2570/json/1/5' + ( barcodeNum ? '/BRCD_NO=' + barcodeNum : '' ) ).then( x => {
      console.log( x )
      return x['data']['I2570']['row']
    } )
  },
  getProductNutritionInfo( barcodeNum ) {
    return axios.get( 'https://openapi.foodsafetykorea.go.kr/api/sample/I2790/json/1/5/DESC_KOR=면사랑 구수한').then( x => {
      console.log( x )
      return x
    } )
  },
}
