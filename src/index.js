// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const quoteListUl = document.querySelector("#quote-list")
const submitFormBtn = document.querySelector(".btn")
const newQuoteBody = document.querySelector("#new-quote")
const newQuoteAuthor = document.querySelector("#author")
const newQuoteForm = document.querySelector("#new-quote-form")



function populate(){
    fetch("http://localhost:3000/quotes?_embed=likes").then(res => res.json()).then(quotes => {
        quotes.forEach((quote) => {
            makeLi(quote)
        })
        
        
    })
    
}

populate()

function makeLi(quote){
    const newLi = document.createElement("li")
    newLi.classList.add('quote-card')
    
    newLi.innerHTML += `<blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button data-id=${quote.id} class='btn-success' >Likes: <span>${quote.likes.length}</span></button>
    <button data-id=${quote.id} class='btn-danger'>Delete</button>
    </blockquote>`

    newLi.addEventListener('click', (evt) => {
        const parent = evt.target.parentElement.parentElement
        const id = evt.target["dataset"].id
        if (evt.target.className === "btn-danger"){
            parent.remove()

            fetch(`http://localhost:3000/quotes/${id}`, {
                method: "DELETE"
            })
            .then(res => res.json())
        }
        else if(evt.target.className === "btn-success"){
            const otherId = parseInt(id)
            const like = parseInt(evt.target.firstElementChild.innerText)
            let newLikeAmt = like + 1
            
            fetch(`http://localhost:3000/likes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    quoteId: otherId
                })
            })
            .then(res => res.json())
            .then(likes => {
                evt.target.firstElementChild.innerText = newLikeAmt
            })

        }
    })

    quoteListUl.append(newLi)

}

newQuoteForm.addEventListener('submit', (evt) => {
    evt.preventDefault()
    const newQuoteBody = evt.target["new-quote"].value
    const newQuoteAuthor = evt.target["author"].value

    fetch("http://localhost:3000/quotes?_embed=likes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quote: newQuoteBody,
            author: newQuoteAuthor
        })
    })
    .then(res => res.json()).then(newQuote => {
        makeLi(newQuote)
    })
})


