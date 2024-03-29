function addToStorage(coin, active, ls, quantity) {
  // Get name of the coin
  let id = coin.closest('tr').id;

  // Get ls arr
  const coins = localStorage.getItem(ls);
  let getArr = [];

  // Get coin arr from storage, else new
  if (coins) {
    getArr = JSON.parse(coins);

    if (ls === 'coins') {
      const index = getArr.indexOf(id);

      // Add new coin to arr
      if (index < 0) {
        getArr.push(id);
      } else {
        getArr.splice(index, 1);
      }
    } else {
      const index = getArr.findIndex((coin) => coin.id === id);

      // Check if portfolio coin is present
      if (index >= 0) {
        getArr.splice(index, 1);
      } else {
        getArr.push({ id: id, quantity: quantity });
      }
    }

    // Set new arr
    localStorage.setItem(ls, JSON.stringify(getArr));
  } else {
    // Add new coin to ls
    if (!coin.classList.contains(active)) {
      if (ls === 'coins') {
        getArr.push(id);
      } else {
        const portfolioCoin = { id: id, quantity: quantity };
        getArr.push(portfolioCoin);
      }

      localStorage.setItem(ls, JSON.stringify(getArr));
    }
  }
}

export default addToStorage;
