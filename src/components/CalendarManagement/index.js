import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Backdrop, CircularProgress, Paper, Grid } from '@material-ui/core'
import { Title } from '../Title'
import { updateFromServer } from '../../store/modules/calendar/action/calendar-actions'
import { Tabs } from '../Tabs'
import { LoadingDots } from '../LoadingDots'

const mapStateToProps = (state) => ({
  isServerUpdating: state.calendarReducer.loading,
  initialLoading: state.calendarReducer.initialLoading,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      dispatchUpdateFromServer: updateFromServer,
    },
    dispatch,
  )

export const CalendarManagement = connect(
  mapStateToProps,
  mapDispatchToProps,
)(function ({ routeMap, initialLoading, isServerUpdating, children }) {
  return (
    <>
      <Backdrop
        style={{
          zIndex: 1,
        }}
        open={initialLoading}
      >
        <CircularProgress variant={'indeterminate'} />
      </Backdrop>

      {!initialLoading && (
        <Paper
          elevation={10}
          variant={'elevation'}
          style={{
            padding: '15px',
          }}
        >
          <Grid
            spacing={3}
            container
            alignItems={'flex-start'}
            justify={'center'}
          >
            <Grid item xs={12}>
              <Title content="Calendar Management" />
            </Grid>
            <Grid item xs={12}>
              <Tabs routes={routeMap} />
            </Grid>
            <Grid item xs={12}>
              {children}
              {isServerUpdating && <LoadingDots />}
            </Grid>
          </Grid>
        </Paper>
      )}
    </>
  )
})
