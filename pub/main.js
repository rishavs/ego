import Home             from './views/Home.js'
import Article             from './views/Article.js'
import Error404         from './views/Error404.js'
import PostsMetadata    from './data.js'

// --------------------------------
//  The progressbar code
// --------------------------------
const pBar = null || document.getElementById('progressbar');

let ProgressStart = async function () {
    pBar.style.transition='width 1.5s'; 
    pBar.style.visibility = 'visible';
    pBar.style.width = '66%';
}
let ProgressEnd = async function () {
    const pBar = document.getElementById('progressbar');
    pBar.style.transition='width 0.3s'; 
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

    const content_div       = null || document.getElementById('pagecontent_container');

    let page = null
    // If the url has no resource, then its for the Home page
    if (! requestURL.length) {
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

    // // End the Progress bar animation as the page has finished loading 
    await ProgressEnd();
 
}

// reset the progress bar to 0 when trasition is over
document.getElementById('progressbar').addEventListener("transitionend", ProgressReset);  

// document.getElementById('darkmode_toggle').addEventListener("click", (e) => {
//     if (document.getElementById('darkmode_toggle').checked == true) {
//         document.body.classList.add("dark")
//     } else {
//         document.body.classList.remove("dark")
//     }
// });  

// Listen on hash change:
window.addEventListener('hashchange', router);
// Listen on page load:
window.addEventListener('load', router);
