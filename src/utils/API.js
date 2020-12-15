import axios from 'axios'
import https from 'https'

const { gfx_multidateselector_runtime_script_strings } = window
const {
  api_url,
  api_nonce,
  date_fields,
} = gfx_multidateselector_runtime_script_strings

export const dateFields = date_fields

export default axios.create({
  baseURL: api_url,
  credentials: 'same-origin',
  headers: {
    Accept: 'application/json',
    'Content-type': 'application/json',
    'X-WP-Nonce': api_nonce,
  },
  httpsAgent: new https.Agent({ keepAlive: true }),
})
