let calendarData = {}

// Downloading data 

async function fetchData() {
    const userId = localStorage.getItem('nutriUserId')
    if (!userId) {
        window.location.href = 'account.html'
        return
    }

    try {
        const responce = await fetch(`http://localhost:3000/api/data/${userId}/calendar`)
        calendarData = await responce.json()

        console.log('Calendar data loaded')

        renderCalendar(currentYear, currentMonth)
    } catch (error) {
        console.error(error)
    }
}
// Creating days

const monthTitles = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'],
    uk: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень',
    'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень']
}
const weekTextTranslation = {
    en: "Result for week",
    uk: "Результат за тиждень"
}
const dayStats = document.getElementById('calendarDayStatsDiv')

let today = new Date()
let savedYear = localStorage.getItem('calendarYear')
let savedMonth = localStorage.getItem('calendarMonth')

let currentMonth
let currentYear
let currentDate = today.getDate()
let activeDayKey = null

if (savedYear !== null && savedMonth !== null) {
    currentYear = parseInt(savedYear, 10)
    currentMonth = parseInt(savedMonth, 10)
} else {
    currentYear = today.getFullYear()
    currentMonth = today.getMonth()
}

function renderCalendar(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const startDayIndex = (firstDayOfMonth + 6) % 7

    const statisticDiv = document.getElementById('calendarStatistic')
    const divMainDays = document.getElementById('calendarGrid')
    const title = document.getElementById('title')
    const currentLanguage = localStorage.getItem('language')

    const months = monthTitles[currentLanguage] || monthTitles['en']

    statisticDiv.innerHTML = ''
    divMainDays.innerHTML = ''
    title.textContent = `${months[month]} ${year}`

    for (let i = 0; i < startDayIndex; i++) {
        const emptyDiv = document.createElement('div')
        emptyDiv.classList.add('calendarDay', 'empty')
        divMainDays.appendChild(emptyDiv)
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('button')
        dayElement.classList.add('calendarDay')
        dayElement.textContent = day

        const dateKey = `nutriCost${year}-${month}-${day}`
        const dataForDay = calendarData[dateKey]

        if (dataForDay) {
            dayElement.classList.add('hasData')
        }

        if (day === currentDate && month === today.getMonth() && year === today.getFullYear()) {
            dayElement.classList.add('today')
        }

        dayElement.addEventListener('click', (event) => {
            event.stopPropagation()

            const clickedBut = event.currentTarget

            if (dayStats.classList.contains('show') && activeDayKey === dateKey) {
                dayStats.classList.remove('show')
                activeDayKey = null
            } else {
                showDayStats(dateKey, day, month, year)

                const rect = clickedBut.getBoundingClientRect()
                dayStats.style.top = `${rect.top + window.scrollY - 160}px`
                dayStats.style.left = `${rect.right + window.scrollX + 5}px`

                dayStats.classList.add('show')

                activeDayKey = dateKey
            }
        })

        divMainDays.appendChild(dayElement)
    }
        const totalCells = startDayIndex + daysInMonth
        const numWeeks = Math.ceil(totalCells / 7)

        for (let index = 0; index < numWeeks; index++ ) {
            const firstDayOfWeek = (index * 7) - startDayIndex + 1
            const lastDayOfWeek = firstDayOfWeek + 6
            const hasRealDays = (firstDayOfWeek <= daysInMonth && lastDayOfWeek >= 1)

            if (hasRealDays) {
                const weekButton = document.createElement('button')
                weekButton.classList.add('weekStatBut')
                const weekLabel = weekTextTranslation[currentLanguage] || weekTextTranslation['en']

                weekButton.textContent = `${weekLabel} ${index + 1}`

                const weekKey = `week ${index}`

                weekButton.addEventListener('click', (event) => {
                    event.stopPropagation()

                    const clickedBut = event.currentTarget
                    if (dayStats.classList.contains('show') && activeDayKey === weekKey) {
                        dayStats.classList.remove('show')
                        activeDayKey = null
                    } else {
                        showWeekStats(year, month, index, startDayIndex, daysInMonth)

                        const rect = clickedBut.getBoundingClientRect()

                        dayStats.style.top = `${rect.top + window.scrollY - 160}px`
                        dayStats.style.left = `${rect.right + window.scrollX + 5}px`

                        dayStats.classList.add('show')

                        activeDayKey = `week ${index}`
                    }
                })

                statisticDiv.appendChild(weekButton)
            } else {
                const emptyWeekDiv = document.createElement('div')
                emptyWeekDiv.classList.add('emptyWeek')
                statisticDiv.appendChild(emptyWeekDiv)
            }
        }
}

