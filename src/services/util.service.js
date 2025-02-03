export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

export function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}


export function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

export function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout)
    }
}

export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

export function getDueStatus(dueDate) {
    if (!dueDate) return { status: 'none', text: '' }

    const date = new Date(dueDate)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const timeDiff = date.getTime() - now.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

    let text
    if (date.toDateString() === today.toDateString()) {
        text = 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
        text = 'Tomorrow'
    } else {
        const month = date.toLocaleString('default', { month: 'short' })
        const day = date.getDate()
        text = `${month} ${day}`
    }

    let status
    if (daysDiff < 0) {
        status = 'past-due'
    } else if (daysDiff <= 1) {
        status = 'due-soon'
    } else {
        status = 'on-track'
    }

    return { status, text }
}

export function formatDueDate(date) {
    if (!date) return ''
    
    const dueDate = new Date(date)
    const { text } = getDueStatus(date)
    
    const timeString = dueDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit'
    })
    
    return `${text} at ${timeString}`
}