# Making my blog site - Rishav-sharan.com
![Article Header Image](assets/gear-davinci.jpg)



## Motivation

In this article, I want to talk about the architecture of this very site. 

If you have noticed, this blog is all frontend. There is no server, database or a backend at all.
The entire site, along with the articles themselves are served directly from CDN.

Over the years, I have written a few blog posts on medium, dev.to and a few other sites, and one of my articles that seem to have resonated a lot with the readers is the one where I walk them through the process of [Making a Single Page App using just Vanilla JS](http://rishav-sharan.com/#/making-a-spa-in-vanilla-js). 

**No frameworks. No bundlers. No bullshit.**

So, when I was thinking of moving all my stuff to my own domain, I decided to take the same approach - to go with a Single Page App, written in pure vanilla JavaScript, HTML 5 and Tailwind (CSS low level framework for the design challenged like me). For something as simple as a blog, where there is mostly passive consumption of static content, I really did not see a need for complexities like databases, or auth systems, or any other DevOps hassles. 

Being lazy, I always wanted to write blog posts/articles in the simplest possible way
1. Write post in Markdown
2. git push

That's it.

Of course, a con of this approach is that it doesn't supports any user generated content like comments and discussions. 
I don't see this as being a major issue right now. If the engagement with my articles grows large enough, I would likely solve it using a paid service like [Disqus](https://disqus.com/) or [Commento](https://commento.io/). Or I might use [Utterances](https://utteranc.es/) or [Giscus](https://giscus.app/) as the completely free and fascinating way to solve this. Or I just might handroll my own solution using Sign in With Google/Apple etc. and serverless functions. 

But enough of the context setting. You are probably here because you are interested in knowing how does one go about creating a site like rishav.sharan.com, and how much effort does that take compared to traditional sites.

Before we begin, I will recommend you go through (if you already haven't) my old article on [Making a Single Page App using just Vanilla JS](http://rishav-sharan.com/#/making-a-spa-in-vanilla-js). Much of what I am doing now builds upon the architecture there.

Also, feel free to just open the Source of the site and go through the frontend code. I do not use minifiers or bundlers, and the code is very readable and lovingly commented. If you want to read the code in a better environment, or even add comments or fixes, you can check it out at its [Github Repo](https://github.com/rishavs/ego)

## Architecture Overview
Overall the SPA consists of a container HTML which has a fixed header and body.
But the content of the article gets fetched at run time by the JS code based on the url user has entered.

You should get the entire architecture by going through the [main.js](/main.js), [data.js](/data.js) and [Article.js](/article.js) files. They are tiny and commented.

In fact the entire routing logic is in this small function which gets called on each page refresh.

```javascript
const router = async () => {
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
    // let pageContent = page.HTMLify()
    content_div.replaceChildren(page)
    ...
    ...

}
```

User enters a url
    ↓
check the data.js dictionary and see if any post matches the url fragment
    ↓
If there is a match, fetch the markdown file and compile it using the marked.js library.
Then embed the generated HTML in the article tag.
    ↓
If there is no match, instead generate HTML which shows a 404 message.
Then embed the generated HTML in the article tag

## 404 Error handling
The error page is handled as any other route.

````javascript
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
````
The twist here is that we can only handle urls which come after the "#" in the url.
So, to handle urls where the resources don't exist on the server itself (eg. rishav-sharan.com/thisPathDoesntExists), we need to take the help of the CDN provider. In my case, I am using Netlify as the CDN host, and it enables me to define redirects with a simple `__reditects` file which contains.

```
# Show a custom 404 for this path
/*  /#/404  404
```
What this does is that if Netlify sees any resource level requests, it simply redirects to our internal 404 url.

## Youtube like Progress Bar
This was one of the major reasons why I went with a spa approach. I adore the lightening fast page transitions, with a progress bar on top.
If you haven't noticed it, just go back and forth between the main page and this article. You should see a progressbar on the top of the page.

The skeleton for this effect is in this div right below the HTML body;
```HTML
    <!-- Progress bar on top of the page -->
    <div id="progressbar_container">
        <div id="progressbar" class="h-1 bg-gradient-to-r from-rose-700 via-pink-700 to-white"
            style="position: fixed; top: 0; z-index:100; width: 0%; transition: width 1s;"></div>
    </div>
```
and the meat is at;
```javascript
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
```
So we just take a div and transform it from 0% width to the width of the page, whenever user goes to any page.

## Rants
The major work around putting together this site was around a dozen hours - with just a couple of hours writing the JS. The vast majority of my time was spent on the CSS and look-and-feel.
So, when I see people bashing JS, I think they are often being unfair. Personally between CSS, JS and HTML, I find JS most pleasant to work with. 
It's a modern expressive language and as long as you stay away from React and its ilk, a fair joy to use. 

HTML is functional. But barely. I really think that browsers should support some basic logic in HTML like conditionals, loops, variable and interpolations. And fix (Templates)[https://www.w3schools.com/tags/tag_template.asp] to be usable from HTML itself. Call it HTML6. Or just steal from (HTMX)[https://htmx.org/]. But please make HTML more usable.

Coming to CSS now, I somewhat dislike CSS as the terminologies and names do not make any sense. CSS borrows a lot from the typography and printing domains, and it shows! But that also means that its syntax and semantics can be fairly unintuitive. People shouldn't struggle to centre divs in 2022!
This is where Tailwind saves the show. It is fairly low level and yet at the same time feels more ergonomic that writing pure CSS.


## Future musings
So, I shared my blog to a HN thread about client side sites and peeps were largely unimpressed T_T.
One criticism was around the fact that there didn't need to be markdown-to-HTML conversion step running in the client side at all. It would be an unnecessary waste of the visitor's CPU. A better design would be to simply compile markdown to HTML and then serve the HTML from my CDN.
This would be something worth checking out. I will add a compile step to my deployments where the HTML is generated and can be fetched.

There is also some leftover work around making the site more pleasant on mid sized devices (mobile and desktop seem to work well, but we have a crappy valley in between that needs to be fixed). Oh well, I will get to it :/