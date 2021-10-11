import React, { useCallback, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import DayPicker from 'react-day-picker'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import debounce from 'lodash.debounce'
import { useHistory } from 'react-router'
import {
  setDatesSelected,
  deleteContext,
} from '../../store/modules/calendar/action/calendar-actions'

import 'react-day-picker/lib/style.css'
import { getCookie, setCookie } from '../../utils/cookies'
import { Button } from '@material-ui/core'

const mapStateToProps = (state) => ({
  registrationState: state.calendarReducer.calendars,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      dispatchDatesSelected: setDatesSelected,
      deleteContext,
    },
    dispatch,
  )

/**
 *
 * @param registration The current calendar name
 * @param registrationState The calendars in state
 * @param dispatchDatesSelected
 * @returns {*}
 * @constructor
 */
export const Calendar = connect(
  mapStateToProps,
  mapDispatchToProps,
)(function ({
  registration,
  registrationState,
  dispatchDatesSelected,
  deleteContext,
}) {
  const history = useHistory()
  const CALS_TO_SHOW_COOKIE_NAME = 'cals-to-display'
  const calsToShowOption = getCookie(CALS_TO_SHOW_COOKIE_NAME)
  const calsToShowValue = !!calsToShowOption ? Number(calsToShowOption) : 3
  const [sliderValue, setSliderValue] = useState(calsToShowValue)
  const [calendarsToView, setCalendarsToView] = useState(calsToShowValue)
  const findIndex = registrationState.findIndex(
    (obj) => 'name' in obj && obj['name'] === registration,
  )

  const { datesSelected: currentRegDates } = registrationState[findIndex] || {}

  const findIndexOfAll = registrationState.findIndex(
    (obj) => 'name' in obj && obj['name'] === 'all',
  )

  const { datesSelected: datesBlockedForAll } =
    registrationState[findIndexOfAll] || {}

  /**
   * datesSelected local to the type of registration selected, managed by reducer
   * @type {Function} Dispatch action to set object datesSelected
   */
  const handleDayClick = useCallback(
    (day, { selected }) => {
      if (selected) {
        // check if it is already a date selected previously or not. If it was selected in the
        // current session, it will already by a date object, however, if it was stored previously,
        // we have to instantiate it from the ISO formatted string that was stored.
        const selectedIndex = currentRegDates.findIndex((selectedDay) => {
          if (selectedDay instanceof Date) {
            return DayPicker.DateUtils.isSameDay(selectedDay, day)
          }
          return DayPicker.DateUtils.isSameDay(new Date(selectedDay), day)
        })
        const updatedResponse = [
          ...currentRegDates.slice(0, selectedIndex),
          ...currentRegDates.slice(selectedIndex + 1),
        ]
        dispatchDatesSelected(registration, updatedResponse)
      } else {
        const updatedResponse = Array.from([...currentRegDates, day])
        dispatchDatesSelected(registration, updatedResponse)
      }
      // if registration type selected is all, the program will loop through each of the other
      // registration types' objects in order to check if the datesSelected there contain the date in
      // the 'all' datesSelected array. This is to prevent the same date from being selected and disabled
      // in any of the datesSelected of the registration types.
      if (registration === 'all') {
        registrationState.forEach((obj) => {
          if (obj['name'] !== 'all') {
            const tempDatesSelected = obj['datesSelected']
            const indexOfSameDateDisabled = tempDatesSelected.findIndex(
              (selectedDisabledDate) => {
                if (selectedDisabledDate instanceof Date) {
                  return DayPicker.DateUtils.isSameDay(
                    selectedDisabledDate,
                    day,
                  )
                }
                return DayPicker.DateUtils.isSameDay(
                  new Date(selectedDisabledDate),
                  day,
                )
              },
            )
            if (
              !isNaN(indexOfSameDateDisabled) &&
              indexOfSameDateDisabled !== -1
            ) {
              const updatedResponse = [
                ...currentRegDates.slice(0, indexOfSameDateDisabled),
                ...currentRegDates.slice(indexOfSameDateDisabled + 1),
              ]
              dispatchDatesSelected(obj.name, updatedResponse)
            }
          }
        })
      }
    },
    [registrationState, registration, dispatchDatesSelected, currentRegDates],
  )

  const debouncedUpdateMonths = debounce((evt, value) => {
    setCalendarsToView(value)
  }, 350)

  const onSliderInputChange = useCallback((evt, value) => {
    setSliderValue(value)
    setCookie(CALS_TO_SHOW_COOKIE_NAME, value, 7)
  }, [])

  const onSliderCommmited = useCallback(
    (evt, value) => {
      debouncedUpdateMonths(evt, value)
    },
    [debouncedUpdateMonths],
  )

  const handleDeleteContext = useCallback(() => {
    const confirmed = window.confirm(
      'Are you sure you want to clear all dates?',
    )
    if (confirmed) {
      deleteContext(registration)
      history.push('/')
    }
  }, [registration])

  return useMemo(
    () => (
      <Grid container alignItems={'center'} spacing={2} justify={'center'}>
        <Grid item xs={12}>
          <Typography variant={'h1'} gutterBottom>
            Select Dates to Block
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {registration !== 'all' ? (
            <DayPicker
              className="coptix-datepicker"
              selectedDays={[
                ...(currentRegDates || []),
                (day) => currentRegDates.includes(day.toISOString()),
              ]}
              disabledDays={[
                ...(datesBlockedForAll || []),
                (day) =>
                  registration !== 'all' &&
                  datesBlockedForAll.includes(day.toISOString()),
              ]}
              onDayClick={handleDayClick}
              numberOfMonths={calendarsToView}
            />
          ) : (
            <DayPicker
              className={'coptix-datepicker'}
              selectedDays={[
                ...(currentRegDates || []),
                (day) => currentRegDates.includes(day.toISOString()),
              ]}
              onDayClick={handleDayClick}
              numberOfMonths={calendarsToView}
            />
          )}
        </Grid>
        <Grid
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width: '100%',
          }}
          item
          xs={12}
        >
          <div
            style={{
              width: '300px',
            }}
          >
            <Typography variant={'h6'} gutterBottom>
              Number of Months Visible
            </Typography>
            <Slider
              value={sliderValue}
              valueLabelDisplay={'auto'}
              aria-labelledby={'discrete-slider-restrict'}
              max={12}
              min={1}
              step={1}
              onChange={onSliderInputChange}
              onChangeCommitted={onSliderCommmited}
            />
          </div>
          <div>
            <Button
              variant={'contained'}
              color={'secondary'}
              onClick={handleDeleteContext}
            >
              Delete Context
            </Button>
          </div>
        </Grid>
      </Grid>
    ),
    [
      handleDayClick,
      registration,
      currentRegDates,
      datesBlockedForAll,
      onSliderInputChange,
      onSliderCommmited,
      calendarsToView,
      sliderValue,
      handleDeleteContext,
    ],
  )
})
