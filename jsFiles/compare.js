let ingredientsData = {}
let mealsData = {}

// Downloading database

const currentUserId = localStorage.getItem('nutriUserId')

if (!currentUserId) {
    window.location.href = 'account.html'
}

async function fetchData() {
    try {
        const ingredientsResponde = await fetch(`http://localhost:3000/api/data/${currentUserId}/ingredients`)
        ingredientsData = await ingredientsResponde.json()

        const mealResponde = await fetch(`http://localhost:3000/api/data/${currentUserId}/meals`)
        mealsData = await mealResponde.json()

        console.log('Databases loaded')

        loadComparator()
        compareMeals()
    } catch (error) {
        console.error('Server error', error)
        alert('The server is unavailable. Please run server.js!')
    }
}

// database Window Ingredients

const allChooseButtons = document.querySelectorAll('.compChooseBut')
const allDatabaseWindows = document.querySelectorAll('.databaseWindow')
const allMealWindows = document.querySelectorAll('.mealWindow')

let currentActiveSlot = null

allChooseButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.stopPropagation()
        const divIngr = button.closest('.compDivChooseIngr')
        const divMeal = button.closest('.compDivChooseMeal')
        const databaseWindow = divIngr ? divIngr.querySelector('.databaseWindow') : null
        const mealWindow = divMeal ? divMeal.querySelector('.mealWindow') : null

        if (divIngr) {
            if (!databaseWindow) return

            allDatabaseWindows.forEach(win => {
                if (win !== databaseWindow) {
                    win.classList.remove('show')
                }
            })

            allMealWindows.forEach(win => {
                if (win !== mealWindow) {
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
            }
        } else if (divMeal) {
            if (!mealWindow) return

            allDatabaseWindows.forEach(win => {
                if (win !== databaseWindow) {
                    win.classList.remove('show')
                }
            })
            
            allMealWindows.forEach(win => {
                if (win !== mealWindow) {
                    win.classList.remove('show')
                    currentActiveSlot = null
                }
            })

            if (!mealWindow.classList.contains('show')) {
                currentActiveSlot = button.dataset.slot

                const listContainer = mealWindow.querySelector('.databaseList')
                const searchInput = mealWindow.querySelector('.searchInput')

                if (listContainer) {
                    const langToUse = localStorage.getItem('language') || 'en'
                    displayItems(listContainer, mealsData, langToUse)
                }
                if (searchInput) searchInput.value = ''
                mealWindow.classList.add('show')
            } else {
                mealWindow.classList.remove('show')
                currentActiveSlot = null
            }
        }
    })
})

document.addEventListener('click', (event) => {
    if (!event.target.closest('.compButChoose') && !event.target.closest('.databaseWindow')) {
        allDatabaseWindows.forEach(win => {
            win.classList.remove('show')
        })
        currentActiveSlot = null
    }
    if (!event.target.closest('.compButChoose') && !event.target.closest('.mealWindow')) {
        allMealWindows.forEach(win => {
            win.classList.remove('show')
        })
    }
})

function displayItems(listContainer, dataObject, lang) {
    listContainer.innerHTML = ''
    const currentLanguage = lang
    for (const key in dataObject) {
        const item = dataObject[key]
        const itemElement = document.createElement('p')
        itemElement.classList.add('databaseItem')
        const displayName = item['name_' + currentLanguage]
        itemElement.textContent = displayName
        itemElement.dataset.key = key
        itemElement.dataset.type = (dataObject === ingredientsData) ? 'ingredient' : 'meal'
        listContainer.appendChild(itemElement)
    }
}

