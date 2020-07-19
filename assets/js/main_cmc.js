//***********************************************************************************
// Main js for CMC project page
//***********************************************************************************

    let curPage = 0;
 //   let ttlCap = 0;
    var coins = 0;
    let coinPages = "https://api.coingecko.com/api/v3/coins/list"; // API to pull full listing of coins to determine page and coin totals
    let coinDataURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=true&price_change_percentage=24h0&page="; //add page number to parse full coin data
    // pull page number from get params in URL
    let urlParams = new URLSearchParams(window.location.search);
    curPage = Number(urlParams.get('p'));
    console.log("Current Page => " + curPage);    
    if (curPage == null || curPage == ""){
      curPage = 1;
    }

    async function countPages () {       
      let response1 = await fetch(coinPages); // api call for page count
      let pageData = await response1.json(); // process json response for page count
      coins = pageData.length;
      console.log("Total pages (pagecount) => " + Math.round(pageData.length / 100));
      console.log("Total coins/tokens => " + coins);    
      $("#coinTtl").html(coins);    
      pageCount = Math.round(pageData.length / 100);   
      return pageCount;
    }


    async function pullMarketCap(pageCount){
      let ttlCap = 0;
      pgTTL = await countPages ();
      for (let p = 1; p <= pgTTL; p++) {
        let res2 = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false&page=" + p); // api call for page count
        let coinData = await res2.json(); // process json response for coin data
        for (let i = 0; i < coinData.length; i++) {
          if (coinData[i].market_cap != null && coinData[i].market_cap != ""){
            ttlCap += Number(coinData[i].market_cap);

          }
        }
        $("#marketCap").html(currencyFormat(ttlCap,0));
      } // loop all pages

    }




//<!-- loop through 100 records at a time sorted by selected element-->
    async function showCoinInfo (curPage) {
      let html = "";
      let fetchURL = coinDataURL + curPage
      let res3 = await fetch(fetchURL); // api call for page count
      console.log(fetchURL);
      console.log(res3.status);
      let coinData = await res3.json(); // process json response for coin data
      let coinRank = 0;
      let coinName = "";
      let symbol = "";
      let sparkhtml = ""; 



      console.log(coinData);
      console.log("Records on the page => " + coinData.length);    
      for (i = 0; i < coinData.length; i++) {
        
        coinRank = coinData[i].market_cap_rank;
        coinName = coinData[i].name;
        symbol = coinData[i].symbol;
      // set value defaults for crap coins with no data
        let coinCap = " - ";
        let price = " - ";
        let volume = " - ";
        let supply = " - ";
        let change= " - ";


        if (coinData[i].market_cap != null){
          coinCap = currencyFormat (coinData[i].market_cap,0 );
        }
        if (coinData[i].current_price != null){
          price =  currencyFormat(coinData[i].current_price,2);
        }
        if (coinData[i].total_volume != null){
          volume = currencyFormat(coinData[i].total_volume,0);
        }
        if (coinData[i].circulating_supply != null){
          supply = formatNumber(Math.round(coinData[i].circulating_supply),0);
        }
        if (coinData[i].price_change_percentage_24h != null){
            change =  parseFloat(coinData[i].price_change_percentage_24h).toFixed(2)+'%';
        }
        let changeColor = "text-success";
        if (coinData[i].price_change_percentage_24h < 0 ){
          changeColor = "text-danger";
        }
        
      let priceDates = []; // array for date of price
      let priceData = coinData[i].sparkline_in_7d.price; //array for price

      
      sparkhtml += `<canvas id='sparkl${i}' width='100' height='50'></canvas>
              const ctx = document.getElementById('sparkl${i}').getContext('2d');
              const chart = new Chart(ctx, {type: 'line', data: {labels: [${priceDates}],datasets: [ {    data: [${priceData}]}] },
              options: {responsive: false, legend: { display: false }, elements: {line: {borderColor: '#000', borderWidth: 1 }, point: { radius: 0 } },  tooltips: { enabled: false  },
              scales: { yAxes: [ { display: false } ], xAxes: [ { display: false } ] } }}); `;
      sparkhtml = "";

      html +=  `<div class='row coins-row'>
                  <div class='col-1 pl-3'>${coinRank}</div>
                  <div class='col-2'><img src='${coinData[i].image}' class='coin-logo' alt=''><span class='coin-name'>${coinName}</span></div>
                  <div class='col-2 text-right'>${coinCap}</div>
                  <div class='col-2 text-right'>${price} </div> 
                  <div class='col-2 text-right'>${volume} </div>
                  <div class='col-2 text-right text-uppercase'>${supply} ${symbol} </div>
                  <div class='col-1 text-center ${changeColor}'>${change}</div>
                  
                  </div>
                `;
// removed <div class='col-1 sparkl'> ${sparkhtml} </div> for now - add feature later
      }
    
    $( "#titles" ).after ($(html));

    }

    $(document).ready(function () {
      let pageCount = countPages();
      $("#coinTtl").html(coins);
      pullMarketCap(pageCount);
      showCoinInfo (curPage);


      let prevPg = curPage - 1;
      let nextPg = curPage + 1;
      if (pageCount >= nextPg + 1){
        $(".nextPg").hide();
        nextPg = curPage - 1;
      }
      $(".prevPg").attr("href","coinmarketcap.html?p=" + prevPg);
      $(".nextPg").attr("href","coinmarketcap.html?p=" + nextPg);
    })


