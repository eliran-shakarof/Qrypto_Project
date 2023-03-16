var options;
var myInterval;

const myGraphs= () =>{
    graphDataArray = [];
    let coinSymbolNames = coinCheckedSymbolList();
    getDataForGraph(coinSymbolNames)
    options = new CanvasJS.Chart("chartContainer" ,{
        exportEnabled: true,
        animationEnabled: true,
        title:{
            text: coinSymbolNames + " to " + fiatCoin,
        },
        axisY: {
            title: "Coin Value",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: graphDataArray
    });
    myInterval = setInterval(() => {getDataForGraph(coinSymbolNames)}, 2000);
};

function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
}


const makeArrayForGraph = (response) => {
    graphDataArrayIndex = 0;
    $.each(response, function (index, value) { 
        graphDataArray[graphDataArrayIndex].dataPoints.push({x: new Date(), y: value.USD});
        graphDataArrayIndex += 1;
    });
    console.log(graphDataArray);
    options.render();
};

const coinCheckedSymbolList = () => {
    let coinSymbolNames = "";
    chosenCoins = $(".onMain").filter(function(){return $(this).find(".Toggles").prop("checked")}).clone();
    $.each(chosenCoins, function (index, value) { 
        let coinName = $(value).find(".Symbols").html();
        coinSymbolNames += coinName +","; 
        let data = { ...coinGraphData };
        data.dataPoints = [];
        data.name = coinName;
        graphDataArray.push(data);
    });
    coinSymbolNames = coinSymbolNames.slice(0, -1);
    return coinSymbolNames;    
};