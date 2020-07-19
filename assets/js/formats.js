//***********************************************************************************
// formats file - for quick formatting of values for display
//***********************************************************************************

function formatMoney(number) {
    return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
  function currencyFormat(num,pr) {
    return '$' + num.toFixed(pr).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }




