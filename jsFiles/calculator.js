let ingredientsData = {}
let mealsData = {}

// Change meal name when changing language

const mealNameSpan = document.getElementById('calcResultNameOfMeal')

function changeMealNameLanguage() {
    if (!mealNameSpan) return

    const currentText = mealNameSpan.textContent
    const isPlaceholder = currentText === 'Not specified' || currentText === 'Не вказано'

    if (isPlaceholder) {
        const currentLanguage = localStorage.getItem('language') || 'en'
        if (currentLanguage === 'en') {
            mealNameSpan.textContent = 'Not specified'
        } else {
            mealNameSpan.textContent = 'Не вказано'
        }
    }
}

changeMealNameLanguage()

document.addEventListener('click', (event) => {
    if (event.target.closest('.langOption')) {
        setTimeout(() => {
            changeMealNameLanguage()
        }, 50)
    }
})

const nameSaveWindow = document.getElementById('mealSaveWindow')

// database Window Ingredients

const allChooseButtons = document.querySelectorAll('.calcButChoose')
const allDatabaseWindows = document.querySelectorAll('.databaseWindow')

let currentActiveSlot = null

allChooseButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.stopPropagation()
        const form = button.closest('.calcFormName')
        const databaseWindow = form ? form.querySelector('.databaseWindow') : null
        if (!databaseWindow) return

        allDatabaseWindows.forEach(win => {
            if (win !== databaseWindow) {
                win.classList.remove('show')
            }
        })

        if (!databaseWindow.classList.contains('show')) {
            currentActiveSlot = button.dataset.slot

            const listContainer = databaseWindow.querySelector('.databaseList')
            const searchInput = databaseWindow.querySelector('.searchInput')
            if (listContainer) {
                const langToUse = localStorage.getItem('language') || 'en'
                displayItems(listContainer, ingredientsData, langToUse)
            }
            if (searchInput) searchInput.value = ''
            databaseWindow.classList.add('show')
        } else {
            databaseWindow.classList.remove('show')
            currentActiveSlot = null
        }
    })
})

document.addEventListener('click', (event) => {
    if (!event.target.closest('.calcButChoose') && !event.target.closest('.databaseWindow')) {
        allDatabaseWindows.forEach(win => {
            win.classList.remove('show')
        })
        currentActiveSlot = null
    }
})

function displayItems(listContainer, dataObject, lang) {
    listContainer.innerHTML = ''
    const currentLanguage = lang
    for (const key in dataObject) {
        const item = dataObject[key]
        const itemElement = document.createElement('p')
        itemElement.classList.add('databaseItem')
        const displayName = item['name_' + currentLanguage] || item.name_en || item.name_uk || key
        itemElement.textContent = displayName
        itemElement.dataset.key = key
        itemElement.dataset.type = (dataObject === ingredientsData) ? 'ingredient' : 'meal'
        listContainer.appendChild(itemElement)
    }
}

function handleItemSelection(event) {

    const currentLanguage = localStorage.getItem('language')
    
    const itemButton = event.target.closest('.databaseItem')

    const popover = itemButton ? itemButton.closest('.databaseWindow') : null

    if (!itemButton || !popover || currentActiveSlot === null) return

    const selectedKey = itemButton.dataset.key
    const selectedType = itemButton.dataset.type

    let selectedData = null
    if (selectedType === 'ingredient' && ingredientsData[selectedKey]) {
        selectedData = ingredientsData[selectedKey]
    }

    if (!selectedData) return;

    const parentCard = document.getElementById(`calcDivMeal${currentActiveSlot}`)
    if (!parentCard) return

    parentCard.dataset.key = selectedKey

    const nameInput = document.getElementById(`ingredient${currentActiveSlot}Name`)
    const proteinInput = document.getElementById(`ingredient${currentActiveSlot}Proteins`)
    const fatInput = document.getElementById(`ingredient${currentActiveSlot}Fats`)
    const carbInput = document.getElementById(`ingredient${currentActiveSlot}Carbohydrates`)

    const mealNameSpan = document.getElementById('calcResultNameOfMeal')
    if (mealNameSpan) {
        if (currentLanguage === 'en') {
            mealNameSpan.textContent = 'Not specified'
        } else {
            mealNameSpan.textContent = 'Не вказано'
        }
    }

    const displayName = selectedData['name_' + currentLanguage]
    if (nameInput) nameInput.value = displayName
    if (proteinInput) proteinInput.value = selectedData.protein
    if (fatInput) fatInput.value = selectedData.fats
    if (carbInput) carbInput.value = selectedData.carbohydrates

    popover.classList.remove('show')
    currentActiveSlot = null
    saveCalculator()
    calculatingResult()
}

allDatabaseWindows.forEach(popover => {
    const listContainer = popover.querySelector('.databaseList')
    const searchInput = popover.querySelector('.searchInput')

    if (listContainer) {
        listContainer.addEventListener('click', handleItemSelection)
    }

    if (searchInput && listContainer) {
        searchInput.addEventListener('input', (event) => {
            const currentLanguage = localStorage.getItem('language')
            const searchTerm = event.target.value.toLowerCase()
            const filteredData = filterData(searchTerm, currentLanguage)
            displayItems(listContainer, filteredData, currentLanguage)
        })
    }
})

