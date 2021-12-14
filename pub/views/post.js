let Post = {
    onlyAllow: 'all',
    state: {},
    load: async function () {},
    render : async function () {
        let view =  /*html*/`
            <section class="section pageEntry">
                <h1> Some Post </h1>
            </section>
        `
        return view
    },
    control: async function () {
    }
}
export default Post;