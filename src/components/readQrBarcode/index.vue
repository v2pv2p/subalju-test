<template>
  <div class="read-qr-barcode">
    <select v-model="selectedDevice " @change="changeVideoInput">
      <option v-for="device in devices" :value="device">
        {{ device.label }}
      </option>
    </select>
    {{ readCode }}
    <video class="video" ref="video" width="350" height="350" autoPlay></video>
    <div>
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
// import { StreamBarcodeReader } from 'vue-barcode-reader'
import { BrowserMultiFormatReader } from '@zxing/library'

const LOOP_INTERVAL = 20

export default {
  name: 'readQrBarcode',
  data() {
    return {
      stream: null,
      video: null,
      canvasElement: null,
      canvas: null,
      reader: null,
      readCode: '',
      selectedDevice: null,
      devices: null
    }
  },
  mounted() {
    this.video = this.$refs['video']
    this.canvasElement = this.$refs.canvas
    this.canvas = this.canvasElement.getContext( '2d' )

    const videoSource = this.video.value
    const constraints = {
      video: { deviceId: videoSource ? { exact: videoSource } : undefined }
    }
    navigator.mediaDevices.getUserMedia( constraints ).then( this.gotStream ).then( this.gotVideoDevices ).catch( e => {console.error( 'error : ' + e )} )
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

      navigator.mediaDevices.getUserMedia( constraints ).then( this.gotStream ).then( this.gotVideoDevices ).catch( e => {console.error( 'error : ' + e )} )
    },
    gotVideoDevices( deviceInfos ) {
      //
      this.devices = _.filter( deviceInfos, deviceInfo => {
        return deviceInfo.kind === 'videoinput'
      } )
    },
    gotStream( stream ) {
      window.stream = stream // make stream available to console
      this.video.srcObject = stream
      this.reader = new BrowserMultiFormatReader()

      setTimeout( () => { if( !this.readCode ) { this.readLoop() } }, LOOP_INTERVAL )

      // Refresh button list in case labels have become available
      return navigator.mediaDevices.enumerateDevices()
    },
    readLoop() {
      if( !this.video || this.result ) {
        return
      }
      if( this.video.readyState === this.video.HAVE_ENOUGH_DATA ) {
        const result = this.reader.decode( this.video )
        // 읽어들이는 비디오 화면의 크기
        this.canvasElement.height = this.video.videoHeight
        this.canvasElement.width = this.video.videoWidth
        this.canvas.drawImage( this.video, 0, 0, this.canvasElement.width, this.canvasElement.height )

        if( result ) {
          console.log( result )
          // QR코드 인식에 성공한 경우
          // 인식한 QR코드의 영역을 감싸는 사용자에게 보여지는 테두리 생성
          this.drawLine( result.location.topLeftCorner, result.location.topRightCorner, '#FF0000' )
          this.drawLine( result.location.topRightCorner, result.location.bottomRightCorner, '#FF0000' )
          this.drawLine( result.location.bottomRightCorner, result.location.bottomLeftCorner, '#FF0000' )
          this.drawLine( result.location.bottomLeftCorner, result.location.topLeftCorner, '#FF0000' )
          console.log( 'location', result.location )
          // QR코드 메시지 출력
          this.readCode = result

          return //읽었으면 종료
        } else {
          // QR코드 인식에 실패한 경우
        }
      }

      setTimeout( () => {
        if( !this.readCode ) {
          this.readLoop()
        }
      }, LOOP_INTERVAL )
    },
    drawLine( begin, end, color ) {
      this.canvas.beginPath()
      this.canvas.moveTo( begin.x, begin.y )
      this.canvas.lineTo( end.x, end.y )
      this.canvas.lineWidth = 4
      this.canvas.strokeStyle = color
      this.canvas.stroke()
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

