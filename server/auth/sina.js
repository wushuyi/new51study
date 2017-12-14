import { getOrigin } from 'server/utils'
import request from 'superagent'

import includes from 'lodash/includes'
import each from 'lodash/each'
import { authError, xhrError } from './errors'
import { getQQaccessTokenUrl, getQQOpenIdUrl, otherLogin } from 'server/auth/api'
import differenceInMilliseconds from 'date-fns/difference_in_milliseconds'

const auth = authSetting