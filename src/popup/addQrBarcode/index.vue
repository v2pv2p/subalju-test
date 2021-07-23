<template>
  <div class="add-qr-barcode">
    <div class="barcode-area">
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
      this.$emit('readResult', readResult)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.add-qr-barcode {
  height: 100%;
  width: 100%;

  background-color: goldenrod;
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
