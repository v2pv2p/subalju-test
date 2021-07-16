module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        ws: true
      }
    },
  },
  apiBaseUrl: 'http://localhost:9000',
  outputDir: '../api/src/main/resources/static/dist',
}
