// method 1, xhr
// window.convert1 = function() {
//   const fromCurrency = document.getElementById('from-currency').textContent;
//   const toCurrency = document.getElementById('to-currency').textContent;
//
//   getPriceInBtc1(fromCurrency, function(data1) {
//     const fromCurrencyToBtc = data1;
//     getPriceInBtc1(toCurrency, function(data2) {
//       const toCurrencyToBtc = data2;
//       console.log(fromCurrencyToBtc);
//       console.log(toCurrencyToBtc);
//       const conversionRate = fromCurrencyToBtc / toCurrencyToBtc;
//       document.getElementById('to-currency-value').value = document.getElementById('from-currency-value').value * conversionRate;
//     });
//   });
// }
//
// function getPriceInBtc1(coin, fn) {
//   const Http = new XMLHttpRequest();
//   const endpoint = "https://api.coingecko.com/api/v3/coins/" + coin;
//   Http.open('GET', endpoint);
//   Http.send();
//
//   Http.onreadystatechange = function() {
//     if(this.readyState == 4 && this.status == 200) {
//       fn(JSON.parse(Http.responseText).market_data.current_price.btc);
//     }
//   }
// }

//method 2, fetch
// window.convert2 = function() {
//   document.getElementById('result').innerHTML = "loading....";
//
//   const fromCurrency = document.getElementById('from-currency').value;
//   const toCurrency = document.getElementById('to-currency').value;
//
//   const getJsonResponse = (coin) => {
//     return fetch("https://api.coingecko.com/api/v3/coins/" + coin)
//     .then(response => {
//       return response.json();
//     });
//   }
//
//   const jsonResponse1 = getJsonResponse(fromCurrency);
//   const jsonResponse2 = getJsonResponse(toCurrency);
//
//   Promise.all([jsonResponse1, jsonResponse2])
//   .then(data => {
//     const fromCurrencyToBtc = data[0].market_data.current_price.btc;
//     const toCurrencyToBtc = data[1].market_data.current_price.btc;
//     const conversionRate = fromCurrencyToBtc / toCurrencyToBtc;
//     const total = document.getElementById('amount').value * conversionRate;
//     document.getElementById('result').innerHTML = total;
//   })
//   .catch(error => {
//     console.log(error);
//   });
// }

const convert = () => {
  document.getElementById('result-middle').innerHTML = '<i class="fas fa-spinner"></i>';
  document.getElementById('result-right').innerHTML = "";
  document.getElementById('result-left').innerHTML = "";
  const fromCurrency = document.getElementById('from-currency').value;
  const toCurrency = document.getElementById('to-currency').value;

  fetch("https://api.coingecko.com/api/v3/coins/" + fromCurrency)
  .then(response => {
    return response.json();
  })
  .then(data1 => {
    const fromCurrencyToBtc = data1.market_data.current_price.btc;
    return fetch("https://api.coingecko.com/api/v3/coins/" + toCurrency)
    .then(response => {
      return response.json();
    })
    .then(data2 => {
      const toCurrencyToBtc = data2.market_data.current_price.btc;
      const conversionRate = fromCurrencyToBtc / toCurrencyToBtc;
      const total = document.getElementById('amount').value * conversionRate;

      document.getElementById('result-right').innerHTML = total;
      document.getElementById('result-left').innerHTML = document.getElementById('amount').value
      document.getElementById('result-middle').innerHTML = "=";
    });
  });
}

const liTemplate = (coin) => { return `
    <li href="#" class="list-group-item search-item">
      ${coin}
    </li>`;
}

const debounce = (func, delay) => {
  let inDebounce;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => {
      func.apply(context, args)
    }, delay);
  }
}

function search() {
  const query = this.value.trim();
  if (query) {
    const apiUrl = `https://api.coingecko.com/api/v3/search?query=${query}`;
    fetch(apiUrl)
    .then(response => {
      return response.json();
    })
    .then(json => {
      document.querySelector(`#${this.id}-search-result`).classList.remove('hide');
      document.querySelector(`#${this.id}-search-result`).innerHTML = '';
      json.coins.forEach((item) => {
        document.querySelector(`#${this.id}-search-result`).innerHTML += liTemplate(item.id);
      });

      const searchItem = Array.from(document.getElementsByClassName("search-item"));
      if (searchItem) {
        searchItem.forEach(item => {
          item.addEventListener('click', () => {
            this.value = item.textContent.trim();
            if (!(Array.from(document.getElementById(`${this.id}-search-result`).classList)).includes('hide')) {
              document.getElementById(`${this.id}-search-result`).classList.add('hide');
            }
          });
        });
      }
    });
  }
}

window.onload = () => {
  const convertButton = document.getElementById('convert-button');
  const fromCurrencySearchBox = document.getElementById('from-currency');
  const toCurrencySearchBox = document.getElementById('to-currency');

  convert();
  convertButton.addEventListener('click', convert);

  fromCurrencySearchBox.addEventListener('keydown', debounce(search, 200));
  toCurrencySearchBox.addEventListener('keydown', debounce(search, 200));

  window.addEventListener('click', (e) => {
    if (!(document.getElementById('from-currency-search-result').contains(e.target))) {
      if (!(Array.from(document.getElementById('from-currency-search-result').classList)).includes('hide')) {
        document.getElementById('from-currency-search-result').classList.add('hide');
      }
    }

    if (!(document.getElementById('to-currency-search-result').contains(e.target))) {
      if (!(Array.from(document.getElementById('to-currency-search-result').classList)).includes('hide')) {
        document.getElementById('to-currency-search-result').classList.add('hide');
      }
    }
  });
}
