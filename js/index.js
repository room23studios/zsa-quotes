let hostname = window.location.hostname.includes('localhost') ? 'http://localhost:8000' : 'https://alo-quotes.tk';
let id;
let prev;
let next;

document.getElementById('date-form').valueAsDate = new Date();

function checkPrevNext() {
    if (next != null) {
        document.querySelector('.next').style.visibility = "visible";
    } else {
        document.querySelector('.next').style.visibility = "hidden";
    }
    if (prev != null) {
        document.querySelector('.prev').style.visibility = "visible";
    } else {
        document.querySelector('.prev').style.visibility = "hidden";
    }
}

function updateQuote(quote) {
    quote.then(quote => {
        document.querySelector('.quote-quote').innerHTML = quote.text.replace(/\n/g, '<br>');
        document.getElementById('annotation').innerHTML = quote.annotation ? quote.annotation : '&nbsp;';
        if (quote.date) {
            let date = new Date(quote.date);
            document.getElementById('date').innerHTML = date.toLocaleDateString('pl-PL', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
        } else {
            document.getElementById('date').innerHTML = '&nbsp;';
        }
    });
}

function fetchQuote(id) {
    if (id !== undefined) {
        return fetch(`${hostname}/api/quotes/${id}`, {
            headers: new Headers({
                'Accept': 'application/json'
            })
        })
            .then(response => {
                return response.json()
            })
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
        .then(response => {
            return response.json()
        })
        .then(json => {
            id = json.quote.id;
            next = json.next;
            prev = json.prev;
            checkPrevNext()
            return json.quote;
        });
}

function validateForm(quote) {
    return quote.trim().length !== 0;
}

document.querySelector('.random').addEventListener('click', () => updateQuote(fetchRandomQuote()));
document.querySelector('.prev').addEventListener('click', () => {
    if (prev != null) {
        updateQuote(fetchQuote(prev));
    }
});
document.querySelector('.next').addEventListener('click', () => {
    if (next != null) {
        updateQuote(fetchQuote(next));
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


    body = {
        text: text.value.trim()
    };

    if (annotation !== '') {
        body.annotation = annotation.value.trim();
    }
    if (date !== '') {
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
                text = 'Oh no! Something bad happened and quote cannot be submitted!';
                let messages = json.messages.text.map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1)).join('<br>');
                text += '<br>' + messages;
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

document.addEventListener('keypress', (e) => {
    if (e.key === 'ArrowLeft') {
        if (prev != null) {
            updateQuote(fetchQuote(prev));
        }
    } else if (e.key === 'ArrowRight') {
        if (next != null) {
            updateQuote(fetchQuote(next));
        }
    }
});

updateQuote(fetchRandomQuote());