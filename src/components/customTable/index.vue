<template>
  <div class="custom-table">
    <div class="custom-table-header-area">
      <div class="custom-table-header" v-for="header in headers">
        {{ header.text }}
      </div>
    </div>

    <div class="custom-table-contents">
      <div v-for="header in headers">
        <div v-for="item in items">
          {{ item[header.value] }}
        </div>
      </div>
    </div>
  </div>

</template>

<script>

export default {
  name: 'customTable',
  props: {
    headers: {
      type: Array,
      default() {
        return []
      }
    },
    items: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {},
  computed: {},
  data() {
    return {}
  },
  created() {

  },
  mounted() {
  },
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.custom-table {
  height: 100%;

  width: 100%;

  .custom-table-header-area {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    border: 1px solid #000000;
    .custom-table-header {
      flex: auto;

      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .custom-table-contents {
    display: grid;

  }
}
</style>
