async function getExerciseInfo(search) {
    document.querySelector('.fa-spinner').classList += ' visible'
    const exerciseAPI = await fetch('https://wger.de/api/v2/')
    const exerciseData = await exerciseAPI.json()
    const exerciseInfoAPI = await fetch(exerciseData.exerciseinfo)
    const exerciseInfo = await exerciseInfoAPI.json()

    let exerciseList = (exerciseInfo.results).filter(elem => {
        return elem.language.short_name === 'en' && !elem.name.includes('Abduktion')
    })

    for (let i = 1; i < (exerciseInfo.count / 30); ++i) {
        let exerciseListAPI = await fetch('https://wger.de/api/v2/exerciseinfo/?limit=30&offset=' + i * 30)
        let exerciseListData = await exerciseListAPI.json()
        for (let i = 0; i < exerciseListData.results.length; ++i) {
            if (exerciseListData.results[i].language.short_name === 'en') {
                exerciseList.push(exerciseListData.results[i])
            }
        }
    }

    if (localStorage.getItem('search')) {
        search = localStorage.getItem('search')
    }

    let exerciseListHTML = []
    let count = 0

    if (!search) {
        for (let i = 0; i < exerciseList.length; ++i) {
            exerciseListHTML += exerciseHTML(exerciseList[i])
        }
    }
    else {
        for (let i = 0; i < exerciseList.length; ++i) {
            if (exerciseList[i].name.toLowerCase().includes(`${search.toLowerCase()}`)) {
                if (count < 6) {
                    exerciseListHTML += exerciseHTML(exerciseList[i])
                    count += 1
                }
            }
        }
    }

    const exerciseListElem = document.querySelector('.exercises__container')

    document.querySelector('.fa-spinner').classList.remove('visible')
    document.querySelector('.exercises__container').classList += ' visible'

    if (search) {
        document.querySelector('.search__results').innerHTML = 
        `<h2 class="search__results">Search results for ${search}:</h2>`
    }
    else {
        document.querySelector('.search__results').innerHTML = 
        '<h2 class="search__results">Search results:</h2>'
    }

    exerciseListElem.innerHTML = exerciseListHTML
    localStorage.removeItem('search')
}

function exerciseHTML(exercise) {
    let img = ''
    exercise.images[0] ? img = exercise.images[0].image : img = ''
    return `<div class="exercise">
        <figure class="img__wrapper">
            <img src="${img}" alt="" class="exercise__img">
        </figure>
        <div class="exercise__info--conatiner">
            <h3 class="exercise__name">${exercise.name}</h3>
            <h4 class="exercise__category">Muscle group: ${exercise.category.name}</h4>
        </div>
    </div>`
}

function onSearchChange(event) {
    document.querySelector('.exercises__container').classList.remove('visible')

    getExerciseInfo(event.target.value)
}

getExerciseInfo()