import { combineReducers } from 'redux'
import { CalendarReducer } from './calendar/reducer/calendar-store'

export const rootReducer = combineReducers({
  calendarReducer: CalendarReducer,
})