// database Window Meals

const chooseMealBtn = document.getElementById('chooseMealBtn')
const mealDatabaseWindow = document.getElementById('mealDatabaseWindow')
const mealListContainer = mealDatabaseWindow.querySelector('.databaseList')
const mealSearchInput = mealDatabaseWindow.querySelector('.searchInputMeal')
const allCloseButtons = document.querySelectorAll('.calcButMealDel')
let isMealLoading = false

chooseMealBtn.addEventListener('click', (event) => {
    event.stopPropagation()

    if (nameSaveWindow) {
        nameSaveWindow.classList.remove('show');
    }

    const currentLanguage = localStorage.getItem('language')
    displayItems(mealListContainer, mealsData, currentLanguage)

    mealDatabaseWindow.classList.toggle('show')
})

document.addEventListener('click', (event) => {
    if (!event.target.closest('.mealWindow')) {
        mealDatabaseWindow.classList.remove('show')
        }
})

const listContainer = mealDatabaseWindow.querySelector('.databaseList')
const searchInput = mealDatabaseWindow.querySelector('.searchInput')

if (searchInput && listContainer) {
    searchInput.addEventListener('input', (event) => {
        const currentLanguage = localStorage.getItem('language')
        const searchTerm = event.target.value.toLowerCase()
        const filteredData = filterDataMeals(searchTerm, currentLanguage)
        displayItems(listContainer, filteredData, currentLanguage)
    })
}

mealListContainer.addEventListener('click', (event) => {
    const itemButton = event.target.closest('.databaseItem')
    if (!itemButton) return

    const selectedMealKey = itemButton.dataset.key
    const meal = mealsData[selectedMealKey]
    if (!meal) return

    const currentLanguage = localStorage.getItem('language') || 'en'
    const mealName = meal['name_' + currentLanguage] || meal.name_en

    const allMealCards = document.querySelectorAll('.calcDivMeal')

    allMealCards.forEach(card => {
        const inputs = card.querySelectorAll('.calcInput')
        inputs.forEach(input => {
            input.value = ''
        })
    })

    meal.ingredients.forEach((ingredient, index) => {
        const slotId = index + 1
        if (slotId > 3) return

        const card = document.getElementById(`calcDivMeal${slotId}`)
        if (!card) return

        const ingredientKey = ingredient.key
        const ingredientData = ingredientsData[ingredientKey]
        if (!ingredientData) return

        const nameInput = card.querySelector('.calcInput[id*=Name]')
        const proteinInput = card.querySelector('.calcInput[id*=Proteins]')
        const fatsInput = card.querySelector('.calcInput[id*=Fats]')
        const carbohydratesInput = card.querySelector('.calcInput[id*=Carbohydrates]')

        const ingredientName = ingredientData['name_' + currentLanguage] || ingredientData.name_en

        if (nameInput) nameInput.value = ingredientName
        if (proteinInput) proteinInput.value = ingredientData.protein
        if (fatsInput) fatsInput.value = ingredientData.fats
        if (carbohydratesInput) carbohydratesInput.value = ingredientData.carbohydrates

        card.classList.add('add')
        card.dataset.key = ingredientKey
    })

    const resultNameSpan = document.getElementById('calcResultNameOfMeal')
    if (resultNameSpan) resultNameSpan.textContent = mealName

    mealDatabaseWindow.classList.remove('show')
    saveCalculator()

    isMealLoading = true
    calculatingResult()
})


// Search ingredients

function filterData(searchTerm, lang) {
    const filteredResults = {}
    for (const key in ingredientsData) {
        const item = ingredientsData[key]
        const itemName = item['name_' + lang] || item.name_en || key

        if (itemName.toLowerCase().includes(searchTerm)) {
            filteredResults[key] = item
        }
    }
    return filteredResults
}

function filterDataMeals(searchTerm, lang) {
    const filteredResults = {}
    for (const key in mealsData) {
        const item = mealsData[key]
        const itemName = item['name_' + lang] || item.name_en || key

        if (itemName.toLowerCase().includes(searchTerm)) {
            filteredResults[key] = item
        }
    }
    return filteredResults
}

// Saving items

function saveCalculator() {
    const state = []
    const allMeals = document.querySelectorAll('.calcDivMeal')
    
    allMeals.forEach((mealDiv, index) => {
        const slotId = index + 1
        const isOpen = mealDiv.classList.contains('add')
        const values = {}

        const inputs = mealDiv.querySelectorAll('.calcInput')
        inputs.forEach(input => {
            const key = input.id.replace(`ingredient${slotId}`, '').toLowerCase()
            values[key] = input.value
        })
        state.push({id: slotId, isOpen: isOpen, values: values, keys: mealDiv.dataset.key})
    })
    localStorage.setItem('calculatorState', JSON.stringify(state))

    const mealNameSpan = document.getElementById('calcResultNameOfMeal')
    const name = mealNameSpan.textContent
    localStorage.setItem('mealName', name)
}

// Downloading database

const currentUserId = localStorage.getItem('nutriUserId')

if (!currentUserId) {
    window.location.href = 'account.html'
}

