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

      readCode: '',
      deviceCount: null,
    }
  },
  mounted() {
    this.getVideoInput()
  },
  beforeDestroy() {
    this.readCode = 'readCode is not available'

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
    async getVideoInput() {
      this.video = this.$refs['video']

      await navigator.mediaDevices.enumerateDevices().then( ( devices ) => {
        this.lastDevice = _.chain( devices )
          .filter( device => device.kind === 'videoinput' )
          .last()
          .value()
      } )

      const constraints = { video: { deviceId: this.lastDevice.deviceId ? { exact: this.lastDevice.deviceId } : undefined } }
      await navigator.mediaDevices.getUserMedia( constraints )
        .then( stream => {
          this.stream = stream
          this.video.srcObject = stream
          this.video.setAttribute( 'playsinline', true ) // 플레이어 파일이 아닌 스트림 화면으로 보여짐
          this.video.play() // 실행

          setTimeout( () => {
            if( !this.readCode ) this.quaggarStart()
          }, LOOP_INTERVAL )
        } )
    },
    quaggarStart() {
      this.canvas = this.$refs['canvas']
      this.context = this.canvas.getContext( '2d' )
      this.canvas.width = this.video.clientWidth
      this.canvas.height = this.video.clientHeight
      this.context.drawImage( this.video, 0, 0, this.canvas.width, this.canvas.height )
      this.img = this.canvas.toDataURL()

      if( this.video.readyState === this.video.HAVE_ENOUGH_DATA ) {
        Quagga.decodeSingle( {
          src: this.img,
          numOfWorkers: 0,  // Needs to be 0 when used within node
          inputStream: {
            size: 800  // restrict input-size to be 800px in width (long-side)
          },
          decoder: {
            readers: ['ean_reader'] // List of active readers
          },
        }, ( result ) => {
          if( _.get( result, 'codeResult' ) ) {
            this.readCode = _.get( result, 'codeResult.code' )
            this.$emit( 'codeResult', result )
          }
        } )
      }

      setTimeout( () => {
        if( !this.readCode ) this.quaggarStart()
      }, LOOP_INTERVAL )
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

