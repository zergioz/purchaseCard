function getCurrentExchnageRate(){
	$.ajax({
	    type: "GET",
	    contentType: "application/json; charset=utf-8",
	    url: "https://free.currencyconverterapi.com/api/v6/convert?q=USD_EUR&compact=ultra&apiKey=caaaca1cb8d181fc1847",
	    async: false,
	    dataType: 'json',
	    success: function (response) {
	        $.each(response, function(idx, value){
	            //document.getElementById("ccExchangeRate").value = value;
	            document.getElementById("ccExchangeRate").setAttribute('value','My default value');
	        });
	    },
        error: function (response) {  
          alert("error 'getCurrentExchnageRate':" + JSON.stringify(response));  
      } 
	})
}
