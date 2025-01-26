const { DEV, VITE_LOCAL } = import.meta.env

import { userService as local } from './user.service.local'
import { userService as remote } from './user.service.remote'

function getDefaultAvatar(fullname = '') {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname)}&background=7B68EE&color=fff`
}

function getEmptyUser() {
  const user = {
    username: '',
    password: '',
    fullname: '',
  }
  user.imgUrl = getDefaultAvatar(user.fullname)
  return user
}
  
const service = VITE_LOCAL === 'true' ? local : remote
export const userService = { ...service, getEmptyUser, getDefaultAvatar }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.userService = userService