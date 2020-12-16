import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import ArrowForward from '@material-ui/icons/ArrowForward'
import Typography from '@material-ui/core/Typography'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import { dateFields } from '../../utils/API'
import {
  createCalTypeAction,
  resetServerCalendarsAction,
} from '../../store/modules/calendar/action/calendar-actions'

const mapStateToProps = (state) => ({
  calendars: state.calendarReducer.calendars,
  loading: state.calendarReducer.loading,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      resetCalendars: resetServerCalendarsAction,
      createCalendar: createCalTypeAction,
    },
    dispatch,
  )

export const useClasses = makeStyles((theme) => ({
  fieldsSelectedRoot: {
    marginTop: theme.spacing(3),
  },
  checkboxGridItem: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
    width: '100%',
    display: 'flex',
    flexFlow: 'row wrap',
  },
  formLabelHeading: {
    flexBasis: '100%',
    width: '100%',
  },
  input: {
    height: '70px',
    '& input': {
      height: '100%',
    },
  },
  formLabel: {
    ...theme.typography.h5,
    fontVariant: 'small-caps',
    padding: '0.5rem',
    flex: '0 1 auto',
  },
  formDateFieldGroup: {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.primary.main}`,
    margin: `${theme.spacing(3)}px ${theme.spacing(1)}px`,
    padding: theme.spacing(3),
    borderRadius: '7px',
  },
  createCalForm: {
    flexGrow: 1,
    flexBasis: '100%',
    position: 'relative',
  },
  resetForm: {
    flexShrink: 1,
    flexBasis: '100%',
    position: 'relative',
  },
  container: {
    paddingTop: theme.spacing(2),
    height: '100%',
    minHeight: '100vh',
    position: 'relative',
  },
}))

export const Settings = connect(
  mapStateToProps,
  mapDispatchToProps,
)(function ({ resetCalendars, createCalendar, calendars, loading }) {
  const classes = useClasses()
  const {
    errors: createCalendarErrors,
    handleSubmit: handleCreateCalendarSubmit,
    register: registerCreateCalendar,
  } = useForm({ reValidateMode: 'onBlur', mode: 'onBlur' })
  const history = useHistory()

  const resetServerCalendars = () => {
    const confirmation = window.confirm(
      'Are you sure? This will reset all contexts.',
    )
    if (confirmation) resetCalendars()
  }

  const createCalendarSubmission = handleCreateCalendarSubmit(
    async ({ calendarName, ...rest }) => {
      const inputCheckboxValues = Array.of({ ...rest })
      let formFieldsToBlock = []
      if (Array.isArray(inputCheckboxValues)) {
        for await (const group of inputCheckboxValues) {
          for (const formLabel in group) {
            if (group.hasOwnProperty(formLabel) && group[formLabel]) {
              formFieldsToBlock = Array.from([
                ...formFieldsToBlock,
                group[formLabel],
              ])
            }
          }
        }
      }
      formFieldsToBlock = [...new Set(formFieldsToBlock)]
      try {
        await createCalendar(calendarName, formFieldsToBlock)
        history.push(`/${calendarName}`)
      } catch (e) {
        console.error(e)
      }
    },
  )

  const getCalendarNameHelper = useCallback(() => {
    if (
      !!createCalendarErrors.calendarName &&
      'type' in createCalendarErrors.calendarName &&
      !createCalendarErrors.calendarName.message
    ) {
      switch (createCalendarErrors.calendarName.type) {
        case 'alreadyExists':
          return 'calendar already exist'
        case 'lettersAndNumbers':
          return 'Must be letters, numbers, underscores, and spaces only'
        default:
          return 'You broke it!'
      }
    } else {
      return undefined
    }
  }, [createCalendarErrors.calendarName])

  const alreadyExistsInCalendar = (value) =>
    calendars.every((cal) => cal.name.toLowerCase() !== value.toLowerCase())

  return (
    <Grid
      alignItems={'flex-start'}
      justify={'center'}
      container
      spacing={3}
      className={classes.container}
    >
      <Grid className={classes.createCalForm} item xs={12}>
        <Grid
          onSubmit={createCalendarSubmission}
          component={'form'}
          container
          spacing={3}
          alignItems={'flex-start'}
          justify={'flex-start'}
        >
          <Grid item xs={12}>
            <Typography variant={'h1'} gutterBottom>
              Create new calendar context.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              size={'medium'}
              inputMode={'text'}
              type={'text'}
              label={'Name for new calendar context:'}
              inputRef={registerCreateCalendar({
                required: { value: true, message: 'Required' },
                validate: {
                  alreadyExists: alreadyExistsInCalendar,
                  lettersAndNumbers: (value) =>
                    /^[\w ]*[^\W_][\w ]*$/.test(value),
                },
              })}
              required
              name={'calendarName'}
              autoComplete={'email'}
              variant={'filled'}
              fullWidth
              error={!!createCalendarErrors.calendarName}
              helperText={getCalendarNameHelper()}
              inputProps={{
                className: classes.input,
              }}
            />
          </Grid>
          <Grid className={classes.checkboxGridItem} item xs={12}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel
                className={classes.formLabelHeading}
                color={'primary'}
                component="legend"
              >
                <Typography variant={'h4'} component={'span'}>
                  Assign date fields
                </Typography>
              </FormLabel>
              {dateFields &&
                Array.isArray(dateFields) &&
                dateFields.map((formGroup) => (
                  <FormGroup
                    className={classes.formDateFieldGroup}
                    key={formGroup.label}
                  >
                    <FormLabel
                      className={classes.formLabel}
                      component={'label'}
                    >
                      {formGroup.label}
                    </FormLabel>
                    {!!formGroup.choices &&
                      Array.isArray(formGroup.choices) &&
                      formGroup.choices.map(({ value, label }) => (
                        <FormControlLabel
                          key={value}
                          control={
                            <Checkbox
                              name={value}
                              value={value}
                              defaultValue={false}
                            />
                          }
                          inputRef={registerCreateCalendar}
                          value={value}
                          label={label}
                        />
                      ))}
                  </FormGroup>
                ))}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              size={'large'}
              variant={'contained'}
              aria-disabled={loading}
              type={'submit'}
              disabled={loading}
              color={'primary'}
              fullWidth
              endIcon={
                loading ? (
                  <CircularProgress variant={'indeterminate'} size={16} />
                ) : (
                  <ArrowForward />
                )
              }
            >
              {loading ? 'Loading' : 'Create'}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid className={classes.resetForm} item xs={12}>
        <Typography gutterBottom variant={'body1'}>
          Use this button to initialize calendars first time or reset all
          calendars to initial state.
        </Typography>
        <Button
          title={'Reset calendars'}
          type={'button'}
          name={'reset-calendars'}
          onClick={resetServerCalendars}
          variant={'contained'}
          size={'large'}
          fullWidth
        >
          Reset/Initialize Calendars
        </Button>
      </Grid>
    </Grid>
  )
})
