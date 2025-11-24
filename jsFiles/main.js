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

// Scroll
const scrollToCalculator = () => {
    const section = document.getElementById('featuresCalculator')
    section.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    })
}

const scrollToComparator = () => {
    const section = document.getElementById('featuresComparator')
    section.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    })
}

const scrollToCalendar = () => {
    const section = document.getElementById('featuresCalendar')
    section.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    })
}


// Animations
const fastanimate = document.querySelectorAll('.fastanimate')
const slowanimate = document.querySelectorAll('.slowanimate')
const fruitAnim = document.querySelectorAll('.finalActionImg')

const fastobserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active')
        }
    })
}, {
    threshold: 0.6
})

const slowobserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active')
        }
    })
}, {
    threshold: 0.7
})

const fruitobserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active')
        }
    })
}, {
    threshold: 0.39
})

fastanimate.forEach(el => fastobserver.observe(el))
slowanimate.forEach(el => slowobserver.observe(el))
fruitAnim.forEach(el => fruitobserver.observe(el))


//Videoplayer
const allFeaturesBlocks = document.querySelectorAll('.featuresDivAll')

allFeaturesBlocks.forEach(showcase => {

  const buttons = showcase.querySelectorAll('.featuresBut')
  const videos = showcase.querySelectorAll('.featuresVideo')

  buttons.forEach(button => {
    button.addEventListener('click', () => {

    if (button.classList.contains('active')) {
      return; 
    }

    const targetVideoId = button.dataset.target

    videos.forEach(video => {
      video.classList.remove('active')
    })

    const targetVideo = document.getElementById(targetVideoId)
    
    if (targetVideo) {
      targetVideo.currentTime = 0;
      targetVideo.play();
      targetVideo.classList.add('active')
    }
    
    buttons.forEach(btn => btn.classList.remove('active'))
    button.classList.add('active')
    })
  })
})

// Start buttons logic

const startNowBut1 = document.querySelector('.heroBut1')
const startNowBut2 = document.querySelector('.conceptionBut1')
const startNowBut3 = document.querySelector('.finalActionBut')

if (startNowBut1) {
    startNowBut1.addEventListener('click', () => {
    const userId = localStorage.getItem('nutriUserId')

    if (userId) {
        window.location.href = '/pages/calculator.html'
    } else {
        window.location.href = '/pages/account.html'
    }
    })
}

if (startNowBut2) {
    startNowBut2.addEventListener('click', () => {
    const userId = localStorage.getItem('nutriUserId')

    if (userId) {
        window.location.href = '/pages/calculator.html'
    } else {
        window.location.href = '/pages/account.html'
    }
    })
}

if (startNowBut2) {
    startNowBut3.addEventListener('click', () => {
    const userId = localStorage.getItem('nutriUserId')

    if (userId) {
        window.location.href = '/pages/calculator.html'
    } else {
        window.location.href = '/pages/account.html'
    }
    })
}

// Account menu

const accountBut = document.getElementById('accountButton')
const accountMenu = document.querySelector('.accountDiv')

accountButton.addEventListener('click', () => {
    accountMenu.classList.toggle('show')
})

document.addEventListener('click', (event) => {
    if (accountMenu && accountMenu.classList.contains('show') &&
        !accountBut.contains(event.target) &&
        !accountMenu.contains(event.target)) {
        accountMenu.classList.remove('show')
    }
})

// Log out

const logOutBut = document.querySelector('.accountLogOut')

logOutBut.addEventListener('click', () => {
    localStorage.removeItem('nutriUserId')
    localStorage.removeItem('nutriUserLogin')
    
    window.location.href = '/index.html'
})