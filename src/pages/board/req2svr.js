import axios from 'axios'

export default {
  getBoard() {
    return axios.get( 'http://localhost:9000/getboard' ).then( x => x.data )
  },
  addBoard(param) {
    return axios.post( 'http://localhost:9000/addboard', param ).then( x => x.data )
  },
}
