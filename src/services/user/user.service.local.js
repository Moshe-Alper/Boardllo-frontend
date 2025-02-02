import { storageService } from '../async-storage.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const LOCAL_STORAGE_KEY = 'guestUser'

export const userService = {
  login,
  logout,
  signup,
  getUsers,
  getById,
  remove,
  update,
  getLoggedinUser,
  updateUserImg,
  updateUserName,
  handleGuestAccess,
}

function getUsers() {
  return storageService.query('user')
}

async function getById(userId) {
  return await storageService.get('user', userId)
}

async function remove(userId) {
  return storageService.get('user', userId)
    .then(user => {
      if (user.username === 'default_user') {
        return storageService.remove('user', userId)
      }
      return Promise.reject('Not default user')
    })
}

async function update({ _id}) {
  const user = await storageService.get('user', _id)
  await storageService.put('user', user)

  const loggedinUser = getLoggedinUser()
  if (loggedinUser._id === user._id) _saveLocalUser(user)

  return user
}

async function login(userCred) {
  const users = await storageService.query('user')
  const user = users.find((user) => user.username === userCred.username)

  if (user) return _saveLocalUser(user)
}

async function signup(userCred) {
  if (!userCred.imgUrl) userCred.imgUrl = ''

  const user = await storageService.post('user', userCred)
  return _saveLocalUser(user)
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function _saveLocalUser(user) {
  user = {
    _id: user._id,
    fullname: user.fullname,
    imgUrl: user.imgUrl,
    isAdmin: user.isAdmin
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
  return user
}

async function updateUserImg(userCred) {
  const updatedUser = await storageService.put('user', userCred)
  return _saveLocalUser(updatedUser)
}

async function updateUserName(userCred) {
  const updatedUser = await storageService.put('user', userCred)
  return _saveLocalUser(updatedUser)
}

// To quickly create an admin user, uncomment the next line
// _createAdmin()
async function _createAdmin(userCred) {
  const user = {
    username: 'admin',
    password: 'admin',
    fullname: 'Mustafa Adminsky',
    imgUrl: '',
    isAdmin: true
  }

  const newUser = await storageService.post('user', userCred)
  console.log('newUser: ', newUser)
}


export async function handleGuestAccess(user) {
  try {
      const guestUser = {
          username: 'default_user',
          password: '123',
          fullname: 'guest',
      }

      if (!user) {
          const newUser = await signup(guestUser)
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser))
          return newUser
      } 
      else if (user.username === 'default_user') {
          await remove(user._id)
          localStorage.removeItem(LOCAL_STORAGE_KEY)
          sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
      }
  } catch (err) {
      console.error('Cannot handle guest user:', err)
      throw err
  }
}

export function isGuestUser() {
  const user = JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
  return user?.username === 'default_user'
}