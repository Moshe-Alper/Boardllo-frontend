const { DEV, VITE_LOCAL } = import.meta.env

import { userService as local } from './user.service.local'
import { userService as remote } from './user.service.remote'


function getEmptyUser() {
  return user = {
    username: '',
    password: '',
    fullname: '',
    imgUrl
  }
  return user
}
  
const service = VITE_LOCAL === 'true' ? local : remote
export const userService = { ...service, getEmptyUser }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.userService = userService