async function fetchData() {
    try {
        const ingredientsResponde = await fetch(`http://localhost:3000/api/data/${currentUserId}/ingredients`)
        if (!ingredientsResponde.ok) throw new Error('Failed to load ingredients')
        ingredientsData = await ingredientsResponde.json()

        const mealResponde = await fetch(`http://localhost:3000/api/data/${currentUserId}/meals`)
        if (!mealResponde.ok) throw new Error('Failed to load ingredients')
        mealsData = await mealResponde.json()

        console.log('Databases loaded')

        loadCalculator()
        calculatingResult()
    } catch (error) {
        console.error('Server error', error)
        alert('The server is unavailable. Please run server.js!')
    }
}

// Loading items

function loadCalculator() {
    const savedStateJSON = localStorage.getItem('calculatorState')
    if(!savedStateJSON) return

    try {
        const savedState = JSON.parse(savedStateJSON)
        savedState.forEach(slotState => {
            const mealDiv = document.getElementById(`calcDivMeal${slotState.id}`)
            if(!mealDiv) return

            if(slotState.isOpen) {
                mealDiv.classList.add('add')
            } else {
                mealDiv.classList.remove('add')
            }

            for (const key in slotState.values) {
                const input = mealDiv.querySelector(`#ingredient${slotState.id}${key.charAt(0).toUpperCase() + key.slice(1)}`)
                if (input) {
                    input.value = slotState.values[key]
                }
            }
            if(slotState.keys) {
                mealDiv.dataset.key = slotState.keys
            } else {
                mealDiv.removeAttribute('data-key')
            }
        })
        const name = localStorage.getItem('mealName')
        const mealNameSpan = document.getElementById('calcResultNameOfMeal')
        mealNameSpan.textContent = name
    } catch (error) {
        localStorage.removeItem('calculatorState')
    }
}

// Add ingridients
const addbuttons = document.querySelectorAll('.addButton')
const closebuttons = document.querySelectorAll('.calcButMealDel')

addbuttons.forEach(button => {
    button.addEventListener('click', () => {
        const mealNameSpan = document.getElementById('calcResultNameOfMeal')
        const currentLanguage = localStorage.getItem('language') || 'en'

        if (mealNameSpan) {
            if (currentLanguage === 'en') {
                mealNameSpan.textContent = 'Not specified'
            } else {
                mealNameSpan.textContent = 'Не вказано'
            }
        }
        const parentCard = button.closest('.calcDivMeal')
        if (parentCard) {
            parentCard.classList.add('add')
            saveCalculator()
            calculatingResult()
        }
    })
})

closebuttons.forEach(button => {
    button.addEventListener('click', () => {
        const mealNameSpan = document.getElementById('calcResultNameOfMeal')
        const currentLanguage = localStorage.getItem('language') || 'en'

        if (mealNameSpan) {
            if (currentLanguage === 'en') {
                mealNameSpan.textContent = 'Not specified'
            } else {
                mealNameSpan.textContent = 'Не вказано'
            }
        }

        const parentCard = button.closest('.calcDivMeal')
        if (parentCard) {
            if (parentCard.classList.contains('selected')) {
                parentCard.classList.remove('selected')
                selectedIngredientSlot = null
                setActionButtonsState(false)
            }
            parentCard.classList.remove('add')
            parentCard.removeAttribute('data-key')

            const inputs = parentCard.querySelectorAll('.calcInput')
            inputs.forEach(input => {
            input.value = ''
            })
            
            saveCalculator()
            calculatingResult()
        }
    })
})

const meals = document.querySelector('.calcDivMeals')
if(meals) {
    meals.addEventListener('input', (event) => {
        if(event.target.classList.contains('calcInput')) {
            const input = event.target
            const currentLanguage = localStorage.getItem('language') || 'en'

            let maxLenght = 0
            if (input.id.includes('Weight') || input.id.includes('Cost') ||
            input.id.includes('Proteins') || input.id.includes('Fats') || input.id.includes('Carbohydrates')) {
                maxLenght = 10
            }

            if (maxLenght > 0 && input.value.length > maxLenght) {
                input.value = input.value.slice(0, maxLenght)
            }

            if (!event.target.id.includes('Weight') && !event.target.id.includes('Cost')) {
                const mealNameSpan = document.getElementById('calcResultNameOfMeal')
                if (mealNameSpan) {
                    if (currentLanguage === 'en') {
                        mealNameSpan.textContent = 'Not specified'
                    } else {
                        mealNameSpan.textContent = 'Не вказано'
                    }
                }
            }


            clearTimeout(inputSaveTimeout)
            inputSaveTimeout = setTimeout(() => {
                saveCalculator()
                calculatingResult()
            }, 300)
        }
    })
}

let inputSaveTimeout

