const coinsListURL = "https://api.coingecko.com/api/v3/coins";
const coinDataURL = "https://api.coingecko.com/api/v3/coins/";
const graphsURL = "https://min-api.cryptocompare.com/data/pricemulti?fsyms="; 
const fiatCoin = "USD";
const inEachValue = "&tsyms=" + fiatCoin;

const maxChosenCoins = 5; // maximum number of coins to choose
const waitingTimeStorage = 2; //the minutes to wait for new call of coin api

let cardsCounter = 0;
let toggleOnCounter = 0; // counter of cards that chosen 
let chosenCoins = []; // list of coins are chosen in home

let coinData = { //object for coin
    image: "",
    usd_value: "",
    eur_value: "",
    ils_value: "",
};

let coinStorage = { //object for storage
    time : "",
    data : "",
};

let coinGraphData = {  //graph data object
    type: "spline",
    name: "",
    showInLegend: true,
    xValueFormatString: "",
    yValueFormatString: "#,##0$",
    dataPoints: [],
};
let graphDataArray = [];
