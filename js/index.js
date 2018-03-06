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
            .then(json => json)
    }
}

function nextQuote() {
    if (id !== undefined) {
        return fetch(`${hostname}/api/quote/${id}/next`)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                id = json.quote.id;
                return json.quote;
            });
    }
}

function prevQuote() {
    if (id !== undefined) {
        return fetch(`${hostname}/api/quote/${id}/prev`)
            .then(response => response.json())
            .then(json => {
                console.log(json.quote);
                id = json.quote.id;
                return json.quote;
            });
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
    updateQuote(prevQuote(id));
    console.log(id);
});
document.querySelector('.next').addEventListener('click', () => {
    updateQuote(nextQuote(id));
    console.log(id);
});

document.getElementById('quote-textbox').addEventListener('input', (e) => {
    console.log(e.target);
    if (e.target.value != '') {
        document.querySelector('input[type=submit]').className = 'button-primary';
    } else {
        document.querySelector('input[type=submit]').className = '';
    }
});

document.getElementById('submit-form').addEventListener('submit', (e) => {
    let quote = document.getElementById('quote-textbox').value;
    let annotation = document.getElementById('annotation').value;
    let date = document.getElementById('date').value;

    e.preventDefault();

    let data = new FormData();

    fetch(`${hostname}/api/submit`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },

        body: JSON.stringify({ quote, annotation, date })
    })
        .then(response => response.json())
        .then(json => {
            if (json.status === 'success') {
                console.log('Quote submitted successfully!');
                console.log(json);
            }
        })
})

updateQuote(fetchRandomQuote());

window.id = id;