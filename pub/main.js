import Home             from './views/home.js'
import Post             from './views/post.js'
import Error404         from './views/error404.js'
import PostsMetadata    from './data.js'

// --------------------------------
//  The router code. 
//  Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
// --------------------------------
const router = async () => {

    // In the curious case of the Progressbar, we will not insert the snippet into the HTML as we had to hardcode it in my index.html file
    // Otheriwse the starting transition is not working.
    // await Progressbar.control();
    // await Progressbar.animateStart();


    // Get the parsed URl from the addressbar
    let url = location.hash.slice(1).toLowerCase() || '/';
    let r = url.split("/")
    let requestURL = r[1]

    console.log(requestURL)

    let page = Home
    if (! requestURL.length) {
        console.log("home")
        page = Home
    }
    else if (PostsMetadata.hasOwnProperty(requestURL)) {
        console.log("url")
        page = Post
    }
    else {
        console.log("404")
        page = Error404
    }
    console.log(page)
    // Check if the route already exists, if it does, then render that page
    // If not then check if it is a dynamic route. If yes, then parse the url, else route to 404
    // Parse the URL and if it has an id part, change it with the string ":param"
    // let parsedURL = 
    //     routes[location.hash.slice(1).toLowerCase() || '/']
    //     ?
    //     (location.hash.slice(1).toLowerCase() || '/')
    //     :
    //     ((request.resource ? '/' + request.resource : '/') + (request.id ? '/:param' : '') + (request.verb ? '/' + request.verb : ''))
    
    // // Get the page from our hash of supported routes.
    // // If the parsed URL is not in our list of supported routes, select the 404 page instead
    // let page = routes[parsedURL] ? routes[parsedURL] : Error404

    // console.log(page)

    // // Client side Auth Guard
    // // If the page has a onlyAllow property, reoute the page appropriately or send user to Signin page
    // if (page.onlyAllow == 'user') {
    //     // console.log('Only User')
    //     page = window.localStorage['_user_email'] ? page : Signin

    // } else if (page.onlyAllow == 'anon') {
    //     // console.log('Only Anon')
    //     page = !window.localStorage['_user_email'] ? page : Home
    // } 


    // load page data
    await page.load();
    // render page view
    const content_div       = null || document.getElementById('pagecontent_container');
    content_div.innerHTML = await page.render();
    // register page controls
    await page.control();

    // // End the Progress bar animation as the page has finished loading 
    // await Progressbar.animateEnd();
 
}

// Listen on hash change:
window.addEventListener('hashchange', router);
// Listen on page load:
window.addEventListener('load', router);
