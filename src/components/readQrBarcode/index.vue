<template>
  <div class="read-qr-barcode">
    <div class="stream-area">
      <video class="video" ref="video" autoPlay></video>
      <canvas class="canvas" ref="canvas"></canvas>
      <img class="image" ref='canvasImgFile' :src="img">
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import Quagga from '@ericblade/quagga2'
import { BrowserMultiFormatReader } from '@zxing/library'

const LOOP_INTERVAL = 20

export default {
  name: 'readQrBarcode',
  data() {
    return {
      video: null,
      stream: null,
      canvas: null,
      context: null,
      img: null,

      selectedDeviceId: null,

      readCode: ''
    }
  },
  mounted() {
    this.video = this.$refs['video']

    navigator.mediaDevices.getUserMedia( { video: { facingMode: 'environment' } } )
      .then( stream => {
        this.stream = stream

        this.video.srcObject = stream
        this.video.setAttribute( 'playsinline', true ) // required to tell iOS safari we don't want fullscreen
        this.video.play()

        this.reader = new BrowserMultiFormatReader()

        setTimeout( () => this.readLoop(), LOOP_INTERVAL )
      } )
      .catch( err => {
        // this.$alertManager.alert( '알림', '카메라를 사용할 수 없습니다.' ).promise.then( this.closeDialog )
      } )
  },
  beforeDestroy() {
    if( this.reader ) {
      this.reader.reset()
      this.reader = null
    }

    if( this.video ) {
      this.video.pause()
      this.video = null
    }

    if( this.stream ) {
      this.stream.getTracks().forEach( track => {
        track.stop()
      } )
      this.stream = null
    }
  },
  methods: {
    readLoop() {
      if( !this.video ) {
        return
      }

      try {
        if( this.video.readyState === this.video.HAVE_ENOUGH_DATA ) {
          const result = this.reader.decode( this.video )
          if( result ) {
            this.$emit( 'codeResult', result )
            return //읽었으면 종료
          }
        }
      } catch( error ) {
        console.error( 'QR/Barcode reading error', error )
      }

      setTimeout( () => this.readLoop(), LOOP_INTERVAL )
    },
    closeDialog( params ) {
      this.$popupManager.close( this, params )
    }
  }
}
</script>

<style lang="scss" scoped>
.read-qr-barcode {
  position: relative;

  width: 100%;
  height: 100%;

  overflow: hidden;

  .device-select-area {
    top: 0;

    .device-select-title {
    }

    .device-select {

    }
  }

  .stream-area {
    width: 100%;
    height: 100%;

    .video {
      position: absolute;
      z-index: 999999;
      height: 100%;
    }

    .canvas {
      display: none;
    }

    .image {
      display: none;
    }
  }

}
</style>