function showDayStats(dateKey, day, month, year) {
    const dayWeightSpan = document.getElementById('calendarDayWeightResult')
    const dayProteinsSpan = document.getElementById('calendarDayProteinsResult')
    const dayFatsSpan = document.getElementById('calendarDayFatsResult')
    const dayCarbohydratesSpan = document.getElementById('calendarDayCarbohydratesResult')
    const dayCaloriesSpan = document.getElementById('calendarDayCaloriesResult')
    const dayCostSpan = document.getElementById('calendarDayCostResult')

    const dayDataJSON = calendarData[dateKey] || {
        calories: 0, proteins: 0, fats: 0, carbohydrates: 0, weight: 0, cost: 0
    }

    dayWeightSpan.textContent = dayDataJSON.weight.toFixed(2)
    dayProteinsSpan.textContent = dayDataJSON.proteins.toFixed(2)
    dayFatsSpan.textContent = dayDataJSON.fats.toFixed(2)
    dayCarbohydratesSpan.textContent = dayDataJSON.carbohydrates.toFixed(2)
    dayCaloriesSpan.textContent = dayDataJSON.calories.toFixed(2)
    dayCostSpan.textContent = dayDataJSON.cost.toFixed(2)
}

function showWeekStats(year, month, index, startDayIndex, daysInMonth) {
    let weekData = {
        calories: 0,
        proteins: 0,
        fats: 0,
        carbohydrates: 0,
        weight: 0,
        cost: 0
    }

    for (let i = 0; i < 7; i++) {
        const day = (index * 7) + i - startDayIndex + 1

        if (day >= 1 && day <= daysInMonth) {
            const dateKey = `nutriCost${year}-${month}-${day}`
            const dayData = calendarData[dateKey]

            if(dayData) {
                weekData.calories += dayData.calories || 0
                weekData.proteins += dayData.proteins || 0
                weekData.fats += dayData.fats || 0
                weekData.carbohydrates += dayData.carbohydrates || 0
                weekData.weight += dayData.weight || 0
                weekData.cost += dayData.cost || 0
            }
        }
    }

    const dayWeightSpan = document.getElementById('calendarDayWeightResult')
    const dayProteinsSpan = document.getElementById('calendarDayProteinsResult')
    const dayFatsSpan = document.getElementById('calendarDayFatsResult')
    const dayCarbohydratesSpan = document.getElementById('calendarDayCarbohydratesResult')
    const dayCaloriesSpan = document.getElementById('calendarDayCaloriesResult')
    const dayCostSpan = document.getElementById('calendarDayCostResult')

    dayWeightSpan.textContent = weekData.weight.toFixed(2)
    dayProteinsSpan.textContent = weekData.proteins.toFixed(2)
    dayFatsSpan.textContent = weekData.fats.toFixed(2)
    dayCarbohydratesSpan.textContent = weekData.carbohydrates.toFixed(2)
    dayCaloriesSpan.textContent = weekData.calories.toFixed(2)
    dayCostSpan.textContent = weekData.cost.toFixed(2)
}

document.addEventListener('click', (event) => {
    const clickOnStats = event.target.closest('#calendarDayStatsDiv')

    if (!clickOnStats) {
        dayStats.classList.remove('show')
        activeDayKey = null
    }
})

document.addEventListener('click', (event) => {
    if (event.target.closest('.langOption')) {
        setTimeout (() => {
            renderCalendar(currentYear, currentMonth)
        }, 50)
    }
})

// Changing months

const leftBut = document.getElementById('monthButLeft')
const rightBut = document.getElementById('monthButRight')

rightBut.addEventListener('click', () => {
    if (currentMonth === 11) {
        currentMonth = 0
        currentYear++
    } else {
        currentMonth++
    }

    localStorage.setItem('calendarYear', currentYear)
    localStorage.setItem('calendarMonth', currentMonth)

    dayStats.classList.remove('show')
    renderCalendar(currentYear, currentMonth)
})

leftBut.addEventListener('click', () => {

    if (currentMonth === 0) {
        currentMonth = 11
        currentYear--
    } else {
        currentMonth--
    }

    localStorage.setItem('calendarYear', currentYear)
    localStorage.setItem('calendarMonth', currentMonth)

    dayStats.classList.remove('show')
    renderCalendar(currentYear, currentMonth)
})

fetchData()