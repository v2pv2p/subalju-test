<template>
  <div class="popup-wrapper">
    <div class="add-qr-barcode">
      <div class="close-btn" @click.self="closePopup">
        <m-icon>close</m-icon>
      </div>
      <div class="barcode-area">
        <read-qr-barcode @codeResult="setCodeResult"></read-qr-barcode>
      </div>
    </div>
  </div>
</template>

<script>
import ReadQrBarcode from '@/components/readQrBarcode'

export default {
  name: 'addQrBarcode',
  components: { ReadQrBarcode },
  data() {
    return {
      barcode: ''
    }
  },
  methods: {
    setCodeResult( codeResult ) {
      this.barcode = _.get( codeResult, 'codeResult.code' )
      this.closePopup()
    },
    closePopup() {
      this.$popupManager.close( this, this.barcode )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.add-qr-barcode {
  height: 100%;
  width: 100%;

  overflow: hidden;

  background-color: #000000;

  .close-btn {
    display: inline-block;
    padding: 20px;
    background-color: gold;
    border-radius: 10px;
  }
}


</style>