// Calculate results 
function calculatingResult() {

    let weightResult = 0
    let proteinsResult = 0
    let fatsResult = 0
    let carbohydratesResult = 0
    let caloriesResult = 0
    let costResult = 0

    const weightValues = {}
    const proteinsValues = {}
    const fatsValues = {}
    const carbohydratesValues = {}
    const costValues = {}

    const allMealDiv = document.querySelectorAll('.calcDivMeal')

    allMealDiv.forEach((meal, index) => {
        if(meal.classList.contains('add')) {
            const slotId = index + 1
            
            const weightInput = meal.querySelector(`#ingredient${slotId}Weight`)
            if (weightInput) {
                const weight = parseFloat(weightInput.value) || 0
                weightValues[slotId] = weight
            }

            const proteinsInput = meal.querySelector(`#ingredient${slotId}Proteins`)
            if (proteinsInput) {
                const proteins = parseFloat(proteinsInput.value) || 0
                proteinsValues[slotId] = proteins
            }

            const fatsInput = meal.querySelector(`#ingredient${slotId}Fats`)
            if (fatsInput) {
                const fats = parseFloat(fatsInput.value) || 0
                fatsValues[slotId] = fats
            }

            const carbohydratesInput = meal.querySelector(`#ingredient${slotId}Carbohydrates`)
            if (carbohydratesInput) {
                const carbohydrates = parseFloat(carbohydratesInput.value) || 0
                carbohydratesValues[slotId] = carbohydrates
            }

            const costInput = meal.querySelector(`#ingredient${slotId}Cost`)
            if (costInput) {
                const cost = parseFloat(costInput.value) || 0
                costValues[slotId] = cost
            }
        }
    })

    for (const slotId in weightValues) {
        weightResult += weightValues[slotId]
    }

    for (const slotId in proteinsValues) {
        const proteins = proteinsValues[slotId]
        const weight = weightValues[slotId]
        proteinsResult += (proteins / 100) * weight
    }

    for (const slotId in fatsValues) {
        const fats = fatsValues[slotId]
        const weight = weightValues[slotId]
        fatsResult += (fats / 100) * weight
    }

    for (const slotId in carbohydratesValues) {
        const carbohydrates = carbohydratesValues[slotId]
        const weight = weightValues[slotId]
        carbohydratesResult += (carbohydrates / 100) * weight
    }

    for (const slotId in costValues) {
        const cost = costValues[slotId]
        const weight = weightValues[slotId]
        costResult += (cost / 100) * weight
    }

    caloriesResult = (proteinsResult * 4) + (fatsResult * 9) + (carbohydratesResult * 4)

    const weightSpan = document.getElementById('calcResultWeightOfMeal')
    if(weightSpan) {
        weightSpan.textContent = weightResult.toFixed(2)
    }

    const proteinSpan = document.getElementById('calcResultProteinsOfMeal')
    if(proteinSpan) {
        proteinSpan.textContent = proteinsResult.toFixed(2)
    }

    const fatsSpan = document.getElementById('calcResultFatsOfMeal')
    if(fatsSpan) {
        fatsSpan.textContent = fatsResult.toFixed(2)
    }

    const carbohydratesSpan = document.getElementById('calcResultCarbohydratesOfMeal')
    if(carbohydratesSpan) {
        carbohydratesSpan.textContent = carbohydratesResult.toFixed(2)
    }

    const caloriesSpan = document.getElementById('calcResultEnergyOfMeal')
    if(caloriesSpan) {
        caloriesSpan.textContent = caloriesResult.toFixed(2)
    }

    const costSpan = document.getElementById('calcResultCostOfMeal')
    if(costSpan) {
        costSpan.textContent = costResult.toFixed(2)
    }

    let calorieDensity = 0
    if (weightResult > 0) {
        calorieDensity = (caloriesResult / weightResult) * 100
    }

    const densityMax = 600
    let densityPercent = 0
    if (densityMax > 0) {
        densityPercent = (calorieDensity / densityMax) * 100
    }

    densityPercent = Math.max(0, Math.min(100, densityPercent))

    const densityBar = document.getElementById('resultDensityBar')

    if (densityBar) {
        densityBar.value = densityPercent

        densityBar.classList.remove('densityLow', 'densityMedium', 'densityHigh')

        if (densityPercent <= 33) {
            densityBar.classList.add('densityLow')
        } else if (densityPercent <= 66) {
            densityBar.classList.add('densityMedium')
        } else {
            densityBar.classList.add('densityHigh')
        }
    }
}


// Notification
const notificationDiv = document.getElementById('notification')
const notificationMessage = document.getElementById('notificationMessage')

let notificationTimer

/**
 * @param {string} message 
 */

function showNotification(message) {
    if (!notificationDiv || !notificationMessage) return

    clearTimeout(notificationTimer)

    notificationMessage.textContent = message

    notificationDiv.classList.add('show')

    notificationTimer = setTimeout(() => {
        notificationDiv.classList.remove('show')
    }, 3000)
}

// Search ungredient id

function findIngredientId(nameToCheck) {
    const searchName = nameToCheck.trim().toLowerCase()

    for (const key in ingredientsData) {
        const item = ingredientsData[key]

        if (item.name_en && item.name_en.toLowerCase() === searchName) {
            return key
        }

        if (item.name_uk && item.name_uk.toLowerCase() === searchName) {
            return key
        }
    }

    return null
}


// Operations with ingredients
const changeBtn = document.getElementById('changeIngredientBtn')
const divConfirmChange = document.getElementById('calcDivToolConfirmChange')
const saveBtn = document.getElementById('saveIngredientBtn')
const divConfirmSave = document.getElementById('calcDivToolConfirmSave')
const deleteBtn = document.getElementById('deleteIngredientBtn')
const divConfirmDel = document.getElementById('calcDivToolConfirmDel')
const allDivMeal = document.querySelectorAll('.calcDivMeal')
const mealDiv = document.querySelector('.calcDivMeals')
let selectedIngredientSlot = null

