const quoteEl = document.querySelector('.quote');
quote = fetch('https://alo-quotes.tk/api/random')
    .then(response => response.json())
    .then(quote => quote.quote)
    .then(quote => { quoteEl.innerHTML = `"${quote.quote}"` });