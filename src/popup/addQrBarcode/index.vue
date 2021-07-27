<template>
  <div class="add-qr-barcode">
    <div @click="closePopup">close</div>
    <div class="barcode-area">
      <read-qr-barcode @codeResult="setCodeResult"></read-qr-barcode>
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

  background-color: goldenrod;

  & /deep/ .fpm--modal {
    height: 100%;
  }

  & > > > .fpm--modal {
    height: 100%;
  }

  & /deep/ .fpm--modal-overlay {
    height: 100%;
  }

  & > > > .fpm--modal-overlay {
    height: 100%;
  }
}


</style>
