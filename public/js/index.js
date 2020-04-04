console.log('Hello there!');

let hostname = 'http://127.0.0.1:8000';
let params = new URLSearchParams(document.location.search.substr(1));

let id;
let prev;
let next;

document.getElementById('date-form').valueAsDate = new Date();

function checkPrevNext() {
    if (next != null) {
        document.querySelector('.next').style.visibility = 'visible';
    } else {
        document.querySelector('.next').style.visibility = 'hidden';
    }
    if (prev != null) {
        document.querySelector('.prev').style.visibility = 'visible';
    } else {
        document.querySelector('.prev').style.visibility = 'hidden';
    }
}

function updateQuotePromise(quote) {
    quote.then(quote => updateQuote(quote));
}

function updateQuote(quote) {
    let quoteTextElement = document.querySelector('.quote-text');

    if (quote.text.length > 80) {
        quoteTextElement.classList.add('quote-text-long');
    } else {
        quoteTextElement.className = 'quote-text';
    }

    quoteTextElement.innerHTML = quote.text.replace(/\n/g, '<br>');
    document.getElementById('annotation').innerHTML = quote.annotation ? quote.annotation : '&nbsp;';
    if (quote.date) {
        let date = new Date(quote.date);
        document.getElementById('date').innerHTML = date.toLocaleDateString('pl-PL', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    } else {
        document.getElementById('date').innerHTML = '&nbsp;';
    }
}

function fetchQuote(id) {
    if (id !== undefined) {
        return fetch(`${hostname}/api/quotes/${id}`, {
            headers: new Headers({
                'Accept': 'application/json'
            })
        })
            .then(response => {
                return response.json();
            })
            .then(json => {
                id = json.quote.id;
                next = json.next;
                prev = json.prev;
                checkPrevNext();

                history.replaceState(json.quote, '', `?id=${json.quote.id}`);

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
        .then(response => response.json())
        .then(json => {
            id = json.quote.id;
            next = json.next;
            prev = json.prev;
            checkPrevNext();

            history.pushState(json.quote, '', `?id=${json.quote.id}`);

            return json.quote;
        });
}

function validateForm(quote) {
    return quote.trim().length !== 0;
}

document.querySelector('.random').addEventListener('click', () => updateQuotePromise(fetchRandomQuote()));
document.querySelector('.prev').addEventListener('click', () => {
    if (prev != null) {
        updateQuotePromise(fetchQuote(prev));
    }
});
document.querySelector('.next').addEventListener('click', () => {
    if (next != null) {
        updateQuotePromise(fetchQuote(next));
    }
});

document.getElementById('quote-textbox').addEventListener('input', (e) => {
    if (validateForm(e.target.value)) {
        document.querySelector('input[type=submit]').className = 'button-primary';
    } else {
        document.querySelector('input[type=submit]').className = '';
    }
});

document.getElementById('submit-form').addEventListener('submit', (e) => {
    e.preventDefault();

    let text = document.getElementById('quote-textbox');
    let annotation = document.getElementById('annotation-form');
    let date = document.getElementById('date-form');

    if (!validateForm(text.value)) {
        return;
    }


    let body = {
        text: text.value.trim()
    };

    if (annotation.value !== '') {
        body.annotation = annotation.value.trim();
    }
    if (date.value !== '') {
        body.date = date.value;
    }

    fetch(`${hostname}/api/submit/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },

        body: JSON.stringify(body)
    })
        .then(response => response.json())
        .then(json => {
            let text, className;
            if (json.status === 'success') {
                text = 'Quote submitted successfully!';
                className = 'alert success';
            } else {
                text = 'Oh no! Something bad happened and quote cannot be submitted!<br>';
                let messages = '';
                for (let key in json.messages) {
                    messages += json.messages[key].map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1)).join('<br>');
                }
                text += messages;
                className = 'alert error';
            }
            let elem = document.createElement('div');
            elem.className = className;
            elem.innerHTML = text;

            let form = document.getElementById('submit-form');
            let container = document.querySelector('.container');
            container.insertBefore(elem, form);
            setTimeout(() => elem.remove(), 2000);

            text.value = '';
            annotation.value = '';
        })
        .catch(stuff => console.log(stuff));

});

document.addEventListener('keydown', (e) => {
    let element = document.activeElement.nodeName.toLowerCase();
    if (element === 'input' || element === 'textarea') {
        return;
    }

    if (e.key === 'ArrowLeft') {
        if (prev != null) {
            updateQuotePromise(fetchQuote(prev));
        }
    } else if (e.key === 'ArrowRight') {
        if (next != null) {
            updateQuotePromise(fetchQuote(next));
        }
    }
});

window.onpopstate = (e) => {
    updateQuote(e.state);
};

if (params.has('id')) {
    let id = parseInt(params.get('id'));
    updateQuotePromise(fetchQuote(id));
}
else {
    updateQuotePromise(fetchRandomQuote());
}
