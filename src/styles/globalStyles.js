import { createGlobalStyle } from '@xstyled/styled-components'

// noinspection CssInvalidPropertyValue
export const GlobalStyle = createGlobalStyle`
  .coptix-container{
    max-width: 1200px;
    min-height: 100vh;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  .coptix-datepicker {
    margin: 7px auto;
  }
  .DayPicker-Day--disabled:not(.DayPicker-Day--outside){
    background-color: dark;
    opacity: 0.7;
    color: light;
  }
  .gf_admin_page_title {
    position: absolute;
    white-space: nowrap;
    width: 1px;
    height: 1px;
    overflow: hidden;
    border: 0;
    padding: 0;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    margin: -1px;
  }
`
