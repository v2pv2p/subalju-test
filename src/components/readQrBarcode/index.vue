<template>
  <div className="read-qr-barcode">
    {{ device }}
    {{ readCode }}
    <video className="video" ref="video" width="350" height="350" autoPlay></video>
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
      device: null
    }
  },
  mounted() {
    this.video = this.$refs['video']

    navigator.mediaDevices.getUserMedia( { video: { facingMode: 'environment' } } )
      .then( stream => {
        this.device = stream
        this.stream = stream

        this.video.srcObject = stream
        this.video.setAttribute( 'playsinline', true ) // required to tell iOS safari we don't want fullscreen
        this.video.play()

        this.reader = new BrowserMultiFormatReader()
        console.log( this.reader )
        setTimeout( () => {
          if( !this.result ) {
            this.readLoop()
            // console.log( 'setTimeout' )
          }
        }, LOOP_INTERVAL )
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
      if( !this.video || this.result ) {
        return
      }
      try {
        console.log( 'decode', this.reader.decode( this.video ) )
        if( this.video.readyState === this.video.HAVE_ENOUGH_DATA ) {
          console.log( 'decode', this.reader.decode( this.video ) )
          const result = this.reader.decode( this.video )
          if( result ) {
            this.readCode = result
            console.log( result )
            return //읽었으면 종료
          }
        }
      } catch( error ) {
        // console.error( 'QR/Barcode reading error', error )
      }

      setTimeout( () => {
        if( !this.result ) {
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
    height: 350px;
  }
}
</style>

