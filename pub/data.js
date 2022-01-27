// --------------------------------
//  List of supported routes. 
//  Any url other than these routes will throw a 404 error
// --------------------------------
const PostsMetadata = {
    "making-my-blog-site": {
        "title": "Making my blog site - Rishav-sharan.com",
        "description": "A look at the architecture and approach behind this very blog site. I will walk you through why I chose what I chose, parts of the implementation and also why this approach is a great fit for simple blogs and static sites.",
        "tags": ['ES6', 'VanillaJS', 'SPA', 'single-page-app', 'blog', 'rishav-sharan.com'],
        "thumb": "assets/gear-davinci.jpg",
        "published_at": "",
        "views": 100
    },
    "making-a-spa-in-vanilla-js": {
        "title": "Making a Single Page App in ye good olde JS (ES6)",
        "description": "Guide on creating a basic blog like single page app (SPA) using no frontend frameworks but just plain javascript (ES6). You do not need React. You do not need Vue. All you need is a editor and basic knowledge of modern javascript.",
        "tags": ['ES6', 'VanillaJS', 'SPA', 'single-page-app'],
        "thumb": "assets/VanillaJS.png",
        "published_at": "",
        "views": 100
    },

}

export default PostsMetadata;