function setActionButtonsState(enabled) {
    changeBtn.disabled = !enabled
    saveBtn.disabled = !enabled
    deleteBtn.disabled = !enabled
}

mealDiv.addEventListener('click', (event) => {
    if (event.target.closest('.addButton')) return
    const clickedMeal = event.target.closest('.calcDivMeal.add')
    allDivMeal.forEach(meal => {
            meal.classList.remove('selected')
        })

    if (clickedMeal) {
        clickedMeal.classList.add('selected')
        selectedIngredientSlot = clickedMeal.id
        setActionButtonsState(true)
    } else {
        selectedIngredientSlot = null
        setActionButtonsState(false)
    }
})

changeBtn.addEventListener('click', () => {
    if (!selectedIngredientSlot) return
    const selectedCard = document.getElementById(selectedIngredientSlot)
    const dbKey = selectedCard.dataset.key
    const currentLanguage = localStorage.getItem('language') || 'en'

    if (!dbKey) {
        if (currentLanguage === 'en') {
            showNotification('The ingredient is not in the database.')
            return
        } else {
            showNotification('Інгредієнта немає в базі даних.')
            return
        }
    }

    const originalData = ingredientsData[dbKey]
    if (!originalData) {
        if (currentLanguage === 'en') {
            showNotification('The ingredient is not in the database.')
            return
        } else {
            showNotification('Інгредієнта немає в базі даних.')
            return
        }
    }

    const proteinsInput = selectedCard.querySelector('.calcInput[id*="Proteins"]')
    const fatsInput = selectedCard.querySelector('.calcInput[id*="Fats"]')
    const carbohydratesInput = selectedCard.querySelector('.calcInput[id*="Carbohydrates"]')

    const newproteins = parseFloat(proteinsInput.value) || 0
    const newfats = parseFloat(fatsInput.value) || 0
    const newcarbohydrates = parseFloat(carbohydratesInput.value) || 0

    divConfirmChange.dataset.proteins = newproteins
    divConfirmChange.dataset.fats = newfats
    divConfirmChange.dataset.carbohydrates = newcarbohydrates
    divConfirmChange.dataset.key = dbKey

    if (!originalData) {
        if (currentLanguage === 'en') {
            showNotification('The ingredient is not in the database.')
            return
        } else {
            showNotification('Інгредієнта немає в базі даних.')
            return
        }
    }

    const originalName = originalData['name_' + currentLanguage] || originalData.name_en

    const nameInput = selectedCard.querySelector('.calcInput[id*="Name"]')
    if (!nameInput) return

    const currentName = nameInput.value

    if (currentName !== originalName) {
        if (currentLanguage === 'en') {
            showNotification('The name has been changed, please select an ingredient from the database.')
            return
        } else {
            showNotification('Назву змінено, будь ласка, виберіть інгредієнт з бази даних.')
            return
        }
    }
    divConfirmChange.classList.toggle('active')
})

const confirmButYesChange = document.getElementById('confirmButYesChange')
const confirmButNoChange = document.getElementById('confirmButNoChange')

if (confirmButYesChange) {
    confirmButYesChange.addEventListener('click', async () => {
        const dbKey = divConfirmChange.dataset.key
        const originalData = ingredientsData[dbKey]
        const currentLanguage = localStorage.getItem('language') || 'en'

        const originalName = originalData['name_' + currentLanguage]
        const originalProteins = originalData.protein
        const originalFats = originalData.fats
        const originalCarbohydrates = originalData.carbohydrates

        const newproteins = parseFloat(divConfirmChange.dataset.proteins)
        const newfats = parseFloat(divConfirmChange.dataset.fats)
        const newcarbohydrates = parseFloat(divConfirmChange.dataset.carbohydrates)

        const isSame = (
            Math.abs(newproteins - originalProteins) < 0.01 &&
            Math.abs(newfats - originalFats) < 0.01 &&
            Math.abs(newcarbohydrates - originalCarbohydrates) < 0.01
        )

        if (isSame) {
            if (currentLanguage === 'en') {
            showNotification('No changes to save.')
            return
        } else {
            showNotification('Немає змін для збереження.')
            return
        }
        } else {
            const upgradeIngredient = {}

            upgradeIngredient['name_' + currentLanguage] = originalName
            if (currentLanguage !== 'en') {
            upgradeIngredient.name_en = originalName
            }
            upgradeIngredient.protein = newproteins
            upgradeIngredient.fats = newfats
            upgradeIngredient.carbohydrates = newcarbohydrates

            ingredientsData[dbKey] = upgradeIngredient

            await updateServerData('ingredients', ingredientsData)

            if (currentLanguage === 'en') {
            showNotification('Changes saved successfully.')
            } else {
            showNotification('Зміни успішно збережено.')
            }

            divConfirmChange.removeAttribute('data-proteins')
            divConfirmChange.removeAttribute('data-fats')
            divConfirmChange.removeAttribute('data-carbohydrates')
            divConfirmChange.classList.remove('active')

            calculatingResult()
            saveCalculator()
        }
    })
}

