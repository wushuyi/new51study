import request from 'superagent'
import { APIService, APIVersion } from 'config/settings'
import xhrCrypto from 'utils/xhrCrypto'
import { needAuthError, baseChcek } from '../utils/error'