function ItemSelection(event) {
    const currentLanguage = localStorage.getItem('language')
    const itemButton = event.target.closest('.databaseItem')
    const ingredient = itemButton ? itemButton.closest('.databaseWindow') : null
    const meal = itemButton ? itemButton.closest('.mealWindow') : null
    

    if (ingredient) {
        if (!itemButton || !ingredient || currentActiveSlot === null) return

        const selectedKey = itemButton.dataset.key
        const selectedType = itemButton.dataset.type
        const span = document.getElementById(`compResultNameOfMeal${currentActiveSlot}`)
        const parentOfSpan = span ? span.closest('.compDivChosen') : null

        let selectedData = null
        if (selectedType === 'ingredient' && ingredientsData[selectedKey]) {
            selectedData = ingredientsData[selectedKey]
        }

        if (!selectedData) return;

        const parentCard = document.getElementById(`compDivChoose${currentActiveSlot}`)
        if (!parentCard) return

        parentCard.classList.add('active')

        if (parentOfSpan) {
            parentOfSpan.classList.add('active')
        }

        parentCard.dataset.key = selectedKey

        const nameSpan = document.getElementById(`compResultNameOfMeal${currentActiveSlot}`)
        const proteinSpan = document.getElementById(`compResultProteinsOfMeal${currentActiveSlot}`)
        const fatSpan = document.getElementById(`compResultFatsOfMeal${currentActiveSlot}`)
        const carbSpan = document.getElementById(`compResultCarbohydratesOfMeal${currentActiveSlot}`)
        const caloriesSpan = document.getElementById(`compResultEnergyOfMeal${currentActiveSlot}`)

        const displayName = selectedData['name_' + currentLanguage]
        if (nameSpan) nameSpan.textContent = displayName
        if (proteinSpan) proteinSpan.textContent = selectedData.protein
        if (fatSpan) fatSpan.textContent = selectedData.fats
        if (carbSpan) carbSpan.textContent = selectedData.carbohydrates

        const weight = 100

        const caloriesResult = (selectedData.protein * 4) + (selectedData.fats * 9) + (selectedData.carbohydrates * 4)

        const caloriesResult2 = caloriesResult.toFixed(2)

        if (caloriesSpan) caloriesSpan.textContent = caloriesResult2

        let calorieDensity = 0
        if (weight > 0) {
        calorieDensity = (caloriesResult / weight) * 100
        }

        const densityMax = 600
        let densityPercent = 0
        if (densityMax > 0) {
            densityPercent = (calorieDensity / densityMax) * 100
        }

        densityPercent = Math.max(0, Math.min(100, densityPercent))

        const densityBar = document.getElementById(`resultDensityBar${currentActiveSlot}`)

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

        ingredient.classList.remove('show')

        saveComparator()
    } else {
        if (!itemButton || !meal || currentActiveSlot === null) return

        let totalProtein = 0
        let totalFats = 0
        let totalCarbs = 0
        const weight = 100

        const selectedMealKey = itemButton.dataset.key
        const span = document.getElementById(`compResultNameOfMeal${currentActiveSlot}`)
        const parentOfSpan = span ? span.closest('.compDivChosen') : null

        const parentCard = document.getElementById(`compDivChoose${currentActiveSlot}`)
        if (!parentCard) return

        parentCard.classList.add('active')

        if (parentOfSpan) {
            parentOfSpan.classList.add('active')
        }

        parentCard.dataset.key = selectedMealKey

        const nameSpan = document.getElementById(`compResultNameOfMeal${currentActiveSlot}`)
        const proteinSpan = document.getElementById(`compResultProteinsOfMeal${currentActiveSlot}`)
        const fatSpan = document.getElementById(`compResultFatsOfMeal${currentActiveSlot}`)
        const carbSpan = document.getElementById(`compResultCarbohydratesOfMeal${currentActiveSlot}`)
        const caloriesSpan = document.getElementById(`compResultEnergyOfMeal${currentActiveSlot}`)

        const mealData = mealsData[selectedMealKey]
        if (!mealData) return

        const ingredientCount = mealData.ingredients.length
        if (ingredientCount < 0) return

        mealData.ingredients.forEach(ingredient => {
            const ingredientData = ingredientsData[ingredient.key]
            if (!ingredientData) return

            totalProtein += ingredientData.protein
            totalFats += ingredientData.fats
            totalCarbs += ingredientData.carbohydrates
        })

        const avgProtein = (totalProtein / ingredientCount).toFixed(2)
        const avgFats = (totalFats / ingredientCount).toFixed(2)
        const avgCarbs = (totalCarbs / ingredientCount).toFixed(2)

        const avgCalories = ((avgProtein * 4) + (avgCarbs * 4) + (avgFats * 9)).toFixed(2)

        const displayName = mealData['name_' + currentLanguage]
        if (nameSpan) nameSpan.textContent = displayName
        if (proteinSpan) proteinSpan.textContent = avgProtein
        if (fatSpan) fatSpan.textContent = avgFats
        if (carbSpan) carbSpan.textContent = avgCarbs
        if (caloriesSpan) caloriesSpan.textContent = avgCalories

        let calorieDensity = 0
        if (weight > 0) {
        calorieDensity = (avgCalories / weight) * 100
        }

        const densityMax = 600
        let densityPercent = 0
        if (densityMax > 0) {
            densityPercent = (avgCalories / densityMax) * 100
        }

        densityPercent = Math.max(0, Math.min(100, densityPercent))

        const densityBar = document.getElementById(`resultDensityBar${currentActiveSlot}`)

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
        
        saveComparator()
    }
}

