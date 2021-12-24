# Making my blog site - Rishav-sharan.com
![Article Header Image](assets/gear-davinci.jpg)



## Motivation

In this article, I want to talk about the architecture of this very site. 

If you have noticed, this blog is all frontend. There is no server, database or a backend at all.
The entire site, along with the articles themselves are served directly from CDN.

Over the years, I have written a few blog posts on medium, dev.to and a few other sites, and one of my articles that seem to have resonated a lot with the readers is the one where I walk them through the process of [Making a Single Page App using just Vanilla JS](http://rishav-sharan.com/#/making-a-spa-in-vanilla-js). 

**No frameworks. No bundlers. No bullshit.**

So, when I was thinking of moving all my stuff to my own domain, I decided to take the same approach - to go with a Single Page App, written in pure vanilla JavaScript, HTML 5 and Tailwind (CSS equivalent for the design challenged, like me). For something as simple as a blog, where there is mostly passive consumption of static content, I really did not see a need for complexities like databases, or auth systems, or any other DevOps hassles. 

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

## Routing

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
## Articles Indices and sitemaps

## Serving Markdown

## Code Highlighting

## Youtube like Progress Bar

## Rants
The major work around putting together this site was around a dozen hours - with just a couple of hours writing the JS. The vast majority of my time was spendt on the CSS and look-and-feel.
