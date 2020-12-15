import React, { useEffect, useMemo } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Typography } from '@material-ui/core'
import { HashRouter as Router, Route } from 'react-router-dom'

import { updateFromServer } from '../../store/modules/calendar/action/calendar-actions'
import { routes } from '../../config/routes'
import { GlobalStyle } from '../../styles/globalStyles'
import { CalendarPickerForm } from '../../components/CalendarPickerForm'
import { Settings } from '../../components/Settings'
import { CalendarManagement } from '../../components/CalendarManagement'

const mapStateToProps = (state) => ({
  errorState: state.calendarReducer.error,
  calendars: state.calendarReducer.calendars,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      dispatchUpdateFromServer: updateFromServer,
    },
    dispatch,
  )

export const MainContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(function ({ dispatchUpdateFromServer, calendars, errorState }) {
  // run updates and get server state
  useEffect(() => {
    dispatchUpdateFromServer()
  }, [dispatchUpdateFromServer])

  const routerDynamicPaths = useMemo(
    () => Array.isArray(calendars) && calendars.map((x) => x.name).join('|'),
    [calendars],
  )

  const routeMap = useMemo(
    () =>
      Array.of(
        ...((Array.isArray(calendars) &&
          calendars.map((cal) => ({
            name: cal.name,
            path: `/${cal.name}`,
            isSettings: false,
          }))) ||
          []),
        ...routes.filter((route) => route.isSettings),
      ),
    [calendars],
  )

  const settingsPath = useMemo(
    () => routes.find((route) => route.isSettings).path,
    [],
  )

  return (
    <>
      {errorState && errorState.isError && 'message' in errorState && (
        <div
          style={{
            backgroundColor: 'lightyellow',
            width: '100vw',
            minHeight: '100px',
          }}
        >
          <Typography variant={'h2'} gutterBottom color={'textSecondary'}>
            {errorState.message}
          </Typography>
        </div>
      )}
      <Router hashType={'noslash'}>
        <Route
          path={'/'}
          exact
          strict
          render={() => (
            <CalendarManagement routeMap={routeMap}>
              <Typography variant={'h3'}>Welcome to GFx!</Typography>
            </CalendarManagement>
          )}
        />
        <Route
          path={`/:registration(${routerDynamicPaths})`}
          render={(props) => (
            <CalendarManagement routeMap={routeMap}>
              <CalendarPickerForm {...props} />
            </CalendarManagement>
          )}
        />
        <Route
          path={settingsPath}
          render={(props) => (
            <CalendarManagement routeMap={routeMap}>
              <Settings {...props} />
            </CalendarManagement>
          )}
        />
      </Router>
      <GlobalStyle />
    </>
  )
})
