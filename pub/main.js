import Home             from './views/Home.js'
import Article             from './views/Article.js'
import Error404         from './views/Error404.js'
import PostsMetadata    from './data.js'

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

    // In the curious case of the Progressbar, we will not insert the snippet into the HTML as we had to hardcode it in my index.html file
    // Otheriwse the starting transition is not working.
        
        


    // await Progressbar.control();
    await ProgressStart();


    // Get the parsed URl from the addressbar
    let url = location.hash.slice(1).toLowerCase() || '/';
    let r = url.split("/")
    let requestURL = r[1]

    console.log(requestURL)

    const content_div       = null || document.getElementById('pagecontent_container');

    let page = Home
    if (! requestURL.length) {
        console.log("home")
        page = new Home
    }
    else if (PostsMetadata.hasOwnProperty(requestURL)) {
        console.log("url")
        page = new Article(requestURL)
    }
    else {
        console.log("404")
        page = new Error404();

    }
    let HTMLFrag = page.htmlify()
    content_div.replaceChildren(HTMLFrag)

    // // End the Progress bar animation as the page has finished loading 
    await ProgressEnd();
 
}

// reset the progress bar to 0 when trasition is over
document.getElementById('progressbar').addEventListener("transitionend", ProgressReset);  

// Listen on hash change:
window.addEventListener('hashchange', router);
// Listen on page load:
window.addEventListener('load', router);
