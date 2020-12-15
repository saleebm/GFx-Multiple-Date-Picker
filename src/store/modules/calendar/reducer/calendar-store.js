import { v4 as uuid } from 'uuid'
import { produce } from 'immer'

export const CalendarActionTypes = Object.freeze({
  CREATE_CAL_TYPE: 'CREATE_CAL_TYPE',
  INITIALIZE_CALENDAR: 'INITIALIZE_CALENDAR',
  SET_DATES_SELECTED: 'SET_DATES_SELECTED',
  SET_FIELDS_SELECTED: 'SET_FIELDS_SELECTED',
  UPDATE_FROM_SERVER_INIT: 'UPDATE_FROM_SERVER_INIT',
  UPDATE_FROM_SERVER_SUCCESS: 'UPDATE_FROM_SERVER_SUCCESS',
  UPDATE_FROM_SERVER_FAILURE: 'UPDATE_FROM_SERVER_FAILURE',
  UPDATE_SERVER_INIT: 'UPDATE_SERVER_INIT',
  UPDATE_SERVER_SUCCESS: 'UPDATE_SERVER_SUCCESS',
  UPDATE_SERVER_FAILURE: 'UPDATE_SERVER_FAILURE',
  RESET_SERVER_STATE_INIT: 'RESET_SERVER_STATE_INIT',
})

//initial blank slate
export const calendarStore = {
  calendars: [
    {
      id: uuid(),
      name: 'all',
      datesSelected: [],
      fields: [],
    },
  ],
  loading: false,
  initialLoading: true,
  error: {
    isError: false,
    message: null,
  },
}

export const CalendarReducer = (state = calendarStore, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CalendarActionTypes.UPDATE_SERVER_INIT:
      case CalendarActionTypes.RESET_SERVER_STATE_INIT:
      case CalendarActionTypes.UPDATE_FROM_SERVER_INIT:
        draft.error.isError = false
        draft.error.isError = false
        draft.error.message = null
        draft.loading = true
        return draft
      case CalendarActionTypes.UPDATE_FROM_SERVER_FAILURE:
      case CalendarActionTypes.UPDATE_SERVER_FAILURE:
        draft.loading = false
        draft.initialLoading = false
        draft.error.message = action.payload.message
        draft.error.isError = true
        return draft
      case CalendarActionTypes.UPDATE_SERVER_SUCCESS:
      case CalendarActionTypes.UPDATE_FROM_SERVER_SUCCESS:
        //action.payload is the server state
        draft.loading = false
        draft.initialLoading = false
        draft.error.isError = false
        draft.error.message = null
        draft.calendars = action.payload
        return draft
      case CalendarActionTypes.INITIALIZE_CALENDAR:
        draft.loading = false
        draft.initialLoading = false
        draft.error.isError = false
        draft.error.message = null
        draft.calendars = action.payload
        return draft
      case CalendarActionTypes.CREATE_CAL_TYPE:
        // action.payload.name: string
        draft.calendars.push({
          id: uuid(),
          name: action.payload.name,
          datesSelected: [],
          fields: action.payload.fields,
        })
        return draft
      case CalendarActionTypes.SET_DATES_SELECTED:
        const { name, datesSelected } = action.payload
        // action.payload.name: string; action.payload.datesSelected: Array<DatesSelected>
        if (draft.calendars.find((obj) => obj.name === name)) {
          draft.calendars.find(
            (obj) => obj.name === name,
          ).datesSelected = datesSelected
        }
        return draft
      case CalendarActionTypes.SET_FIELDS_SELECTED:
        const { name: calType, fieldsSelected } = action.payload
        // action.payload.name: string; action.payload.datesSelected: Array<DatesSelected>
        if (draft.calendars.find((obj) => obj.name === calType)) {
          draft.calendars.find(
            (obj) => obj.name === calType,
          ).fields = fieldsSelected
        }
        return draft
      default:
        return draft
    }
  })
