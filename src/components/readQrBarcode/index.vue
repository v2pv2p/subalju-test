<template>
  <video id="video" width="640" height="480" autoplay></video>
</template>

<script>
import _ from 'lodash'
import { StreamBarcodeReader } from 'vue-barcode-reader'

export default {
  name: 'readQrBarcode',
  components: {
    StreamBarcodeReader,
  },
  data() {
    return {}
  },
  mounted() {
    console.log( window.BarcodeDetector )
    if( !('BarcodeDetector' in window) ) {
      console.log( 'Barcode Detector is not supported by this browser.' )
    } else {
      console.log( 'Barcode Detector supported!' )

      // create new detector
      let barcodeDetector = new BarcodeDetector( { formats: ['code_39', 'codabar', 'ean_13'] } )
    }
  },
  beforeDestroy() {
  },
  methods: {
    detectCode() {

    }
  }
}
</script>

<style lang="scss" scoped>
.read-qr-wrapper {
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: #808080;

  .video-area {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
  }

  .cover-area {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 1;

    display: grid;
    grid-template-areas: 'top top top' 'left center right' 'bottom bottom bottom ';
    grid-template-columns: minmax(0, 1fr) 260px minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) 260px minmax(0, 1fr);
    height: 100%;

    .center {
      position: relative;
      grid-area: center;

      .edge-top-left {
        position: absolute;

        top: -10px;
        left: -10px;
        width: 20px;
        height: 20px;

        border-top: 6px solid white;
        border-left: 6px solid white;
      }

      .edge-top-right {
        position: absolute;

        top: -10px;
        right: -10px;
        width: 20px;
        height: 20px;

        border-top: 6px solid white;
        border-right: 6px solid white;
      }

      .edge-bottom-left {
        position: absolute;

        bottom: -10px;
        left: -10px;
        width: 20px;
        height: 20px;

        border-bottom: 6px solid white;
        border-left: 6px solid white;
      }

      .edge-bottom-right {
        position: absolute;

        bottom: -10px;
        right: -10px;
        width: 20px;
        height: 20px;

        border-bottom: 6px solid white;
        border-right: 6px solid white;
      }

      &::after {
        content: '';
        position: absolute;
        background-color: #ff0000;
        height: 2px;
        left: -20px;
        right: -20px;
        top: calc(50% - 1px);
      }
    }

    .around {
      background-color: rgba(0, 0, 0, 0.5);
    }

    .top {
      grid-area: top;
      display: flex;
      flex-direction: column;

      .close-button {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        padding: 40px 30px 0 0;

        > .v-icon {
          font-size: 30px;
          color: #ffffff;
        }
      }

      .info-text {
        padding-bottom: 55px;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        font-size: 14px;
        font-weight: normal;
        color: #ffffff;
      }
    }

    .bottom {
      grid-area: bottom;
    }

    .left {
      grid-area: left;
    }

    .right {
      grid-area: right;
    }
  }
}
</style>

