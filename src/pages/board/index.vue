<template>
  <div class="board">
    <div class="board-header">
      <div class="board-title">게시판</div>
      <div class="button-area">
        <div class="btn" @click="addBoard">추가</div>
        <div class="btn" @click="delBoard">삭제</div>
      </div>
    </div>
    <div class="custom-table">
      <div class="custom-table-header-area">
        <div class="custom-table-header" v-for="header in headers" :style="{ width: header.width + '%' }">
          {{ header.text }}
        </div>
      </div>

      <div class="custom-table-contents-area">
        <div v-for="header in headers" :style="{ width: header.width + '%' }">
          <div class="custom-table-contents" v-for="item in items">
            {{ item[header.value] }}
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
import req2svr from './req2svr'

export default {
  name: 'board',
  components: {},
  computed: {
    req2svr: () => req2svr,
  },
  data() {
    return {
      items: [],
      headers: [
        { value: 'board_id', text: '번호', width: 30 },
        { value: 'title', text: '제목', width: 30 },
        { value: 'contents', text: '내용', width: 40 },
      ]
    }
  },
  created() {
    this.getBoard()
  },
  methods: {
    getBoard() {
      this.req2svr.getBoard().then( res => {
        console.log( res )
        this.items = res
      } )
    },
    addBoard() {
      this.$router.push( { name: 'addBoard' } )
    },
    delBoard() {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.board {
  height: 100%;
  width: 100%;

  .board-header {
    display: flex;
    justify-content: space-between;

    padding: 10px;

    .board-title {
      font-size: 30px;
      font-weight: bold;
    }

    .button-area {
      display: flex;
      gap: 10px;

      .btn {
        display: flex;
        justify-content: center;
        align-items: center;

        padding: 5px 10px;

        border-radius: 5px;
        background-color: #cccccc;

        line-height: 30px;
      }
    }
  }

  .custom-table {
    border: 1px solid #2c3e50;
    border-radius: 20px;

    .custom-table-header-area {
      display: flex;

      border-bottom: 2px solid #000000;

      .custom-table-header {
        padding: 10px;
      }
    }

    .custom-table-contents-area {
      display: flex;

      .custom-table-contents {
        padding: 10px;
      }
    }
  }
}
</style>
