// Theme change
const themeToggle = document.getElementById('themeButton')
const themeImage = document.getElementById('themeImg')
const sunImgPath = '/images/sunThemeImg.png'
const moonImgPath = '/images/moonThemeImg.png'

const updateTheme = () => {
    if (document.documentElement.classList.contains('darkTheme')) {
        themeImage.src = moonImgPath
    } else {
        themeImage.src = sunImgPath
    }
}


themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('darkTheme')
    let currentTheme
    if (document.documentElement.classList.contains('darkTheme')) {
        currentTheme = 'dark'
    } else {
        currentTheme = 'light'
    }
    localStorage.setItem('theme', currentTheme)
    updateTheme()
})

updateTheme()

// Language change
document.addEventListener('DOMContentLoaded', () => {
    let savedLang = localStorage.getItem('language')
    if (!savedLang) {
        const browserLang = navigator.language.split('-')[0]
        if (translations[browserLang]) {
            savedLang = browserLang
        } else {
            savedLang = 'en'
        }
        localStorage.setItem('language', savedLang)
    }
    setLanguage(savedLang)
})


const changeLangButton = document.querySelectorAll('.langOption')

changeLangButton.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault()
        const selectedLang = button.dataset.lang
        setLanguage(selectedLang)
        localStorage.setItem('language', selectedLang)
        langMenu.classList.toggle('show')
    })
})

// Language Menu
const langButton = document.getElementById('langButton')
const langMenu = document.getElementById('langMenu')

langButton.addEventListener('click', () => {
    langMenu.classList.toggle('show')
})


document.addEventListener('click', (event) => {
    if (langMenu && langMenu.classList.contains('show') &&
        !langButton.contains(event.target) &&
        !langMenu.contains(event.target)) {
        langMenu.classList.remove('show')
    }
})

// Changing sign up to login

const signUpBut = document.getElementById('signUpBut')
const loginBut = document.getElementById('loginBut')
const signUpDiv = document.getElementById('signUpDiv')
const loginDiv = document.getElementById('loginDiv')

signUpBut.addEventListener('click', () => {
    if (signUpBut.classList.contains('active')) {
        return
    }

    signUpBut.classList.add('active')
    loginBut.classList.remove('active')
    signUpDiv.classList.add('show')
    loginDiv.classList.remove('show')
})

loginBut.addEventListener('click', () => {
    if (loginBut.classList.contains('active')) {
        return
    }

    loginBut.classList.add('active')
    signUpBut.classList.remove('active')
    signUpDiv.classList.remove('show')
    loginDiv.classList.add('show')
})

// Registration logic

const registerBut = document.querySelector('#signUpDiv .accountBut2')
const regLoginInput = document.getElementById('accountNameSignUp')
const regPassInput = document.getElementById('accountPasswordSignUp')

registerBut.addEventListener('click', async () => {
    const login = regLoginInput.value.trim()
    const password = regPassInput.value.trim()

    regLoginInput.classList.remove('error')
    regPassInput.classList.remove('error')

    if (!login || !password) {
        if (!login) showInputError(regLoginInput)
        if (!password) showInputError(regPassInput)
        return
    }

    try {
        const responce = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({login, password})
        })

        const result = await responce.json()

        if (responce.ok) {
            localStorage.setItem('nutriUserId', result.userId)
            localStorage.setItem('nutriUserLogin', login)

            console.log('Registration successful')

            window.location.href = 'calculator.html'
        } else {
            if (responce.status === 400) {
                showInputError(regLoginInput)
            } else console.log(result.message)
        }
    } catch (error) {
        console.error(error)
    }
})

// Login logic

const loginButStart = document.querySelector('#loginDiv .accountBut2')
const logLoginInput = document.getElementById('accountNameLogin')
const logPassInput = document.getElementById('accountPasswordLogin')

loginButStart.addEventListener('click', async () => {
    const login = logLoginInput.value.trim()
    const password = logPassInput.value.trim()

    regLoginInput.classList.remove('error')
    regPassInput.classList.remove('error')

    if (!login || !password) {
        if (!login) showInputError(regLoginInput)
        if (!password) showInputError(regPassInput)
        return
    }

    try {
        const responce = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({login, password})
        })

        const result = await responce.json()

        if (responce.ok) {
            localStorage.setItem('nutriUserId', result.userId)
            localStorage.setItem('nutriUserLogin', login)

            console.log('Registration successful')

            window.location.href = 'calculator.html'
        } else {
            if (responce.status === 401) {
                showInputError(logLoginInput)
                showInputError(logPassInput)
            }
        }
    } catch (error) {
        console.error(error)
    }
})

function showInputError(inputElement) {
    inputElement.classList.add('error')

    inputElement.addEventListener('input', () => {
        inputElement.classList.remove('error')
    }, {once: true})
}