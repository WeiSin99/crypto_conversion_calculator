const coinTemplate = (id, name, img) => { return `
  <div class="col-3 p-0 align-self-center currency-image">
    <img src="${img}" alt="${id}">
  </div>
  <div class="col-9 p-0">
    <span class="text-lg font-weight-bold currency-name">${name}</span>
    <br>
    <span class="text-sm text-muted currency-id">${id}</span>
  </div>`
}

const liTemplate = (id, name, img) => { return `
  <li href="#" class="list-group-item search-item px-3 py-1">
    <div class="d-flex">
      ${coinTemplate(id, name, img)}
    </div>
  </li>`;
}

const selectedCoinTemplate = (id, name, img) => { return `
  <div class="d-flex px-2 py-2">
    ${coinTemplate(id, name, img)}
  </div>`
}

const inputTemplate = (direction) => { return `
  <input class="search-box form-control" id="${direction}-currency" placeholder="Search">
  </input>`
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

const search = (direction) => {
  return () => {
    const query = document.getElementById(`${direction}-currency`).value
    if (query) {
      const apiUrl = `https://api.coingecko.com/api/v3/search?query=${query}`;
      fetch(apiUrl)
      .then(response => {
        return response.json();
      })
      .then(json => {
        document.querySelector(`#${direction}-currency-search-result`).classList.remove('hide');
        document.querySelector(`#${direction}-currency-search-result`).innerHTML = '';
        json.coins.forEach((coin) => {
          document.querySelector(`#${direction}-currency-search-result`).innerHTML += liTemplate(coin.id, coin.name, coin.thumb);
        });

        const searchItem = Array.from(document.querySelectorAll(".search-item"));
        if (searchItem) {
          searchItem.forEach(item => {
            item.addEventListener('click', () => {
              const coinId = item.querySelector('.currency-id').innerHTML;
              const coinName = item.querySelector('.currency-name').innerHTML;
              const coinImage = item.querySelector('.currency-image').firstElementChild.src;
              document.getElementById(direction).innerHTML = "";
              document.getElementById(direction).innerHTML = selectedCoinTemplate(coinId, coinName, coinImage);
              if (!(Array.from(document.getElementById(`${direction}-currency-search-result`).classList)).includes('hide')) {
                document.getElementById(`${direction}-currency-search-result`).classList.add('hide');
              }
              convert("forward")();
            });
          });
        }
      });
    }
  }
}

const convert = (direction) => {
  return () => {
    let from, to, amount, result;
    if(direction === "backward") {
      from = "to";
      to = "from";
      result = "amount";
      amount = "result";
    } else if (direction === "forward") {
      from = "from";
      to = "to";
      result = "result";
      amount = "amount";
    }

    document.getElementById(`${result}`).value = "";
    const fromCurrency = document.querySelector(`#${from} .currency-id`);
    const toCurrency = document.querySelector(`#${to} .currency-id`);

    if (fromCurrency && toCurrency) {
      fetch("https://api.coingecko.com/api/v3/coins/" + fromCurrency.innerHTML)
      .then(response => {
        return response.json();
      })
      .then(data1 => {
        const fromCurrencyToBtc = data1.market_data.current_price.btc;
        return fetch("https://api.coingecko.com/api/v3/coins/" + toCurrency.innerHTML)
        .then(response => {
          return response.json();
        })
        .then(data2 => {
          const toCurrencyToBtc = data2.market_data.current_price.btc;
          const conversionRate = fromCurrencyToBtc / toCurrencyToBtc;
          const total = document.getElementById(`${amount}`).value * conversionRate;

          document.getElementById(`${result}`).value = total;
          document.getElementById(`${result}`).style.color = "green";
          setTimeout(() => {
            document.getElementById(`${result}`).style.color = "black";
          }, 500);
        });
      });
    } else {
      // document.getElementById('result').innerHTML = "Please select a currency";
    }
  }
}

const swapCurrency = () => {
  const tempCurrency = document.querySelector('#from').innerHTML;
  document.querySelector('#from').innerHTML = document.querySelector('#to').innerHTML;
  document.querySelector('#to').innerHTML = tempCurrency;
  convert("forward")();
}

const init = () => {
  const bitcoinId = "bitcoin";
  const bitcoinName = "Bitcoin";
  const bitcoinImageSrc = "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png?1547033579";

  const tetherId = "tether";
  const tetherName = "Tether";
  const tetherImageSrc = "https://assets.coingecko.com/coins/images/325/thumb/tether.png?1547034089";
  
  document.getElementById('from').innerHTML = "";
  document.getElementById('from').innerHTML = selectedCoinTemplate(bitcoinId, bitcoinName, bitcoinImageSrc);

  document.getElementById('to').innerHTML = "";
  document.getElementById('to').innerHTML = selectedCoinTemplate(tetherId, tetherName, tetherImageSrc);

  convert("forward")();
}

window.onload = () => {
  init();
  
  const exchangeCurrencyButton = document.getElementById('exchange-button');
  const searchBoxWrapper = Array.from(document.querySelectorAll(".search-box-wrapper"));
  const amountInput = Array.from(document.querySelectorAll(".amount-input"));

  searchBoxWrapper.forEach(item => {
    item.addEventListener('click', () => {
      item.innerHTML = inputTemplate(item.id);
      item.querySelector('.search-box').focus();
      item.querySelector('.search-box').select();
      item.querySelector('.search-box').addEventListener('keydown', debounce(search(item.id), 200));
    });
  });

  amountInput.forEach(item => {
    if(item.id === "amount") {
      item.addEventListener('keydown', debounce(convert("forward"), 200));
    } else if (item.id === "result") {
      item.addEventListener('keydown', debounce(convert("backward"), 200));
    }
  })

  exchangeCurrencyButton.addEventListener('click', swapCurrency);

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
