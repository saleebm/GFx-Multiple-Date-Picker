import React, { StrictMode } from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@xstyled/styled-components'
import MuiThemeProvider from '@material-ui/styles/ThemeProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { theme } from './styles/theme'
import { configureStore } from './store/configure-store'
import { muiTheme } from './styles/mui-theme'
import { MainContainer } from './containers/Main'

export function App() {
  const store = configureStore()
  return (
    <StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <MuiThemeProvider theme={muiTheme}>
            <ThemeProvider theme={theme}>
              <main className="coptix-container">
                <MainContainer />
              </main>
            </ThemeProvider>
          </MuiThemeProvider>
        </Provider>
      </ErrorBoundary>
    </StrictMode>
  )
}
