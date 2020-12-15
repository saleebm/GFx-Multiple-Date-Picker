import {
  responsiveFontSizes,
  unstable_createMuiStrictModeTheme,
} from '@material-ui/core/styles'

export const muiTheme = responsiveFontSizes(
  unstable_createMuiStrictModeTheme({
    palette: {
      type: 'light',
    },
    unstable_strictMode: true,
  }),
)
