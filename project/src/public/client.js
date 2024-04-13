let store = {
    user: { name: "Student" },
    photos: [],
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    activeRover: 'Curiosity',
    roverInfo: {},
    loading: false
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)

}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

// High-Order functions
const renderRoverTab = (activeRover) => (html, rover) => html += Tab(rover, rover === activeRover)

const renderPhotoCarousel = (html, photo, index) => html += Photo(photo.img_src, index === 0)

// create content
const App = (state) => {
    return `
        ${Header()}
        ${Main(state)}
    `
}

const Header = () => {
    return `
        <header class="container my-4">
            <h1>Mars Dashboard</h1>
        </header>
    `
}

const Main = (state) => {
    let { loading } = state

    return `
        <main class="container">
            ${Menu(state)}
            ${loading ? Spinner() : Slider(state)}
        </main>
    `
}

const Menu = (state) => {
    let { rovers, activeRover } = state

    return `
        <ul class="nav nav-tabs">
            ${rovers.reduce(renderRoverTab(activeRover), '')}
        </ul>
    `
}

const Tab = (rover, active) => {
    return `
        <li class="nav-item">
            <a class="nav-link ${active ? 'active' : ''}" href="#" onclick="onClickTab('${rover}')">${rover}</a>
        </li>
    `
}

const Slider = (state) => {
    let { roverInfo, photos } = state

    return `
        <div class="card h-100 mt-5">
            <div id="carousel" class="carousel slide">
                <div class="carousel-inner">
                    ${photos.reduce(renderPhotoCarousel, '')}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
            ${RoverInfo(roverInfo)}
        </div>
    `
}

const RoverInfo = (rover) => {
    return `
        <div class="card-body">
            <h3 class="card-title mb-3">${rover.name}</h3>
            <p class="card-text text-capitalize"><b>Status</b>: ${rover.status}</p>
            <p class="card-text"><b>Launch Date</b>: ${rover.launch_date}</p>
            <p class="card-text"><b>Landing Date</b>: ${rover.landing_date}</p>
        </div>
    `
}

const Photo = (src, active) => {
    return `
        <div class="carousel-item bg-dark text-center ${active ? 'active' : ''}" style="height: 50vh">
            <img src="${src}" style="height: 100%" />
        </div>
    `
}

const Spinner = () => {
    return `
        <div class="mt-5 d-flex justify-content-center align-items-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
    getActiveRoverInfo(store)

})

// ------------------------------------------------------  Events

const onClickTab = (rover) => {
    let storeMap = Immutable.Map({ ...store });
    storeMap = storeMap.set('activeRover', rover);
    updateStore(store, { activeRover: storeMap.get('activeRover') })
    getActiveRoverInfo(store)
}

const loading = (load) => {
    let storeMap = Immutable.Map({ ...store });
    storeMap = storeMap.set('loading', load);
    updateStore(store, { loading: storeMap.get('loading') })
}

// ------------------------------------------------------  API CALLS

// API call
const getActiveRoverInfo = (state) => {
    let { activeRover } = state

    loading(true);

    fetch(`http://localhost:3000/rover/${activeRover}`)
        .then(res => res.json())
        .then(res => {
            loading(false)
            updateStore(store, { ...res })
        })
}
