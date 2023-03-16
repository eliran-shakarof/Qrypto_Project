$(()=>{
    navbarListener();
    getCoinsList();
    searchCoinBar();
    myModalBuilder();
    toggleOnListener();
    moreInfoListener();
});

const navbarListener = () => {
    $("#about >").hide();
    $("#liveReports >").hide();

    $("#homeBtn").click(function(){
        $("#home").show();
        $(".card").show();
        $("#about >").hide();
        clearInterval(myInterval);
        $("#liveReports >").hide();
    });

    $("#liveReportsBtn").click(function(){
        $("#home").hide();
        $("#about >").hide();
        $("#liveReports >").show();
        myGraphs();
    });

    $("#aboutBtn").click(function(){
        $("#home").hide();
        $("#about >").show();
        clearInterval(myInterval);
        $("#liveReports >").hide();
    });
};

const searchCoinBar = () => {
    $("#searchCoinBtn").on("click", function(){
        $("#home").show();
        $("#about >").hide();
        clearInterval(myInterval);
        $("#liveReports >").hide();

        let symbol = $("#searchCoin").val().toLowerCase();
        if(symbol == ""){
            $(".card").show();
        }else{
            $(".card").hide();
            $("#"+symbol+"_card").show();
        }
    });

};

const buildingCards = (response) => {
    let myString = "";
    myString += `<div class="container">
                    <div class="row w-100 mx-auto">`;
    response.map((item) => {
        myString += buildOneCard(item);
    });
    myString += `</div></div>`;
    $("#home").append(myString);
}

const buildOneCard = (item) => {
    let myString = "";
    myString += `<div class="card onMain col-md-4 col-6" id="${item.symbol}_card">
                    <div id="${item.id}" class="card-body form-check form-switch">
                        <div id="mainInfo">
                            <input type="checkbox" id="toggleCard_${item.id}" class="Toggles form-check-input float-end"/>
                            <h5 class="Symbols card-title">${(item.symbol).toUpperCase()}</h5>
                            <p class="card-text">${item.id}</p>
                        </div>
                        <br/>
                        <div class="moreInfo" id="moreInfo_${item.id}">
                            <input type="button" id="moreInfoButton" class="btn btn-primary" value="More Info"
                                data-bs-toggle="collapse" data-bs-target="#myCollapse_${item.id}"/>
                            <div class="collapse" id="myCollapse_${item.id}"></div>
                        </div>
                    </div>
                 </div>
    `;
    return myString;
}

const myModalBuilder = () => {
    let myModalString = "";
    myModalString += `
            <div class="modal" id="myModal" >    
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="width:400px">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Coins That You Have Choose:</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div id="myModelBody" class="modal-body"></div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button id="saveButton" type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
      $("body").append(myModalString);
};

const modalJumping = (waitingCoin) => {
    waitingCoin.prop("checked",false);
    filterOnCoins();
    $("#saveButton").one("click",function () {
        let uncheckedModalCards = ($(chosenCoins).filter(function(){
                return (!($(this).find(".Toggles").prop("checked")))
            }));

        /*Unchecked the original coins*/
        $.each(uncheckedModalCards, function (index, value) { 
            let cardName = $(this).children().attr("id");
            toggleOnCounter -= 1;
            $("#"+cardName).find(".Toggles").prop("checked", false); 
        });

        /*Checked the coin we want*/
        if (toggleOnCounter < maxChosenCoins){
             toggleOnCounter += 1;
             waitingCoin.prop("checked",true); 
        }
        $('#myModal').modal('hide');
    });  
};

const toggleOnListener = () => {  
    $("#home").on("change", ".Toggles", function() {
        if($(this).prop("checked")){ 
            if(toggleOnCounter >= maxChosenCoins){
                modalJumping($(this));
            }else{
                toggleOnCounter += 1;
            }
        }else{
            toggleOnCounter -= 1;   
            $(this).prop("checked",false);
        }
    });
};

const filterOnCoins = () => {
    chosenCoins = $(".onMain").filter(function(){return $(this).find(".Toggles").prop("checked")}).clone();
    $(chosenCoins).find(".moreInfo").remove();
    $(chosenCoins).removeClass("onMain");
    $("#myModelBody").html(chosenCoins);
    $('#myModal').modal('show');
};

const moreInfoListener = () => {
       $(document).on("click", "#moreInfoButton", function () {
            let coinName = ($(this).parent().attr("id").substring(9));
                     
            /*Checking if the coin is in sessionStorage less than 2 minutes*/
            if(JSON.parse(sessionStorage.getItem(coinName)) != null){
                let coinFromStorage = JSON.parse(sessionStorage.getItem(coinName));
                if((new Date() - coinFromStorage.time) / (1000*60) < waitingTimeStorage ){
                    myInfo(coinFromStorage.data,coinName);
                }else{
                    sessionStorage.removeItem(coinName);
                    getCoinData(coinName);
                }
            }else{
                getCoinData(coinName);
            }
      });
    };

const storageFunc = (coinName,response) => {
    let coinToStorage = {...coinStorage};
    coinToStorage.time = new Date().getTime();
    coinToStorage.data = response;
    sessionStorage.setItem(coinName, JSON.stringify(coinToStorage));
};

const myInfo = (response,cardId) => {
    myCoinInfo = {...coinData};
    myCoinInfo.image = response.image.thumb;
    myCoinInfo.usd_value = response.market_data.current_price.usd + "$";
    myCoinInfo.eur_value = response.market_data.current_price.eur + "€";
    myCoinInfo.ils_value = response.market_data.current_price.ils + "₪";
    let myString = "";
    myString += `<div><br/>
                    <p><img src="${myCoinInfo.image}" width='30px'/></p>
                    <span>USD Value: ${myCoinInfo.usd_value}</span><br/>
                    <span>EUR Value: ${myCoinInfo.eur_value}</span><br/>
                    <span>ILS Value: ${myCoinInfo.ils_value}</span><br/>
                 </div>`;
    $("#myCollapse_"+cardId).html(myString);
}

const mySpinner = () => {
    let myString = "";
    myString += `<br/><div id="mySpin" class="spinner-border mx-auto" role="status">
                          <span class="visually-hidden">Loading...</span>
                      </div>`;
    return myString;
};
