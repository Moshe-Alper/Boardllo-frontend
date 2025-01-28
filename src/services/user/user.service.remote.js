import { httpService } from '../http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

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
    updateUserName
}

function getUsers() {
    return httpService.get(`user`)
}

async function getById(userId) {
    return await httpService.get(`user/${userId}`)
}

function remove(userId) {
    return httpService.delete(`user/${userId}`)
}

async function update({ _id, ...userFields }) {
    const user = await httpService.put(`user/${_id}`, userFields)
    const loggedinUser = getLoggedinUser()
    if (loggedinUser._id === user._id) _saveLocalUser(user)
    return user
}

async function login(userCred) {
    try {
        const user = await httpService.post('auth/login', userCred)
        if (user) return _saveLocalUser(user)
    } catch (err) {
        throw new Error('Invalid username or password')
    }
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://res.cloudinary.com/your-default-image'
    try {
        const user = await httpService.post('auth/signup', userCred)
        return _saveLocalUser(user)
    } catch (err) {
        if (err.response?.status === 400) {
            throw new Error('Username already exists or invalid input')
        }
        throw err
    }
}

async function logout() {
    try {
        await httpService.post('auth/logout')
        sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    } catch (err) {
        console.error('Failed to logout:', err)
    }
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function _saveLocalUser(user) {
    const miniUser = {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        isAdmin: user.isAdmin
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(miniUser))
    return miniUser
}

async function updateUserImg(userCred) {
    try {
        const user = await httpService.put(`user/${userCred._id}/img`, {
            imgUrl: userCred.imgUrl
        })
        return _saveLocalUser(user)
    } catch (err) {
        console.error('Failed to update user image:', err)
        throw err
    }
}

async function updateUserName(userCred) {
    try {
        const user = await httpService.put(`user/${userCred._id}/fullname`, {
            fullname: userCred.fullname
        })
        return _saveLocalUser(user)
    } catch (err) {
        console.error('Failed to update username:', err)
        throw err
    }
}