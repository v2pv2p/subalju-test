import axios from 'axios'

export default {
  getProductInfoOfBarcode( barcodeNum ) {
    return axios.get( 'http://openapi.foodsafetykorea.go.kr/api/sample/C005/json/1/5' + (barcodeNum ? '/BAR_CD=' + barcodeNum : '') ).then( x => {
      return x['data']['C005']['row']
    } )
  },
  getProductSaleInfoOfBarcode( barcodeNum ) {
    return axios.get( 'http://openapi.foodsafetykorea.go.kr/api/sample/I2570/json/1/5' + (barcodeNum ? '/BRCD_NO=' + barcodeNum : '') ).then( x => {
      return x['data']['I2570']['row']
    } )
  },
  getProductNutritionInfo( productName ) {
    return axios.get( 'http://openapi.foodsafetykorea.go.kr/api/sample/I2790/json/1/5/DESC_KOR=' + productName ).then( x => {
      return x['data']['I2790']['row']
    } )
  },
}
