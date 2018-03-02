const hostname = 'https://alo-quotes.tk';
let id;

function updateQuote(quote) {
    const quoteEl = document.querySelector('.quote');
    quote.then(quote => quoteEl.innerHTML = quote.quote);
}

function fetchQuote(id) {
    if (id !== undefined) {
        return fetch(`${hostname}/api/quote/${id}`)
            .then(response => response.json())
            .then(json => json.quote)
    }
}

function fetchRandomQuote() {
    return fetch(`${hostname}/api/random`)
        .then(response => response.json())
        .then(json => {
            id = json.quote.id;
            return json.quote;
        });
}

document.querySelector('.random').addEventListener('click', () => updateQuote(fetchRandomQuote()));
document.querySelector('.prev').addEventListener('click', () => {
    id -= 1;
    updateQuote(fetchQuote(id));
    console.log(id);
});
document.querySelector('.next').addEventListener('click', () => {
    id += 1;
    updateQuote(fetchQuote(id));
    console.log(id);
});

updateQuote(fetchRandomQuote());

window.id = id;