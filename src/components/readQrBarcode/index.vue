<template>
  <div class="read-qr-barcode">
    <v-quagga :onDetected="logIt" :readerSize="readerSize" :readerTypes="['ean_reader']"></v-quagga>
    {{ results }}
    <!--    <select v-model="selectedDevice " @change="changeVideoInput">-->
    <!--      <option v-for="device in devices" :value="device">-->
    <!--        {{ device.label }}-->
    <!--      </option>-->
    <!--    </select>-->
    <!--    <div style="background-color: pink; width: 50px; height: 100px;" @click="readBarcode">shot</div>-->
    <!--    {{ readCode }}-->
    <!--    <video class="video" ref="video" autoPlay></video>-->
    <!--    <canvas ref="canvas"></canvas>-->
    <!--    <img ref='canvasImgFile' :src="img">-->
  </div>
</template>

<script>
import _ from 'lodash'

import Quagga from 'quagga'
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
      // stream: null,
      // video: null,
      // reader: null,
      // readCode: '',
      // selectedDevice: null,
      // devices: null,
      // canvas: null,
      // context: null,
      // img: null,
      readerSize: {
        width: 640,
        height: 480
      },
      detecteds: [],
      results: null
    }
  },
  mounted() {
    // this.video = this.$refs['video']
    //
    // const videoSource = this.video.value
    // const constraints = {
    //   video: { deviceId: videoSource ? { exact: videoSource } : undefined }
    // }
    // navigator.mediaDevices.getUserMedia( constraints ).then( this.gotStream ).then( this.gotDevices ).catch( e => {console.error( 'error : ' + e )} )
  },
  beforeDestroy() {
  },
  methods: {
    logIt( data ) {
      this.results = data
      console.log( 'detected', data )
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
    // gotDevices( deviceInfos ) {
    //   this.devices = _.filter( deviceInfos, deviceInfo => {
    //     return deviceInfo.kind === 'videoinput'
    //   } )
    // },
    // gotStream( stream ) {
    //   window.stream = stream // make stream available to console
    //   this.video.srcObject = stream
    //   this.reader = new BrowserMultiFormatReader()
    //
    //   // Refresh button list in case labels have become available
    //   return navigator.mediaDevices.enumerateDevices()
    // },
    // readBarcode() {
    //   this.canvas = this.$refs['canvas']
    //   this.context = this.canvas.getContext( '2d' )
    //   this.canvas.width = this.video.clientWidth
    //   this.canvas.height = this.video.clientHeight
    //   this.context.drawImage( this.video, 0, 0, this.canvas.width, this.canvas.height )
    //   console.log( this.video.clientWidth )
    //   console.log( this.video.clientHeight )
    //   this.img = this.canvas.toDataURL()
    //
    //   try {
    //     if( this.video.readyState === this.video.HAVE_ENOUGH_DATA ) {
    //       this.reader.decodeFromImage( this.$refs.canvasImgFile ).then( ( result ) => {
    //         if( result ) {
    //           this.readCode = result
    //         }
    //       } ).catch( ( err ) => {
    //         console.error( err )
    //       } )
    //     }
    //   } catch( error ) {
    //     console.error( 'QR/Barcode reading error', error )
    //   }
    //
    // },
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

