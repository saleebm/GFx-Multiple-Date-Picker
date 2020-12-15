import * as React from 'react'
import * as ReactDom from 'react-dom'
import { App } from './main'

const render = () => {
  document.addEventListener('DOMContentLoaded', function () {
    ReactDom.render(<App />, document.getElementById('⚛'))
  })
}

if (
  'fetch' in window &&
  'URL' in window &&
  'Map' in window &&
  'forEach' in NodeList.prototype &&
  'startsWith' in String.prototype &&
  'endsWith' in String.prototype &&
  'includes' in String.prototype &&
  'includes' in Array.prototype &&
  'assign' in Object &&
  'entries' in Object &&
  'keys' in Object
) {
  render()
} else {
  import('./polyfills').then(render)
}
