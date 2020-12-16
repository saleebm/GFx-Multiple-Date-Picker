import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import { setFieldsSelectedAction } from '../../store/modules/calendar/action/calendar-actions'
import { dateFields } from '../../utils/API'
import { useClasses } from '../Settings'

const mapStateToProps = (state) => ({
  calendars: state.calendarReducer.calendars,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setFieldsSelected: setFieldsSelectedAction,
    },
    dispatch,
  )

export const FieldsSelectedCheckbox = connect(
  mapStateToProps,
  mapDispatchToProps,
)(({ calendars, registration, setFieldsSelected }) => {
  const classes = useClasses()

  const currentCalendarIndex = calendars.findIndex(
    (cal) => cal['name'] === registration,
  )
  const { fields: defaultValuesSelected } = calendars[currentCalendarIndex]

  async function handleSelect(checkedName) {
    const updatedChoices = defaultValuesSelected?.includes(checkedName)
      ? defaultValuesSelected?.filter((name) => name !== checkedName)
      : [...(defaultValuesSelected ?? []), checkedName]
    await setFieldsSelected(registration, updatedChoices)
  }

  return (
    <Grid
      className={classes.fieldsSelectedRoot}
      container
      alignItems={'flex-start'}
      justify={'center'}
    >
      <Grid item xs={12}>
        <Typography variant={'h4'}>
          Set fields to enable for context: {registration}
        </Typography>
      </Grid>
      <Grid className={classes.checkboxGridItem} item xs={12}>
        <FormControl component={'fieldset'} className={classes.formControl}>
          <FormLabel
            className={classes.formLabelHeading}
            color={'primary'}
            component={'legend'}
          >
            <Typography variant={'h5'} component={'span'}>
              Assign date fields to forms:
            </Typography>
          </FormLabel>
          {Array.isArray(dateFields) &&
            dateFields.map((formGroup) => (
              <FormGroup
                className={classes.formDateFieldGroup}
                key={formGroup.label}
              >
                <FormLabel className={classes.formLabel} component={'label'}>
                  {formGroup.label}
                </FormLabel>
                {!!formGroup.choices &&
                  Array.isArray(formGroup.choices) &&
                  formGroup.choices.map(({ value, label }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={defaultValuesSelected.includes(value)}
                          name={value}
                          onChange={() => handleSelect(value)}
                        />
                      }
                      key={value}
                      label={label}
                      value={value}
                    />
                  ))}
              </FormGroup>
            ))}
        </FormControl>
      </Grid>
    </Grid>
  )
})
