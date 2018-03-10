let hostname = 'https://alo-quotes.tk';
let id;
let prev;
let next;

function checkPrevNext() {
    if (next != null) {
        document.querySelector('.next').style.visibility = "visible" ;
    }
    else {
        document.querySelector('.next').style.visibility = "hidden" ;
    }
    if (prev != null) {
        document.querySelector('.prev').style.visibility = "visible" ;
    }
    else {
        document.querySelector('.prev').style.visibility = "hidden" ;
    }
}

function updateQuote(quote) {
    quote.then(quote => {
        document.querySelector('.quote-quote').innerHTML = quote.text;
        document.getElementById('annotation').innerHTML = quote.annotation ? quote.annotation : '&nbsp;';
        document.getElementById('date').innerHTML = quote.date ? quote.date : '&nbsp;';
    });
}

function fetchQuote(id) {
    if (id !== undefined) {
        return fetch(`${hostname}/api/quotes/${id}`, {
            headers: new Headers({
                'Accept': 'application/json'
            })
        })
            .then(response => {return response.json()})
            .then(json => {
                id = json.quote.id;
                next = json.next;
                prev = json.prev;
                checkPrevNext()
                return json.quote;
            });
    }
}


function fetchRandomQuote() {
    return fetch(`${hostname}/api/random`, {
        headers: new Headers({
            'Accept': 'application/json'
        })
    })
        .then(response =>  {return response.json()})
        .then(json => {
            id = json.quote.id;
            next = json.next;
            prev = json.prev;
            checkPrevNext()
            return json.quote;
        });
}

document.querySelector('.random').addEventListener('click', () => updateQuote(fetchRandomQuote()));
document.querySelector('.prev').addEventListener('click', () => {
    if (prev != null) {
        updateQuote(fetchQuote(prev));
        console.log(id);
    }
});
document.querySelector('.next').addEventListener('click', () => {
    if (next != null) {
        updateQuote(fetchQuote(next));
        console.log(id);
    }
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
    let text = document.getElementById('quote-textbox').value;
    let annotation = document.getElementById('annotation').value;
    let date = document.getElementById('date').value;

    e.preventDefault();

    let data = new FormData();

    fetch(`${hostname}/api/submit/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
    
        body: JSON.stringify({ text, annotation, date })
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