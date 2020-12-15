import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
// dev
import { composeWithDevTools } from 'redux-devtools-extension'

import { rootState } from './modules/root-state'
import { rootReducer } from './modules/root-reducer'

const composeEnhancers = composeWithDevTools({
  trace: true,
})

export function configureStore(initalState = rootState) {
  const enhancer =
    process.env.NODE_ENV !== 'production'
      ? composeEnhancers(applyMiddleware(thunk))
      : applyMiddleware(thunk)

  return createStore(rootReducer, initalState, enhancer)
}