allDatabaseWindows.forEach(popover => {
    const listContainer = popover.querySelector('.databaseList')
    const searchInput = popover.querySelector('.searchInput')

    if (listContainer) {
        listContainer.addEventListener('click', (event) => {
            ItemSelection(event)
            compareMeals()
        })
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

allMealWindows.forEach(popover => {
    const listContainer = popover.querySelector('.databaseList')
    const searchInput = popover.querySelector('.searchInput')

    if (listContainer) {
        listContainer.addEventListener('click', (event) => {
            ItemSelection(event)
            compareMeals()
        })
    }

    if (searchInput && listContainer) {
    searchInput.addEventListener('input', (event) => {
        const currentLanguage = localStorage.getItem('language')
        const searchTerm = event.target.value.toLowerCase()
        const filteredData = filterDataMeals(searchTerm, currentLanguage)
        displayItems(listContainer, filteredData, currentLanguage)
    })
}
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

const allCloseButtons = document.querySelectorAll('.compButMealDel')

allCloseButtons.forEach(button => {
    button.addEventListener('click', () => {

        const chosenCard = button.closest('.compDivChosen')
        const compWrapper = button.closest('.compDivMeal')
        const chooseCard = compWrapper.querySelector('.compDivChoose')

        button.closest
        if (chooseCard) {
            if (chooseCard.classList.contains('active')) {
                chooseCard.classList.remove('active')
                selectedIngredientSlot = null
            }
            chooseCard.removeAttribute('data-key')

            saveComparator()
        }

        if (chosenCard) {
            if (chosenCard.classList.contains('active')) {
                chosenCard.classList.remove('active')
                selectedIngredientSlot = null
            }
            chosenCard.removeAttribute('data-key')

            const spans = chosenCard.querySelectorAll('.resultSpan')
            spans.forEach(span => {
            span.textContent = ''
            })
            
            compareMeals()
            saveComparator()
        }
    })
})

function saveComparator() {
    const state = []
    const allMeals = document.querySelectorAll('.compDivChosen')
    
    allMeals.forEach((mealDiv, index) => {
        const slotId = index + 1
        const isOpen = mealDiv.classList.contains('active')
        const values = {}

        const spans = mealDiv.querySelectorAll('.resultSpan')
        spans.forEach(span => {
            let key = span.id
            key = key.replace('compResult', '')
            key = key.replace('OfMeal', '')
            key = key.replace(slotId, '')
            key = key.toLowerCase()
            values[key] = span.textContent
        })
        const bar = mealDiv.querySelector('.resultDensityBar')
        let barKey = bar.id
        barKey = barKey.replace('resultDensityBar', 'density')
        barKey = barKey.replace(slotId, '')
        values[barKey.toLowerCase()] = bar.value

        state.push({id: slotId, isOpen: isOpen, values: values, keys: mealDiv.dataset.key})
    })
    localStorage.setItem('comparatorState', JSON.stringify(state))
}

function loadComparator() {
    const savedStateJSON = localStorage.getItem('comparatorState')
    if(!savedStateJSON) return

    try {
        const savedState = JSON.parse(savedStateJSON)
        savedState.forEach(slotState => {
            const chooseDiv = document.getElementById(`compDivChoose${slotState.id}`)
            const anySpan = document.getElementById(`compResultNameOfMeal${slotState.id}`)
            const mealDiv = anySpan ? anySpan.closest('.compDivChosen') : null
            if(!mealDiv || !chooseDiv) return

            if(slotState.isOpen) {
                chooseDiv.classList.add('active')
                mealDiv.classList.add('active')
            } else {
                chooseDiv.classList.remove('active')
                mealDiv.classList.remove('active')
            }

            for (const key in slotState.values) {
                if (key === 'density') {
                    const barId = `resultDensityBar${slotState.id}`
                    const bar = mealDiv.querySelector(`#${barId}`)
                    if (bar) {
                        bar.value = slotState.values[key]
                    }
                } else {
                    const keyWithUpper = key.charAt(0).toUpperCase() + key.slice(1)
                    const spanId = `compResult${keyWithUpper}OfMeal${slotState.id}`
                    const span = mealDiv.querySelector(`#${spanId}`)
                    if (span) {
                        span.textContent = slotState.values[key]
                    }
                }
            }
            if(slotState.keys) {
                chooseDiv.dataset.key = slotState.keys
            } else {
                chooseDiv.removeAttribute('data-key')
            }
        })
    } catch (error) {
        localStorage.removeItem('comparatorState')
    }
}

let itemsCount1 = 0
let itemsCount2 = 0

function compareMeals() {
    const proteinsSpan1 = document.getElementById('compResultProteinsOfMeal1')
    const fatsSpan1 = document.getElementById('compResultFatsOfMeal1')
    const carbsSpan1 = document.getElementById('compResultCarbohydratesOfMeal1')
    const caloriesSpan1 = document.getElementById('compResultEnergyOfMeal1')
    const densityBar1 = document.getElementById('resultDensityBar1')

    const proteinsSpan2 = document.getElementById('compResultProteinsOfMeal2')
    const fatsSpan2 = document.getElementById('compResultFatsOfMeal2')
    const carbsSpan2 = document.getElementById('compResultCarbohydratesOfMeal2')
    const caloriesSpan2 = document.getElementById('compResultEnergyOfMeal2')
    const densityBar2 = document.getElementById('resultDensityBar2')

    const proteins1 = parseFloat(proteinsSpan1.textContent)
    const fats1 = parseFloat(fatsSpan1.textContent)
    const carbs1 = parseFloat(carbsSpan1.textContent)
    const calories1 = parseFloat(caloriesSpan1.textContent)
    const density1 = densityBar1.value

    const proteins2 = parseFloat(proteinsSpan2.textContent)
    const fats2 = parseFloat(fatsSpan2.textContent)
    const carbs2 = parseFloat(carbsSpan2.textContent)
    const calories2 = parseFloat(caloriesSpan2.textContent)
    const density2 = densityBar2.value

    const arrayOfValues = [
        {
            el1: proteinsSpan1,
            el2: proteinsSpan2,
            val1: proteins1,
            val2: proteins2,
        },
        {
            el1: fatsSpan1,
            el2: fatsSpan2,
            val1: fats1,
            val2: fats2,
        },
        {
            el1: carbsSpan1,
            el2: carbsSpan2,
            val1: carbs1,
            val2: carbs2,
        },
        {
            el1: caloriesSpan1,
            el2: caloriesSpan2,
            val1: calories1,
            val2:calories2,
        },
    ]

    itemsCount1 = 0
    itemsCount2 = 0

    for (const item of arrayOfValues) {
        item.el1.classList.remove('green', 'yellow', 'red')
        item.el2.classList.remove('green', 'yellow', 'red')

        if (isNaN(density1) || isNaN(density2)) {
            signChange() 
            return
        }

        if (item.val1 > item.val2) {
            item.el1.classList.add('green')
            item.el2.classList.add('red')
            itemsCount1 += 1
        }
        if (item.val1 < item.val2) {
            item.el1.classList.add('red')
            item.el2.classList.add('green')
            itemsCount2 += 1
        }
        if (item.val1 === item.val2) {
            item.el1.classList.add('yellow')
            item.el2.classList.add('yellow')
            itemsCount1 += 1
            itemsCount2 += 1
        }
    }

    currentActiveSlot = null

    signChange()
}

const sign = document.querySelector('.compMainH')

function signChange() {
    if (itemsCount1 === 0 && itemsCount2 === 0) {
        sign.textContent = '?'
        return
    }
    if (itemsCount1 > itemsCount2) {
        sign.textContent = '>'
        return
    }
    if (itemsCount1 < itemsCount2) {
        sign.textContent = '<'
        return
    }
    if (itemsCount1 === itemsCount2) {
        sign.textContent = '='
        return
    }
}

fetchData()