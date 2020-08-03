// method 1, ajax call
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
window.convert2 = function() {
  const fromCurrency = document.getElementById('from-currency').textContent;
  const toCurrency = document.getElementById('to-currency').textContent;

  const getJsonResponse = (coin) => {
    return fetch("https://api.coingecko.com/api/v3/coins/" + coin)
    .then(response => {
      return response.json();
    });
  }

  const jsonResponse1 = getJsonResponse(fromCurrency);
  const jsonResponse2 = getJsonResponse(toCurrency);

  Promise.all([jsonResponse1, jsonResponse2])
  .then(data => {
    const fromCurrencyToBtc = data[0].market_data.current_price.btc;
    const toCurrencyToBtc = data[1].market_data.current_price.btc;
    const conversionRate = fromCurrencyToBtc / toCurrencyToBtc;
    document.getElementById('to-currency-value').value = document.getElementById('from-currency-value').value * conversionRate;
  })
  .catch(error => {
    console.log(error);
  });
}
