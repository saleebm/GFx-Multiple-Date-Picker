import { CalendarActionTypes, calendarStore } from '../reducer/calendar-store'
import API from '../../../../utils/API'

export const createCalTypeAction = (calName, fields = []) => async (
  dispatch,
) => {
  dispatch({
    type: CalendarActionTypes.CREATE_CAL_TYPE,
    payload: { name: calName, fields },
  })
  await dispatch(updateServer())
}

export const setDatesSelected = (name, datesSelected) => async (dispatch) => {
  dispatch({
    type: CalendarActionTypes.SET_DATES_SELECTED,
    payload: {
      name,
      datesSelected,
    },
  })
  await dispatch(updateServer())
}

export const setFieldsSelectedAction = (name, fieldsSelected) => async (
  dispatch,
) => {
  dispatch({
    type: CalendarActionTypes.SET_FIELDS_SELECTED,
    payload: {
      name,
      fieldsSelected,
    },
  })
  await dispatch(updateServer())
}

/**
 * Only called initially when first activating
 * @returns {function(...[*]=)}
 */
export const initializeCalendarAction = () => async (dispatch) => {
  const {
    data: { value },
  } = await API.post('gfx-mds', {
    gfx_selected_dates: calendarStore.calendars,
  }).catch((error) => console.log(error))
  dispatch({
    type: CalendarActionTypes.INITIALIZE_CALENDAR,
    payload: value,
  })
}

export const resetServerCalendarsAction = () => async (dispatch) => {
  console.log('reseting calendars')
  // calendar on server not yet instantiated
  // will handle finish loading state
  await dispatch(initializeCalendarAction())
}

export const updateFromServer = () => async (dispatch) => {
  dispatch({ type: CalendarActionTypes.UPDATE_FROM_SERVER_INIT })
  try {
    // calState should be typeof calendars
    const { data } = await API.get('gfx-mds')
    const serverCalState = ('value' in data && data.value) || null
    // if server option is clean (empty)
    if (serverCalState == null) {
      console.log('creating calendars')
      // calendar on server not yet instantiated
      // will handle finish loading state
      dispatch({
        type: CalendarActionTypes.UPDATE_FROM_SERVER_FAILURE,
        payload: {
          message: 'Please go to the settings tab below to begin!',
        },
      })
    }
    // else we store the value into our state for consumption
    else {
      dispatch({
        type: CalendarActionTypes.UPDATE_FROM_SERVER_SUCCESS,
        payload: serverCalState,
      })
    }
  } catch (e) {
    dispatch({
      type: CalendarActionTypes.UPDATE_FROM_SERVER_FAILURE,
      payload: {
        message:
          (e && e.toString()) ||
          'An error has occurred, we may need to initialize/reset calendar in settings.',
      },
    })
    console.error(e)
  }
}

export const updateServer = () => async (dispatch, getState) => {
  const {
    calendarReducer: { calendars },
  } = getState()
  dispatch({ type: CalendarActionTypes.UPDATE_SERVER_INIT })
  try {
    const {
      data: { value: calendarData },
    } = await API.post('gfx-mds', {
      gfx_selected_dates: calendars,
    })
    dispatch({
      type: CalendarActionTypes.UPDATE_FROM_SERVER_SUCCESS,
      payload: calendarData,
    })
  } catch (e) {
    console.error(e)
    dispatch({
      type: CalendarActionTypes.UPDATE_SERVER_FAILURE,
      payload: {
        message:
          (e && e.toString()) ||
          'An error has occurred, we may need to initialize/reset calendar in settings.',
      },
    })
  }
}