document.addEventListener('click', (event) => {
    if (divConfirmChange && divConfirmChange.classList.contains('active') &&
        !confirmButYesChange.contains(event.target) &&
        !divConfirmChange.contains(event.target) &&
        !changeBtn.contains(event.target)) {
        divConfirmChange.classList.remove('active')
    }
})

if (confirmButNoChange) {
    confirmButNoChange.addEventListener('click', () => {
        divConfirmChange.classList.remove('active')
        divConfirmChange.removeAttribute('data-proteins')
        divConfirmChange.removeAttribute('data-fats')
        divConfirmChange.removeAttribute('data-carbohydrates')
    })
}

saveBtn.addEventListener('click', () => {
    if (!selectedIngredientSlot) return
    const selectedCard = document.getElementById(selectedIngredientSlot)
    const nameInput = selectedCard.querySelector('.calcInput[id*="Name"]')
    const proteinsInput = selectedCard.querySelector('.calcInput[id*="Proteins"]')
    const fatsInput = selectedCard.querySelector('.calcInput[id*="Fats"]')
    const carbohydratesInput = selectedCard.querySelector('.calcInput[id*="Carbohydrates"]')
    const currentLanguage = localStorage.getItem('language') || 'en'

    const ingredientName = nameInput.value
    const proteins = parseFloat(proteinsInput.value) || 0
    const fats = parseFloat(fatsInput.value) || 0
    const carbohydrates = parseFloat(carbohydratesInput.value)
    
    const proteinsStr = proteinsInput.value
    const fatsStr = fatsInput.value
    const carbohydratesStr = carbohydratesInput.value

    if (ingredientName.trim() === '') {
        if (currentLanguage === 'en') {
            showNotification('Please fill in name input.')
            return
        } else {
            showNotification('Будь ласка, заповніть поле для введення імені.')
            return
        }
    }
    if (proteinsStr.trim() === '') {
        if (currentLanguage === 'en') {
            showNotification('Please fill in proteins input.')
            return
        } else {
            showNotification('Будь ласка, заповніть поле для введення білків.')
            return
        }
    }
    if (fatsStr.trim() === '') {
        if (currentLanguage === 'en') {
            showNotification('Please fill in fats input.')
            return
        } else {
            showNotification('Будь ласка, заповніть поле для введення жирів.')
            return
        }
    }
    if (carbohydratesStr.trim() === '') {
        if (currentLanguage === 'en') {
            showNotification('Please fill in carbohydrates input.')
            return
        } else {
            showNotification('Будь ласка, заповніть поле для введення вуглеводів.')
            return
        }
    }

    const existingKey = findIngredientId(ingredientName)

    if (existingKey) {
        if (currentLanguage === 'en') {
            showNotification('An ingredient with this name already exists in the database.')
            return
        } else {
            showNotification('Інгредієнт з такою назвою вже існує у базі даних.')
            return
        }
    }

    divConfirmSave.dataset.name = ingredientName
    divConfirmSave.dataset.proteins = proteins
    divConfirmSave.dataset.fats = fats
    divConfirmSave.dataset.carbohydrates = carbohydrates

    divConfirmSave.classList.toggle('active')
})

const confirmButYesSave = document.getElementById('confirmButYesSave')
const confirmButNoSave = document.getElementById('confirmButNoSave')

if (confirmButYesSave) {
    confirmButYesSave.addEventListener('click', async () => {
        const name = divConfirmSave.dataset.name
        const proteins = divConfirmSave.dataset.proteins
        const fats = divConfirmSave.dataset.fats
        const carbohydrates = divConfirmSave.dataset.carbohydrates

        const newIngredient = {}
        const currentLanguage = localStorage.getItem('language') || 'en'

        newIngredient['name_' + currentLanguage] = name
        
        newIngredient.protein = proteins
        newIngredient.fats = fats
        newIngredient.carbohydrates = carbohydrates

        const dbKey = name.toLowerCase().replace(/ /g, '')

        ingredientsData[dbKey] = newIngredient

        await updateServerData('ingredients', ingredientsData)

        if (selectedIngredientSlot) {
            const currentCard = document.getElementById(selectedIngredientSlot)
            if (currentCard) {
                currentCard.dataset.key = dbKey
                currentCard.classList.add('add')
            }
        }

        if (currentLanguage === 'en') {
            showNotification('The ingredient has been successfully added to the database.')
        } else {
            showNotification('Інгредієнт успішно додано до бази даних.')
        }

        divConfirmSave.removeAttribute('data-name')
        divConfirmSave.removeAttribute('data-proteins')
        divConfirmSave.removeAttribute('data-fats')
        divConfirmSave.removeAttribute('data-carbohydrates')
        divConfirmSave.classList.remove('active')

        calculatingResult()
        saveCalculator()
    })
}

document.addEventListener('click', (event) => {
    if (divConfirmSave && divConfirmSave.classList.contains('active') &&
        !confirmButYesSave.contains(event.target) &&
        !divConfirmSave.contains(event.target) &&
        !saveBtn.contains(event.target)) {
        divConfirmSave.classList.remove('active')
    }
})

