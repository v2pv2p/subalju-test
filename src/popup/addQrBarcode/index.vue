<template>
  <div class="home-wrapper">
    <div class="barcode-area">
      <div class="barcode-title">제품 추가</div>
      <read-qr-barcode @codeResult="close"></read-qr-barcode>
    </div>
  </div>

</template>

<script>
import ReadQrBarcode from '@/components/readQrBarcode'

export default {
  name: 'addQrBarcode',
  components: { ReadQrBarcode },
  computed: {},
  created() {
    // this.getInitData()
  },
  methods: {
    close( readResult ) {
      this.$popupManager.close( this, readResult )
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
