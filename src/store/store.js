import { legacy_createStore as createStore, combineReducers } from 'redux'

import { boardReducer } from './reducers/board.reducer'
import { userReducer } from './reducers/user.reducer'
import { systemReducer } from './reducers/system.reducer'
import { appReducer } from './reducers/app.reducer'

const rootReducer = combineReducers({
  boardModule: boardReducer,
  userModule: userReducer,
  systemModule: systemReducer,
  appModule: appReducer
})

const middleware = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
  : undefined
export const store = createStore(rootReducer, middleware)

// For debug:
// store.subscribe(() => {
//     console.log('**** Store state changed: ****')
//     console.log('storeState:\n', store.getState())
//     console.log('*******************************')
// })