if (confirmButNoSave) {
    confirmButNoSave.addEventListener('click', () => {
        divConfirmSave.classList.remove('active')
        divConfirmSave.removeAttribute('data-name')
        divConfirmSave.removeAttribute('data-proteins')
        divConfirmSave.removeAttribute('data-fats')
        divConfirmSave.removeAttribute('data-carbohydrates')
    })
}

deleteBtn.addEventListener('click', () => {
    if (!selectedIngredientSlot) return
    const selectedCard = document.getElementById(selectedIngredientSlot)
    const dbKey = selectedCard.dataset.key
    const currentLanguage = localStorage.getItem('language') || 'en'
    divConfirmDel.dataset.slotId = selectedIngredientSlot
    divConfirmDel.dataset.key = dbKey
    if (!dbKey) {
        if (currentLanguage === 'en') {
            showNotification('The ingredient is not in the database.')
            return
        } else {
            showNotification('Інгредієнта немає в базі даних.')
            return
        }
    } else {
        const originalData = ingredientsData[dbKey]
        if (!originalData) {
            if (currentLanguage === 'en') {
                showNotification('The ingredient is not in the database.')
                return
            } else {
                showNotification('Інгредієнта немає в базі даних.')
                return
            }
        }
        const currentLanguage = localStorage.getItem('language') || 'en'
        const originalName = originalData['name_' + currentLanguage] || originalData.name_en

        const nameInput = selectedCard.querySelector('.calcInput[id*="Name"]')
        if (!nameInput) return

        const currentName = nameInput.value

        if (currentName !== originalName) {
            if (currentLanguage === 'en') {
                showNotification('The name has been changed, please select an ingredient from the database.')
                return
            } else {
                showNotification('Назву змінено, будь ласка, виберіть інгредієнт з бази даних.')
                return
            }
        }
        if (divConfirmDel) {
            divConfirmDel.classList.toggle('active')
        }
    }
})

const confirmButYesDel = document.getElementById('confirmButYesDel')
const confirmButNoDel = document.getElementById('confirmButNoDel')

if (confirmButYesDel) {
    confirmButYesDel.addEventListener('click', async () => {
    const mealNameSpan = document.getElementById('calcResultNameOfMeal')
    const currentLanguage = localStorage.getItem('language') || 'en'
    if (mealNameSpan) {
        if (currentLanguage === 'en') {
            mealNameSpan.textContent = 'Not specified'
        } else {
            mealNameSpan.textContent = 'Не вказано'
        }
    }

    const slotId = divConfirmDel.dataset.slotId
    const dbKey = divConfirmDel.dataset.key

    if (!slotId) return

    const selectedCard = document.getElementById(slotId)
    if (!selectedCard) return
    if (dbKey && dbKey !== "undefined") {
        if (ingredientsData[dbKey]) {
        delete ingredientsData[dbKey]
        const currentLanguage = localStorage.getItem('language') || 'en'

        await updateServerData('ingredients', ingredientsData)
        
        if (currentLanguage === 'en') {
                showNotification('Ingredient deleted')
            } else {
                showNotification('Інгредієнт видалено')
            }

        divConfirmDel.classList.remove('active')
        divConfirmDel.removeAttribute('data-slotId')
        divConfirmDel.removeAttribute('data-key')
        }
    }
    const inputsToClear = selectedCard.querySelectorAll('.calcInput')
    inputsToClear.forEach(input => {
        input.value = ''
        selectedCard.removeAttribute('data-key')
    })
    saveCalculator()
    })
}

document.addEventListener('click', (event) => {
    if (divConfirmDel && divConfirmDel.classList.contains('active') &&
        !confirmButYesDel.contains(event.target) &&
        !divConfirmDel.contains(event.target) &&
        !deleteBtn.contains(event.target)) {
        divConfirmDel.classList.remove('active')
    }
})
if (confirmButNoDel) {
    confirmButNoDel.addEventListener('click', () => {
    if (divConfirmDel) {
        divConfirmDel.classList.remove('active')
        divConfirmDel.removeAttribute('data-slotId')
        divConfirmDel.removeAttribute('data-key')
        }
    })
}

//Save meal

const mealSaveButton = document.getElementById('saveMealBtn')
const nameSaveInput = document.getElementById('nameInputMeal')
const nameSaveButton = document.getElementById('confirmButYesMealSave')

mealSaveButton.addEventListener('click', () => {
    nameSaveWindow.classList.toggle('show')
})

