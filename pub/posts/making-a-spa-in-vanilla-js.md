![Post Header Image](assets/VanillaJS.png)

# Making a SPA in VanillaJS

> Demo: https://src-brsetrrnrp.now.sh/  
> Repo: https://github.com/rishavs/vanillajs-spa

Making a SPA (single page app) is all the rage these days. A SPA is much snappier, gives better UX and can be much simpler to develop and deploy.
But, to develop a SPA, one often requires lots of semantically huge frameworks like React, Vue etc and often, to use these frameworks properly, one needs more knowledge of these frameworks than one needs of the core language itself.

With this article I want to show to you that you don't need to understand multiple ecosystems and frameworks to make simple frontend apps. Plain JS is all that you need. And I promise you that the overall app is going to be a whole lot simpler and easier to reason against.

Few months ago, when I was making a weabpp in Crystal (love the language), I started with a simple server based webapp but soon realized that the amount of JS code I was writing was too much. My server codebase was actually much smaller. 
So, of course, I told myself that I might as well make the entire app in JS itself. 

(Note: this is a questionable logic, but I code for the fun of it and creating a simple SPA in just plain vanilla JS sounded like it would be the funnest idea ever! )
("Narrator: No it wasn't").

Surprisingly, there are not a lot of articles on making SPAs with vanillaJS and some of the articles that do guide the reader in this, tend to use a lot of libraries. Why am I stressing on  plain JS? This [page](http://vanilla-js.com/) provides some compelling arguments.

My plan was to use no library, unless it is clear to me that 

* I am wasting too much time reinventing the wheel
* This is beyond me.

So, handcoded Vanilla JS first. Libraries only when needed. 
Every bit of 3rd party code that you use comes with its own baggage and one should always check if the weight of baggage is less than the gains from using it.

It also helps that I am making a simple blog/Hackernews type of app; with a list of posts in a page and the detailed post in another. Something that the new versions of JS (ES6) are well suited to handle.

If you have to work on UX which needs real time updating of DOM, you really should stick to frameworks like React, Vue or (my personal favorite) Mithril.

**TLDR**; Simple and plain is good. Simple and plain is not *always* good. 
Know your needs and the tools needed to best implement them.


Before we begin with the implementation, let us look at what are we developing. 

The app will have the following pages:
* Home: containing a list of all posts. Shows data fetched from an api and rendered here.
* Post for specific id : containing details of that post. Shows the dynamic url parsing.
* About: Containing just some text. This is to showoff the router
* Secret : This page is not in my composed routes and will be used to show the 404 handling.
* Register: Contains a form and on clicking a button, shows the form data.


Each page in my app itself will have the following structure:
* Navbar
* Content section
* Footer


Each route in my app has the following structure:
* Resource
* Identifier
* verb

For example, 
if the url is "localhost:8080/#/users/rishav/edit" then
resource = "users", identifier = "rishav" and verb = "edit".

Since I have  a very fixed structure for the urls that i will support, making a hash based router for it becomes real easy. In my route, the resource and verb strings are pre-defined but the identifier is dynamic.


You can take a look at the [Demo App](https://src-brsetrrnrp.now.sh/)
Do note, I have not made it pretty at all, as that's not the purpose of this article. Also, I am lazy :)

----------------------------------------------


Now that you have played a bit with it, lets get into the nitty-gritties.
Currently, I am using [live-server](https://github.com/tapio/live-server) for serving my spa in my dev environment. You can use any server that you want. In my examples here, i will refer to "localhost:8080" as my dev domain. 
I am also using https://www.mockapi.io to populate my app with sample data via a REST API.


The article will focus on the following main aspects of the spa;
* The Router (using url hash) and
* Templating (using ES6 template literals) and
* The project architecture (using ES6 modules)



### The Router
The core idea behind the router is the use of the hash "#" in the urls. Whenever Browsers hit this character in a URL, they skip everything after it. So, from a browser's perspective "localhost:8080/#/nowhere" and "localhost:8080/#/somewhere" are the same and it will not send a server request to fetch the entire serverside route.
You can read more on this at https://en.wikipedia.org/wiki/Fragment_identifier

The routing part of our code is;

```
// List of supported routes. Any url other than these routes will throw a 404 error
const routes = {
    '/'             : Home
    , '/about'      : About
    , '/p/:id'      : PostShow
    , '/register'   : Register
};


// The router code. Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
const router = async () => {

    // Lazy load view element:
    const content = null || document.getElementById('page_container');

    // Get the parsed URl from the addressbar
    let request = Utils.parseRequestURL()

    // Parse the URL and if it has an id part, change it with the string ":id"
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '')
    
    // Get the page from our hash of supported routes.
    // If the parsed URL is not in our list of supported routes, select the 404 page instead
    let page = routes[parsedURL] ? routes[parsedURL] : Error404
    content.innerHTML = await page.render();
    await page.after_render();
  
}

// Listen on hash change:
window.addEventListener('hashchange', router);

// Listen on page load:
window.addEventListener('load', router);

```

And in this code, I refer to a simple function in another file which is;

```
    parseRequestURL : () => {

        let url = location.hash.slice(1).toLowerCase() || '/';
        let r = url.split("/")
        let request = {
            resource    : null,
            id          : null,
            verb        : null
        }
        request.resource    = r[1]
        request.id          = r[2]
        request.verb        = r[3]

        return request
    }

```

Lets walk through what happens when the user puts the following url in the addressbar and clicks enter;
* localhost:8080/#/About

First, this bit of code `window.addEventListener('load', router);` gets fired as a browser load event is used.
It then calls the router function.
The router function first take the url from the addressbar and using the function `parseRequestURL `, breaks it into our route schema of resource, identifier and verb. 
Then, this url is reformed by concatenating each url schema element.
The final url string is then compared against an existing map of routes that we support.

```
const routes = {
    '/'             : Home
    , '/about'      : About
    , '/p/:id'      : PostShow
    , '/register'   : Register
};
```
Here each supported route is mapped against a content page.
`let page = routes[parsedURL] ? routes[parsedURL] : Error404`
Then, we check if the parsed url string exists as a key in our routes map.
if it does, the variable `page` gets the corresponding value. Else it gets the value of the error404 page.

In our example, the resource was "About", identifier was nil and verb was nil.
So we check in the routes map for "about" and render that page using;
```
    content.innerHTML = await page.render();

```
Lets now consider a dynamic route "localhost:8080/#/p/1234".

Here the resource = "p", identifier ="1234" and the verb is nil.
Since we have detected an identifier (which can be any string), we need to substitute it with a fixed string. So, i just replace any identifier with a fixed string ":id".
This allows me to define a simple route as `"/p/1234" : PostShow` where the PostShow page will show the data dynamically for the specific identifier.

Of course we also need to ensure that all in-app links also have the "#" in them. For example, this is the html for the About page link in the navbar;
```
<a class="navbar-item" href="/#/about">
    About
</a>
```
When the user clicks on this link, the second global event that we defined `window.addEventListener('hashchange', router);` gets fired. And then the router function is called again and yadda yadda and stuff.
So, essentially, we re-render the page content of our app every time the user changes the url and loads the page (enter, refresh etc) or if they use an in-app hyperlink for navigation.

Of course, our navigation state also gets saved in the browser history so you can use the back/forward browser buttons to navigate through the history state.

What if a user tries a url like "localhost:1234/nowhere" (no # in the url at all after the origin)?
This is not something that our purely clientside router can handle. In most hosting solutions for SPAs like Netifly, you can specify a 404 page (a pre-rendered version of the one we are using in our frontend app) which gets served in such scenarios.

## Templating

Lets take a look at a very simple page that we are generating, the About page;

```
let About = {
    render : async () => {
        let view =  /*html*/`
            <section class="section">
                <h1> About </h1>
            </section>
        `
        return view
    }
        
}

export default About;
```
I am using the ES6 template literals to define my html template. The `/*html*/` bit is just a pragma that my VSCode extension uses to format the html content properly in the editor.
The async bit doesn't makes much sense here but is needed for the pages that will be fetching and showing data from remote sources. I treat my About page a page template and every time i need to add a  new page to my app, i just do a bit of copy-paste-rename.
If you noticed, the template literal string is inside a function. this means that the render function will be evaluated only when we need it.
Earlier I had just done something like this;

```
let About = /*html*/`
            <section class="section">
                <h1> About </h1>
            </section>
            `

export default About;
```
This was a big problem as it would always evaluate this page no matter where I was in my app. If I had 20 pages in my app and many of these fetched some data, then no matter which area of the app i rendered, it would evaluate the entire app everytime (and fetch all the data for pages that I never needed).

The functional approach also means that if we want to have small components in  a page, each component can have data passed to it for rendering using the function params. For example, if I want to have each link in my Home Page be a card instead, I can just call the render function for each link as `card.render(data)`
and read that data pro-\grammatically to render it accordingly.

Now the next bit to tackle is adding interaction controls for our pages. For example, if our About page had a button; on clicking which a browser alert was raised, where should we put the code related to this button?


Earlier, I had added a script tag in my string based html but no matter what I did, the code inside it wouldnt run.
Finally a gentleman in another forum helped me out. It turns out that script tags added via the innerHTML method are not evaluated! Madness, I know! -__-
Javascript is full of these small gotchas because of the security implications.

So, that option was out.
I also couldn't just add the actual code in a global scope and then refer to it by using onclick attribute on my button. 

The way to add event-handlers for your page controls is by adding another function to the page object like this;

```
let About = {
    render : async () => {
        let view =  /*html*/`
            <section class="section">
                <h1> About </h1>
                <button id="myBtn"> Button</button>
            </section>
        `
        return view
    },
    after_render: async () => {
        document.getElementById("myBtn").addEventListener ("click",  () => {
            console.log('Yo')
            alert('Yo')
        })
    }
        
}

export default About;
```
and consuming it in the router as;
```
    content.innerHTML = await page.render();
    await page.after_render();
```
This allows me to define the code for the button press and this code gets initialized right after my dom is rendered.

## App structure

![Folder Structure Image](assets/folder-structure.png)
This is how I have structured the app. The views folder contains my dynamic content [pages]  and the smaller components [components]. If I add reusable components like cards, comments etc, I will be adding components for them here.

If you have noticed, we are not using any bundler like parceljs, webpack etc because ES6 onward I really don't need to. I can use the simple html directive of script tag type=module to tell the browser that it we have a modularised app in our JS and it needs to consider the ES6 import/export commands and stitch the modules up accordingly.
This is how we declare the root of our app in our core html file;
```
    <script type="module" src="/app.js"></script>
</head>

<body>
    <div id="header_container"></div>

    <div id="page_container" class="container pageEntry" >
        <article> Loading....</article>
    </div>

    <div id="footer_container"></div>
</body>
```
If you are curious about the "header_container"/"footer_container", these are the dom elements which contain my Navbar and the footer. The Navbar and Footer will be the same for each route and the content section will be dynamic and will change based on the currently selected route.

I declare these components in the same way i declare and use my pages.

For example, this is a Footer;
```
let Bottombar = {
    render: async () => {
        let view =  /*html*/`
        <footer class="footer">
            <div class="content has-text-centered">
                <p>
                    This is my foot. There are many like it, but this one is mine.
                </p>
            </div>
        </footer>
        `
        return view
    },
    after_render: async () => { }

}

export default Bottombar;
```

and this is my modified Router where I consume this page;

```
const router = async () => {

    // Lazy load view element:
    const header = null || document.getElementById('header_container');
    const content = null || document.getElementById('page_container');
    const footer = null || document.getElementById('footer_container');
    
    // Render the Header and footer of the page
    header.innerHTML = await Navbar.render();
    await Navbar.after_render();
    footer.innerHTML = await Bottombar.render();
    await Bottombar.after_render();

```
So no matter what route is entered via the url, i will always render the navbar and the footer.

Of course, you may still want to use the bundlers to do stuff like minifying, gzipping your js files and they would be a great solution for it. I personally don't care about such optimizations right now and the sheer freedom from the whole webpack config > babel rabbit hole is immensely relieving.

Whew. Look at the time!
We are now done with our simple blog style spa!

> I would highly recommend you to go through the actual code at https://github.com/rishavs/vanillajs-spa

The code is simple, well commented and inline with what I wrote in this guide. Hopefully, it will help you get started on journey on a clean path through the cluttered JS framework jungle.


### Credit:
I myself have referenced a lot of guides and articles to be able to make this app.
For the router, this one was a great help;
https://medium.com/@bryanmanuele/how-i-implemented-my-own-spa-routing-system-in-vanilla-js-49942e3c4573
