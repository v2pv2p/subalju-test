<template>
  <div class="read-qr-barcode">
    <select v-model="selectedDevice " @change="changeVideoInput">
      <option v-for="device in devices" :value="device">
        {{ device.label }}
      </option>
    </select>
    {{ readCode }}
    <video class="video" ref="video" width="350" height="350" autoPlay></video>
  </div>
</template>

<script>
import _ from 'lodash'
// import { StreamBarcodeReader } from 'vue-barcode-reader'
import { BrowserMultiFormatReader } from '@zxing/library'

const LOOP_INTERVAL = 20

export default {
  name: 'readQrBarcode',
  components: {
    // StreamBarcodeReader,
  },
  data() {
    return {
      stream: null,
      video: null,
      reader: null,
      readCode: '',
      selectedDevice: null,
      devices: null
    }
  },
  mounted() {
    this.video = this.$refs['video']

    const videoSource = this.video.value
    const constraints = {
      video: { deviceId: videoSource ? { exact: videoSource } : undefined }
    }
    navigator.mediaDevices.getUserMedia( constraints ).then( this.gotStream ).then( this.gotDevices ).catch( e => {console.error( 'error : ' + e )} )
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
    changeVideoInput() {
      if( window.stream ) {
        window.stream.getTracks().forEach( track => {
          track.stop()
        } )
      }
      const videoSource = this.selectedDevice.deviceId
      const constraints = { video: { deviceId: videoSource ? { exact: videoSource } : undefined } }

      navigator.mediaDevices.getUserMedia( constraints ).then( this.gotStream ).then( this.gotDevices ).catch( e => {console.error( 'error : ' + e )} )
    },
    gotDevices( deviceInfos ) {
      this.devices = _.filter( deviceInfos, deviceInfo => {
        return deviceInfo.kind === 'videoinput'
      } )
      console.log( this.devices )
    },
    gotStream( stream ) {
      window.stream = stream // make stream available to console
      this.video.srcObject = stream
      this.reader = new BrowserMultiFormatReader()

      setTimeout( () => {
        if( !this.readCode ) {
          this.readLoop()
          // console.log( 'setTimeout' )
        }
      }, LOOP_INTERVAL )

      // Refresh button list in case labels have become available
      return navigator.mediaDevices.enumerateDevices()
    },
    readLoop() {
      if( !this.video || this.result ) {
        return
      }

      try {
        if( this.video.readyState === this.video.HAVE_ENOUGH_DATA ) {
          const result = this.reader.decode( this.video )
          if( result ) {
            this.readCode = result
            console.log( result )
            return //읽었으면 종료
          }
        }
      } catch( error ) {
        console.error( 'QR/Barcode reading error', error )
      }

      setTimeout( () => {
        if( !this.readCode ) {
          this.readLoop()
          // console.log( 'setTimeout' )
        }
      }, LOOP_INTERVAL )
    },
  }
}
</script>

<style lang="scss" scoped>
.read-qr-barcode {
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: #808080;

  .video {
    width: 100%;
    max-width: 350px;
    height: auto;
  }
}
</style>

