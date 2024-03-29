import { http } from './http';
import { nav } from './nav';
import reload from './reload';
import { formatNumber } from './formatters';

const globalLink = 'https://api.coingecko.com/api/v3/global';
const buttons = document.querySelectorAll('.check-button');
const check = document.getElementById('check');
const results = document.getElementById('results');
let activeCoin = 'btc';

// Event listeners
document.addEventListener('DOMContentLoaded', nav.getMarketData(globalLink));
check.addEventListener('click', getAddressInfo);

buttons.forEach((button) => {
  button.addEventListener('click', selectCoin);
});

function selectCoin(e) {
  e.preventDefault();

  // SELECT CORRECT COIN
  buttons.forEach((button) => {
    button.classList.remove(button.id + '-active');
  });

  const button = e.target;
  activeCoin = button.id;

  button.classList.add(button.id + '-active');

  // Set correct placeholder
  const placeholder =
    activeCoin === 'btc' ? 'Enter BTC address...' : 'Enter ETH address...';
  const coin = document.getElementById('type-container');

  coin.placeholder = placeholder;
}

async function getAddressInfo() {
  // GET ADDRESS INFO
  const coin = document.getElementById('type-container').value;
  if (!coin) return;

  const loader = document.getElementById('loader');
  loader.className = 'loader';

  const addressAPI = getAddress(coin);

  await http
    .get(addressAPI)
    .then((data) => {
      if (data.error)
        results.innerHTML = `<span class="warning">${data.error}!</span>`;
      else {
        addHTML(data);
        // SCROLL INTO VIEW
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    })
    .catch(() => {
      loader.className = '';
      reload('home-c');
    });

  loader.className = '';
}

function getAddress(coin) {
  if (activeCoin === 'btc') {
    return `https://api.blockcypher.com/v1/btc/main/addrs/${coin}/balance`;
  } else if (activeCoin === 'eth') {
    return `https://api.blockcypher.com/v1/eth/main/addrs/${coin}/balance`;
  }
}

function addHTML(data) {
  const divider = activeCoin === 'btc' ? 100000000 : 1000000000000000000;

  const html = `
  <div><span class='label'>Address: </span><span class='info'>${
    data.address
  }</span></div>
  <div><span class='label'>Balance: </span><span class='info'>${formatNumber(
    data.balance / divider,
    0
  )} ${activeCoin.toUpperCase()}</span></div>
  <div><span class='label'>Unconfirmed Balance: </span><span class='info'>${formatNumber(
    data.unconfirmed_balance / divider,
    0
  )} ${activeCoin.toUpperCase()}</span></div>
  <div><span class='label'>Transactions: </span><span class='info'>${
    data.n_tx
  }</span></div>
  <div><span class='label'>Unconfirmed transactions: </span><span class='info'>${
    data.unconfirmed_n_tx
  }</span></div>
  <div><span class='label'>Total Sent: </span><span class='info'>${formatNumber(
    data.total_sent / divider,
    0
  )} ${activeCoin.toUpperCase()}</span></div>
  <div><span class='label'>Total Received: </span><span class='info'>${formatNumber(
    data.total_received / divider,
    0
  )} ${activeCoin.toUpperCase()}</span></div>
  `;

  results.innerHTML = html;
}
