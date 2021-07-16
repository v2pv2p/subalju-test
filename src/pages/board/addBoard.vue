<template>
  <div class="add-board">
    <div class="board-header">
      <div class="board-title">게시판 글쓰기</div>
      <div class="button-area">
        <div class="btn" @click="goBoard">돌아가기</div>
      </div>
    </div>
    <div class="board-contents">
      <div>제목</div>
      <input type="text" v-model="title">
      <div>내용</div>
      <input type="text" v-model="contents">
    </div>
  </div>
</template>

<script>
import req2svr from './req2svr'

export default {
  name: 'addBoard',
  components: {},
  computed: {
    req2svr: () => req2svr,
  },
  data() {
    return {
      title: '',
      contents: '',
    }
  },
  created() {
  },
  methods: {
    goBoard() {
      this.$router.push( { name: 'board' } )
    },
    addBoard() {
      let board = { title: this.title, contents: this.contents }
      this.req2svr.addBoard( board )
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.add-board {
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
