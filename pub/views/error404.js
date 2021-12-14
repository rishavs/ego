class Error404 {
    constructor() {
        this.view =  /*html*/`
            <article class="pageEntry px-16 h-screen flex items-center ">
                <p class="prose prose-2xl m-auto text-3xl text-center text-gray-400">
                    😱 Spooky Error 404: This page does not exists
                </p>
            </article>
            `
    }
    htmlify() {
        return document.createRange().createContextualFragment(this.view)
    }
}
  
  
// Export this module
export default Error404