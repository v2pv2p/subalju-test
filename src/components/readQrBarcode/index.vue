<template>
  <div class="read-qr-barcode">
    <div class="device-select-area">
      <div class="device-select">
        <select v-model="selectedDevice" @change="changeVideoInput">
          <option v-for="device in devices" :value="device">
            {{ device.label }}
          </option>
        </select>
      </div>
    </div>

    <div class="stream-area">
      <video class="video" ref="video" autoPlay></video>
      <canvas class="canvas" ref="canvas"></canvas>
      <img class="image" ref='canvasImgFile' :src="img">
    </div>

  </div>
</template>

<script>
import _ from 'lodash'
import Quagga from 'quagga'

const LOOP_INTERVAL = 20

export default {
  name: 'readQrBarcode',
  data() {
    return {
      video: null,
      canvas: null,
      context: null,
      img: null,
      videoSource: null,

      devices: null,
      selectedDevice: null,

      readCode: ''
    }
  },
  mounted() {
    this.video = this.$refs['video']
    this.videoSource = this.video.value

    this.getVideoInput()
  },
  beforeDestroy() {
    if( this.video ) {
      this.video.pause()
      this.video = null
    }
  },
  methods: {
    changeVideoInput() {
      this.videoSource = this.selectedDevice.deviceId
    },
    getVideoInput() {
      const constraints = { video: { deviceId: this.videoSource ? { exact: this.videoSource } : undefined } }

      navigator.mediaDevices.getUserMedia( constraints )
        .then( this.gotStream )
        .then( ( deviceInfos ) => {
          this.gotDevices( deviceInfos )
          setTimeout( () => this.quaggarStart(), LOOP_INTERVAL )
        } )
        .catch( e => {console.error( 'error : ' + e )} )
    },
    gotDevices( deviceInfos ) {
      this.devices = _.filter( deviceInfos, deviceInfo => {
        return deviceInfo.kind === 'videoinput'
      } )
    },
    gotStream( stream ) {
      this.video.srcObject = stream
      this.video.setAttribute( 'playsinline', true ) // required to tell iOS safari we don't want fullscreen
      this.video.play()
      // Refresh button list in case labels have become available
      return navigator.mediaDevices.enumerateDevices()
    },
    quaggarStart() {
      if( this.readCode ) {
        return
      }

      this.canvas = this.$refs['canvas']
      this.context = this.canvas.getContext( '2d' )
      this.canvas.width = this.video.clientWidth
      this.canvas.height = this.video.clientHeight
      this.context.drawImage( this.video, 0, 0, this.canvas.width, this.canvas.height )
      this.img = this.canvas.toDataURL()

      try {
        if( this.video.readyState === this.video.HAVE_ENOUGH_DATA ) {
          Quagga.decodeSingle( {
            src: this.img,
            numOfWorkers: 0,  // Needs to be 0 when used within node
            inputStream: {
              size: this.video.clientWidth  // restrict input-size to be 800px in width (long-side)
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
              setTimeout( () => this.quaggarStart(), LOOP_INTERVAL )
            }
          } )
        }
      } catch( error ) {
        console.error( 'QR/Barcode reading error', error )
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.read-qr-barcode {
  height: 100%;

  .device-select-area {
    display: flex;

    .device-select-title {
      flex: 0 0 1; /* 증가너비 감소너비 기본너비 */
    }

    .device-select {

    }
  }

  .stream-area {
    .video {
      width: 100%;
      max-width: 350px;
      height: auto;
    }

    .canvas {
      visibility: hidden
    }

    .image {
      visibility: hidden
    }
  }

}
</style>

