import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './store/store' // Make sure this path is correct
import App from './App'
import { Startup } from './Startup'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Startup>
        <App />
      </Startup>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
