import Home from './views/Home.js'
import Article from './views/Article.js'
import Error404 from './views/Error404.js'
import PostsMetadata from './data.js'

// --------------------------------
//  The progressbar code
// --------------------------------
const pBar = null || document.getElementById('progressbar');

let ProgressStart = async function () {
    pBar.style.transition = 'width 1.5s';
    pBar.style.visibility = 'visible';
    pBar.style.width = '66%';
}
let ProgressEnd = async function () {
    const pBar = document.getElementById('progressbar');
    pBar.style.transition = 'width 0.3s';
    pBar.style.visibility = 'visible';
    pBar.style.width = '100%';
}
let ProgressReset = async function () {
    const pBar = document.getElementById('progressbar');
    if (pBar.style.width == '100%') {
        pBar.style.visibility = "hidden";
        pBar.style.width = '0%';
    }
}

// --------------------------------
//  The router code. 
//  Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
// --------------------------------
const router = async () => {
    // Start progressbar animation when routing starts
    await ProgressStart();

    // Get the parsed URl from the addressbar
    let url = location.hash.slice(1).toLowerCase() || '/';
    let r = url.split("/")
    let requestURL = r[1]

    const content_div = null || document.getElementById('pagecontent_container');

    let page = null
    // If the url has no resource, then its for the Home page
    if (!requestURL.length) {
        page = await new Home
    }
    // If the url exists in the data.js store, then its an article
    else if (PostsMetadata.hasOwnProperty(requestURL)) {
        page = await new Article(requestURL)
    }
    // Else its a 404 error
    else {
        page = await new Error404();

    }
    // let pageContent = page.htmlify()
    content_div.replaceChildren(page)

    // Enable this if you want the page to always open at the very top. Currently, the browser caches the scroll position of the page, so if you were to read an article midway, and then leave the page and return to it again, it will show the page scrolled at half way. 
    // document.body.scrollIntoView({ behavior: 'smooth' });

    // // End the Progress bar animation as the page has finished loading 
    await ProgressEnd();

}



const checkDarkness = async () => {
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')

        document.getElementById('darkmode_sun_icon').classList.remove('hidden')
        document.getElementById('darkmode_moon_icon').classList.add('hidden')
    } else {
        document.documentElement.classList.remove('dark')

        document.getElementById('darkmode_sun_icon').classList.add('hidden')
        document.getElementById('darkmode_moon_icon').classList.remove('hidden')
    }

}

const flavorText = [
    "Scrumptious thoughts from the world's sanest mind",
    "One day I will have enough text in my blog to afford a search field",
    "This is where We do all Our nefarious scheming",
    "I fully approve of and endorse Rishav's various theories! ~ Albert Einstein",
    "A man with a lair, has one more lair than a man without a lair ~ Mark Twain",
    "Abandon all hope (of finding anything worthwhile), ye who enter here",
    "Tell 'em a hookah smoking caterpillar has given you the call.",
    "Wisdom comes from experience. Experience comes from a lack of wisdom ~ Terry Pratchett",
    "True acceptance of self is when one finds their own voice in a video, agreeable"
]

// Randomly choose a flavor text to show in the site header
const tasteNewFlavor = async () => {
    document.getElementById('flavor_text').innerText = flavorText[Math.floor(Math.random() * flavorText.length)]
}

// List of all things that should be done whenever user navigates within the site
const loader = async () => {
    await router()
    await checkDarkness()
    await tasteNewFlavor()
}


// reset the progress bar to 0 when trasition is over
document.getElementById('progressbar').addEventListener("transitionend", ProgressReset);

document.getElementById('darkmode_toggle').addEventListener("click", (e) => {
    // document.documentElement.classList.toggle('dark')
    if (localStorage.theme === 'dark') {
        localStorage.theme = 'light'
        document.documentElement.classList.remove('dark')

        document.getElementById('darkmode_sun_icon').classList.add('hidden')
        document.getElementById('darkmode_moon_icon').classList.remove('hidden')

    } else {
        localStorage.theme = 'dark'
        document.documentElement.classList.add('dark')

        document.getElementById('darkmode_sun_icon').classList.remove('hidden')
        document.getElementById('darkmode_moon_icon').classList.add('hidden')
    }
});


// Listen on hash change:
window.addEventListener('hashchange', await loader);

// Listen on page load:
window.addEventListener('load', await loader);
