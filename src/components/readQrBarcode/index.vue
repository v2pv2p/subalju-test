<template>
  <div class="read-qr-barcode">
    <select v-model="selectedDevice " @change="changeVideoInput">
      <option v-for="device in devices" :value="device">
        {{ device.label }}
      </option>
    </select>
    <div style="background-color: pink; width: 50px; height: 100px;" @click="quaggarStart">shot</div>
    {{ readCode }}
    <video class="video" ref="video" autoPlay></video>
    <canvas ref="canvas"></canvas>
    <img ref='canvasImgFile' :src="img">
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
      stream: null,
      video: null,
      reader: null,
      readCode: '',
      selectedDevice: null,
      devices: null,
      canvas: null,
      context: null,
      img: null
    }
  },
  mounted() {
    this.video = this.$refs['video']

    const videoSource = this.video.value
    const constraints = {
      video: { deviceId: videoSource ? { exact: videoSource } : undefined }
    }
    navigator.mediaDevices.getUserMedia( constraints )
      .then( this.gotStream )
      .then( ( deviceInfos ) => {
        this.gotDevices( deviceInfos )
        setTimeout( () => this.quaggarStart(), LOOP_INTERVAL )
      } )
      .catch( e => {console.error( 'error : ' + e )} )
  },
  beforeDestroy() {
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
          console.log( 'quaggar' )
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
            } else {
              console.log( 'not detected' )
            }
          } )
        }
      } catch( e ) {

      }

    },
    // changeVideoInput() {
    //   if( window.stream ) {
    //     window.stream.getTracks().forEach( track => {
    //       track.stop()
    //     } )
    //   }
    //   const videoSource = this.selectedDevice.deviceId
    //   const constraints = { video: { deviceId: videoSource ? { exact: videoSource } : undefined } }
    //
    //   navigator.mediaDevices.getUserMedia( constraints ).then( this.gotStream ).then( this.gotDevices ).catch( e => {console.error( 'error : ' + e )} )
    // },
    gotDevices( deviceInfos ) {
      this.devices = _.filter( deviceInfos, deviceInfo => {
        return deviceInfo.kind === 'videoinput'
      } )
    },
    gotStream( stream ) {
      window.stream = stream // make stream available to console
      this.video.srcObject = stream

      // Refresh button list in case labels have become available
      return navigator.mediaDevices.enumerateDevices()
    },
    readBarcode() {
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
              size: this.canvas.width  // restrict input-size to be 800px in width (long-side)
            },
            decoder: {
              readers: ['ean_reader'] // List of active readers
            },
          }, ( result ) => {
            console.log( '실행' )
            if( result.codeResult ) {

              console.log( 'result', result.codeResult.code )
            } else {
              console.log( 'not detected' )
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

  .video {
    width: 100%;
    max-width: 350px;
    height: auto;
  }
}
</style>

