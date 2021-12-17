
class Article {
    constructor(fileId) {
        this.fileId = fileId
        return this.init()
    }
    async init() {
        try {
            const fileBuffer = await fetch(`./../posts/${this.fileId}.md`)
            const fileText = await fileBuffer.text();

            let view =  /*html*/`
            <article class="pageEntry px-16 h-screen flex items-center ">
                <p class="prose prose-2xl m-auto text-3xl text-center text-gray-400">
                    You are now reading post ${fileText}
                </p>
            </article>
            `
            return document.createRange().createContextualFragment(view)
        } catch (err) {
            console.error('Error reading documents', err)
        }
    }
}

// Export this module
export default Article