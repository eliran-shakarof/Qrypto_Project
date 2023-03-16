const getCoinsList = () => {
    $.ajax({
    url: coinsListURL,
    success: (response) => {
     $("#progBar").hide();
      console.log(response);
      buildingCards(response);
    },
    error: (error) => {
      console.log(error);
    },
  });
};


const getCoinData = (coinName) => {
  $("#myCollapse_"+coinName).html(mySpinner());
  $.ajax({
    url: coinDataURL +  coinName,     
    success: (response) => {
      console.log(response);
      myInfo(response,coinName);
      storageFunc(coinName,response);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

const getDataForGraph = (symbolCoinList) => {
  if(symbolCoinList != ""){
    $("#noChosen").hide();
    $.ajax({
      url: graphsURL + symbolCoinList + inEachValue,     
      success: (response) => {
        console.log(response);
        makeArrayForGraph(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }else{
    clearInterval(myInterval);
    $("#noChosen").show();
    $("#chartContainer").html("");
  }
};