if (nameSaveButton) {
        nameSaveButton.addEventListener('click', async () => {
        const mealInput = nameSaveInput.value
        const mealName = mealInput.trim().replace(/ /g, '')
        const ingredientsArray = []
        const activeCards = document.querySelectorAll('.calcDivMeal.add')
        const currentLanguage = localStorage.getItem('language') || 'en'

        if (mealName === '') {
            if (currentLanguage === 'en') {
                showNotification('Enter dish name')
                return
            } else {
                showNotification('Введіть назву страви')
                return
            }
        }
        if (activeCards.length < 2) {
            if (currentLanguage === 'en') {
                showNotification('The dish must consist of at least 2 ingredients')
                return
            } else {
                showNotification('Страва повинна складатися щонайменше з 2 інгредієнтів')
                return
            }
        }

        let allIngedientsFromDatabase = true

        activeCards.forEach(card => {
            const dbKey = card.dataset.key
            if (!dbKey) {
                allIngedientsFromDatabase = false
            } else {
                ingredientsArray.push({key: dbKey})
            }
        })
        if (!allIngedientsFromDatabase) {
            if (currentLanguage === 'en') {
                showNotification('First, save all new ingredients')
                return
            } else {
                showNotification('Спочатку збережіть усі нові інгредієнти')
                return
            }
        }
        
        const mealNameLower = mealName.toLowerCase()

        const newMeal = {}

        newMeal['name_' + (localStorage.getItem('language')) || 'en'] = mealInput
        newMeal.ingredients = ingredientsArray
        mealsData[mealNameLower] = newMeal

        await updateServerData('meals', mealsData)

        mealNameSpan.textContent = mealInput
        nameSaveWindow.classList.remove('show')

        if (currentLanguage === 'en') {
            showNotification('Meal saved')
        } else {
            showNotification('Страва збережена')
        }
        saveCalculator()

        console.log(mealsData)
    })
}

document.addEventListener('click', (event) => {
    if (!nameSaveButton.contains(event.target) &&
        !mealSaveButton.contains(event.target) &&
        !nameSaveWindow.contains(event.target)) {
        nameSaveWindow.classList.remove('show')
    }
})

// Adding to calendar

const addCalendarDiv = document.getElementById('calcDivToolConfirmAdd')
const addCalendarBut = document.getElementById('calcButAddCalendar')
const addCalendarButYes = document.getElementById('confirmButYesAdd')
const addCalendarButNo = document.getElementById('confirmButNoAdd')

addCalendarBut.addEventListener('click', () => {
    addCalendarDiv.classList.toggle('active')
})

addCalendarButNo.addEventListener('click', () => {
    addCalendarDiv.classList.remove('active')
})

addCalendarButYes.addEventListener('click', async () => {
    const calories = document.getElementById('calcResultEnergyOfMeal').textContent
    const proteins = document.getElementById('calcResultProteinsOfMeal').textContent
    const fats = document.getElementById('calcResultFatsOfMeal').textContent
    const carbohydrates = document.getElementById('calcResultCarbohydratesOfMeal').textContent
    const weight = document.getElementById('calcResultWeightOfMeal').textContent
    const cost = document.getElementById('calcResultCostOfMeal').textContent
    const currentLanguage = localStorage.getItem('language') || 'en'

    const dataToAdd = {
        calories: parseFloat(calories) || 0,
        proteins: parseFloat(proteins) || 0,
        fats: parseFloat(fats) || 0,
        carbohydrates: parseFloat(carbohydrates) || 0,
        weight: parseFloat(weight) || 0,
        cost: parseFloat(cost) || 0
    }

    if (dataToAdd.calories === 0) {
        if (currentLanguage === 'en') {
            showNotification('Please fill in all fields.')
            return
        } else {
            showNotification('Будь ласка заповніть всі поля')
            return
        }
    }

    let today = new Date()
    let currentYear = today.getFullYear()
    let currentMonth = today.getMonth()
    let currentDate = today.getDate()

    const dateKey = `nutriCost${currentYear}-${currentMonth}-${currentDate}`

    const userId = localStorage.getItem('nutriUserId')
    if (!userId) return

    try {
        const responce = await fetch(`http://localhost:3000/api/data/${userId}/calendar`)
        let calendarData = await responce.json()

        if (!calendarData[dateKey]) {
            calendarData[dateKey] = dataToAdd
        } else {
            calendarData[dateKey].calories += dataToAdd.calories
            calendarData[dateKey].proteins += dataToAdd.proteins
            calendarData[dateKey].fats += dataToAdd.fats
            calendarData[dateKey].carbohydrates += dataToAdd.carbohydrates
            calendarData[dateKey].weight += dataToAdd.weight
            calendarData[dateKey].cost += dataToAdd.cost
        }

        await updateServerData('calendar', calendarData)

        if (currentLanguage === 'en') {
            showNotification('Meal added to calendar')
        } else {
            showNotification('Страву додано до календаря')
        }
        addCalendarDiv.classList.remove('active')
    } catch {
        console.error(error)
        if (currentLanguage === 'en') {
            showNotification('Error connecting to calendar')
        } else {
            showNotification('Помилка підключення до календаря')
        }
    }
})

document.addEventListener('click', (event) => {
    if (!addCalendarDiv.contains(event.target) &&
        !addCalendarButYes.contains(event.target) &&
        !addCalendarButNo.contains(event.target) &&
        !addCalendarBut.contains(event.target)) {
        addCalendarDiv.classList.remove('active')
    }
})

// Updating server

async function updateServerData(type, data) {
    const userId = localStorage.getItem('nutriUserId')
    if (!userId) return

    try {
        const responce = await fetch(`http://localhost:3000/api/data/${userId}/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        if (!responce.ok) {
            throw new Error('Server save failed')
        }

        console.log(`${type} database updated`)
    } catch {
        console.error(error)
        const currentLanguage = localStorage.getItem('language') || 'en'
        if (currentLanguage === 'en') {
            showNotification('Error saving to server')
        } else {
            showNotification('Помилка збереження на сервері')
        }
    }
}

fetchData()