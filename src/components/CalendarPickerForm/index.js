import React from 'react'
import PropTypes from 'prop-types'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { FieldsSelectedCheckbox } from '../FieldsSelectedCheckbox'
import { Calendar } from '../Calendar'
import { Loadable } from '../../utils/Loadable'

export const CalendarPickerForm = ({ match }) => {
  // the current router path
  // registration = calendar name
  const { registration } = match.params

  return (
    <Container maxWidth={false}>
      <Loadable>
        <Calendar registration={registration} />
      </Loadable>
      {registration !== 'all' ? (
        <FieldsSelectedCheckbox registration={registration} />
      ) : (
        <Typography variant={'subtitle2'}>
          The 'ALL' context affects all calendars selected in every other
          context type.
        </Typography>
      )}
    </Container>
  )
}

CalendarPickerForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      registration: PropTypes.string,
    }),
  }).isRequired,
}
