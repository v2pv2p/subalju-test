export default function install( Vue, _ ) {
  let nextKey = 0
  let popupList = []
  let anchorVm = null

  let popupManager = {
    open: function( component, params ) {
      if( !component )
        throw new Error( 'component is null' )

      let key = '_popup_key_' + (nextKey++)
      popupList.push( { component: component, key: key, params: params } )

      if( anchorVm )
        anchorVm.$forceUpdate()

      return { popup_key: key }
    },
    close: function( inst ) {
      if( !inst )
        return

      for( let i = 0; i < popupList.length; i++ ) {
        if( inst instanceof Vue && inst === popupList[i].componentInstance ||
          inst.popup_key === popupList[i].key ) {
          popupList.splice( i, 1 )
          if( anchorVm )
            anchorVm.$forceUpdate()
          return
        }
      }
    }
  }

  Object.defineProperty( Vue.prototype, '$popupManager', {
    get() { return popupManager }
  } )

  Vue.component( 'popup-anchor', {
    name: 'popup-anchor',
    created() {
      anchorVm = this
    },
    render( createElement ) {
      let children = popupList.map( popup => createElement(
        popup.component,
        {
          key: popup.key,
          props: popup.params ? popup.params : {},
          hook: {
            create: function( _, vnode ) {
              popup.componentInstance = vnode.componentInstance
            }
          }
        }
      ) )

      return createElement( 'div', children )
    }
  } )
};
