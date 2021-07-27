import '@/assets/css/popup.scss'
import _ from 'lodash'

export default function install( Vue ) {
  let nextKey = 0 //키 생성을 위한 일련번호
  let popupList = [] //팝업될 컴포넌트들을 저장하는 리스트
  let anchorVm = null  //vue create할때 생기는 popup-anchor 컴포넌트

  function updateAnchor( isFullPopup ) {
    if( anchorVm ) {
      anchorVm.$forceUpdate()//popup-anchor가 새롭게 render를 하도록 한다. 하위 컴포넌트나 인스턴스에 영향을 끼치지 않고 $forceUpdate 메소드가 실행된 인스턴스만 다시 렌더링 된다

      document.documentElement.classList.add( 'active-popup' )
      if( isFullPopup ) {
        document.documentElement.classList.add( 'fullpopup-show' )
      }

      anchorVm.$nextTick( function() {
        // 홈 화면이 너무 빨리 나오는 상황을 제어.
        if( popupList.length == 0 ) {
          // 현재 풀팝업이 아닌 팝업에서 풀팝업을 띄우는 경우는 존재 하지 않습니다.
          // 해당씬이 생기는 경우 수정할 필요가 생깁니다.
          document.documentElement.classList.remove( 'fullpopup-show' )
          document.documentElement.classList.remove( 'active-popup' )
        }
        if( isFullPopup ) {
          window.document.documentElement.scrollTop = 0
          window.document.body.scrollTop = 0
        }
      } )
    }
  }

  function getPathWithoutHash() {
    let path = window.location.href
    let idx = window.location.href.indexOf( '#' ) // #의 위치
    if( idx >= 0 ) {
      path = path.substring( 0, idx ) // #위치 전까지 주소를 자름
    }
    return path
  }

  function makePopupKeyListString( pList ) {
    let ks = _.map( pList, p => p.popupKey )
    return _.join( ks, ',' )
  }

  let popupManager = {
    open: function( component, params, isFullPopup ) { //요청시에 컴포넌트와 파라미터를 인자로 넘길 수 있다.
      if( !component ) {
        throw new Error( 'popupError: component is null' )
      }

      let key = '_popup_key_' + (nextKey++) //키 생성
      let resolve
      let promise = new Promise( ( rs, rj ) => {
        resolve = rs
      } )

      popupList.push( { component: component, popupKey: key, params: params, resolve: resolve } ) //popupList에 open 요청을 저장한다.
      updateAnchor( isFullPopup )

      window.history.pushState( null, 'popup', getPathWithoutHash() + '#popup=' + makePopupKeyListString( popupList ) )// 브라우저의 세션 기록 스택에 상태를 추가

      return { popup_key: key, promise: promise } //리턴값으로 key를 담고 있는 객체를 넘긴다.
    },
    close: function( inst, retParam ) {
      if( !inst ) {
        return
      }

      for( let i = 0; i < popupList.length; i++ ) {
        if( inst instanceof Vue && inst === popupList[i].componentInstance ||
          inst.popupKey === popupList[i].popupKey ) {
          let resolve = popupList[i].resolve
          popupList.splice( i, 1 )
          updateAnchor()
          window.history.back()
          setTimeout( () => resolve( retParam ), 0 )
          return
        }
      }
    },
    closeAll: function() {
      let removed = _.remove( popupList, () => true )
      updateAnchor()
      setTimeout( () => {
        _.forEach( removed, item => {
          let resolve = item.resolve
          resolve()
        } )
      }, 0 )

      window.history.replaceState( null, undefined, getPathWithoutHash() )
    }
  }

  //생성 되는 모든 Vue 인스턴스에서 액세스 할 수 있도록 Vue.prototype에 $popupManager를 설정한다.
  Object.defineProperty( Vue.prototype, '$popupManager', {
    get() { return popupManager }
  } )

  Vue.component( 'popup-anchor', {
    name: 'popup-anchor',
    created() { //popup-anchor 컴포넌트가 생성되었을
      console.log( this )
      anchorVm = this //popup-anchor의 인스턴스를 저장해 둔다. 이후 open이나 close 시에 $forceUpdate를 위해 사용된다.
    },
    render: function( createElement ) {
      let children = popupList.map( popup => createElement( //createElement의 첫번째 인자로 컴포넌트, 두번째 인자로 옵션 데이터 객체
        popup.component,
        {
          key: popup.key, //컴포넌트 key
          props: popup.params ? popup.params : {}, //open시 전달한 파라미터
          hook: {
            create: function( _, vnode ) { //VNode의 create 훅을 통해서
              popup.componentInstance = vnode.componentInstance //생성한 컴포넌트의 인스턴스를 저장해 둔다.
            }
          }
        }
      ) )
      return createElement( 'div', children )
    }
  } )
}
