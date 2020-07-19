//***********************************************************************************
// Exchange Script  - js for the main exchange page
//***********************************************************************************


    var BTCUSD = 0;

    async function pullBTCPrice (){
            let resBTC = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"); // api call for exchange listings
            let BTCPrice = await resBTC.json(); // process json response for exchanges
            console.log(BTCPrice);
      
                BTCUSD = BTCPrice.bitcoin.usd;
                console.log(BTCUSD);
      
    }

//<!-- loop through 100 records at a time sorted by selected element-->
  async function showExchanges () {
    let resExchange = await fetch("https://api.coingecko.com/api/v3/exchanges"); // api call for exchange listings
    let exData = await resExchange.json(); // process json response for exchanges
    let html = "";
    let yearEst = " - ";
    let country = " - ";


    console.log(exData);
    console.log("Records on the page => " + exData.length);    
    for (i = 0; i < exData.length; i++) {          
        if (exData[i].year_established != null){ yearEst = exData[i].year_established};
        if (exData[i].country != null){ country = exData[i].country};

        html +=  `<div class='row coins-row'>
                    <div class='col-1 text-center'>${exData[i].trust_score_rank} </div>
                    <div class='col-2'><a href='${exData[i].url}' target='_blank'><img src='${exData[i].image}' class='coin-logo' alt='${exData[i].name}><span class='coin-name'>${exData[i].name}</span></a></div>
                    <div class='col-1 text-center'>${exData[i].trust_score} </div>
                    <div class='col-2 text-right'>${currencyFormat((BTCUSD * exData[i].trade_volume_24h_btc),0)}</div>
                    <div class='col-2 text-right'>${currencyFormat((BTCUSD * exData[i].trade_volume_24h_btc_normalized),0)}</div>
                    <div class='col-3 text-right'>${country}</div>
                    <div class='col-1 text-center'>${yearEst}</div>
                    </div>
                `;

    }
  
  $( "#titles" ).after ($(html));

    
  }

  $(document).ready(function () {
    pullBTCPrice();
    showExchanges ();


  })