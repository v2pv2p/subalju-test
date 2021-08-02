<template>
  <div class="read-qr-barcode">
    <div class="stream-area" @click="changeVideoInput">
      <video class="video" ref="video" autoPlay></video>
      <canvas class="canvas" ref="canvas" v-show="false"></canvas>
      <img class="image" ref='canvasImgFile' :src="img" v-show="false">
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
      videoSource: null,

      devices: null,
      selectedDeviceId: null,

      readCode: ''
    }
  },
  mounted() {
    this.video = this.$refs['video']
    this.videoSource = this.video.value
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
    changeVideoInput() {
      this.videoSource = this.selectedDeviceId
      this.getVideoInput()
    },
    getVideoInput() {
      const constraints = { video: { deviceId: this.videoSource ? { exact: this.videoSource } : undefined } }

      navigator.mediaDevices.getUserMedia( constraints )
        .then( this.gotStream )
        .then( ( deviceInfos ) => {
          this.gotDevices( deviceInfos )
          setTimeout( () => {
            if( !this.readCode ) {
              this.quaggarStart()
            }
          }, LOOP_INTERVAL )
        } )
        .catch( e => {console.error( 'error : ' + e )} )
    },
    gotDevices( deviceInfos ) {
      this.devices = _.filter( deviceInfos, deviceInfo => {
        return deviceInfo.kind === 'videoinput'
      } ).reverse()

      if( !this.selectedDeviceId ) {
        this.selectedDeviceId = this.devices[0].deviceId
        this.changeVideoInput()
      }
    },
    gotStream( stream ) {
      this.stream = stream
      this.video.srcObject = stream
      this.video.setAttribute( 'playsinline', true ) // required to tell iOS safari we don't want fullscreen
      this.video.play()
      // Refresh button list in case labels have become available
      return navigator.mediaDevices.enumerateDevices()
    },
    quaggarStart() {
      try {
        this.canvas = this.$refs['canvas']
        this.context = this.canvas.getContext( '2d' )
        this.canvas.width = this.video.clientWidth
        this.canvas.height = this.video.clientHeight
        this.context.drawImage( this.video, 0, 0, this.canvas.width, this.canvas.height )
        this.img = this.canvas.toDataURL()

        if( this.video.readyState === this.video.HAVE_ENOUGH_DATA ) {
          alert( '여기' )
          Quagga.decodeSingle( {
            src: this.img,
            numOfWorkers: 0,  // Needs to be 0 when used within node
            inputStream: {
              size: 800 // restrict input-size to be 800px in width (long-side)
            },
            decoder: {
              readers: ['ean_reader'] // List of active readers
            },
          }, ( result ) => {
            if( _.get( result, 'codeResult' ) ) {
              this.readCode = _.get( result, 'codeResult.code' )
              this.$emit( 'codeResult', result )
            } else {
              console.log( 'not detected' )
            }
          } )
        }
        setTimeout( () => {
          if( !this.readCode ) {
            this.quaggarStart()
          }
        }, LOOP_INTERVAL )
      } catch( error ) {
        alert( 'QR/Barcode reading error' + error )
        console.error( 'QR/Barcode reading error', error )
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.read-qr-barcode {
  position: relative;

  width: 100%;
  height: 100%;

  .device-select-area {
    z-index: 99999999;
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

