/*
 * Requestor basic information
 */
var userId;
/* Development variables */
var fileExt		= ".html";
var siteUrl		= "http://localhost:8080/cc";
/*
 * Request variables
 */
var qId;
var itemsDetails = []; 
var documentType;
var requestStatus;
var totalPrice = [];
var userList = [];
var requestNotification;

/* Constant values */
var  personType			= 	[ 	
								"BILLING OFFICIAL", 
								"CARD HOLDER", 
								"DIRECTORATE APPROVAL",  
								"FINANCIAL OFFICER/J8", 
								"IT APPROVAL/J6", 
								"PROPERTY BOOKS OFFICER/J4",
								"SUPPLY"
							];
var  personRank      	= 	[ 
								"1LT/02", "2LT/01", "A1C/E3", "AMN/E2","CAPT/03", "CAPT/06", "CDR/05", "CIV", "CMC/E9", "COL/06", "CPL/E4", 
								"CPO/E7", "CSM/E9", "CTR", "CWO-2", "CWO-3", "CWO-4","CWO-5","ENS/01","GYSGT/E7","LCDR/04","LCPL/E3","LT/03",
								"LTC/05", "LTJG/02","MAJ/04", "MCPO/E9", "MGYSGT/E9", "MSG/E8", "MSGT/E7", "MSGT/E8", "P01/E6", "P02/E5", "P03/E4",
								"PFC/E2", "PFC/E3", "PV2/E2", "SA/E2", "SFC/E7", "SSG/E6", "SGM/E9", "SGT/E5", "SMSGT/E8", "SN/E3", "SPC/E4", "SRA/E4", "SSGT/E5", "TSGT/E6"];
var  personDirectorate 	=   [ 	
								"J1", "J2", "J3", "J4", "J5", "J6", "J8", 
								"JOG-E", "JSOAC-E", "SSD", "SOPA", "SOJA", 
								"SOCG", "SOF CELL", "SOHC", "NSWU2", "TF10"
							];
var  fundingSource 		=   [ 	
								"MFP-11 Base (SOCE OPS)",
								"MFP-11 OCO (SOCE OPS)",
								"MFP-11 EDI (SOCE EDI and Training OPS)",
								"MFP-2 PDP",
								"MFP-2 PDP OCO",
								"MFP-2 EDI",
								"ORF",
								"POTFF"
							];

var  fiscalYear			=   [ "No Funding",2019,2020,2021,2022,2023];

/*    
 * Fetch site classification to render top banner - function might be deprecated in the future  
 */
var getCommandData = function(){
	$.ajax({  
		url: siteUrl+"/_api/web/lists/getbytitle('ccCommand')/Items?$Select=Title, COMMAND_URL, COMMAND_WARNING, COMMAND_CLASSIFICATION", 
        type: "GET",  
		headers: {  
            "Accept": "application/json;odata=verbose"  
		},  
		success: function(data, textStatus, xhr) {  
			var t="", ta="", tb="";  
			$.each(data.d.results, function(i, item) {            	        	    
				t+=item.Title;   
                ta+=item.COMMAND_WARNING;
                tb+= item.COMMAND_CLASSIFICATION;
                document.getElementById('command').innerHTML=t;              
			})
		},  
		error: function r(xhr, textStatus, errorThrown) {  
			console.log("error 'getCommanddata': " + JSON.stringify(xhr));  
		}  
	});  
}

/*
 * Fetch card holder and billing officials
 */
function getUser(){
	$.ajax({  
		url: siteUrl+"/_api/web/lists/getbytitle('ccUsers')/Items", 
        type: "GET",  
		headers: {  
            "Accept": "application/json;odata=verbose"  
		},  
		success: function(data, textStatus, xhr) {
			$.each(data.d.results, function(i, item){
				/* this need to be fixed and separete the function */
				userList.push(item);
			});
		},  
		error: function r(xhr, textStatus, errorThrown) {  
			console.log("error 'getUserRole': " + JSON.stringify(xhr));  
		}  
	});	
}

/*
 * Set users basic profile information
 */
var personInformation = function(){
	var information = {
			personLastName 		: $("#personLName").val(),
			personFirstName 	: $("#personFName").val(),
			personEmail  		: $("#personEmail").val(),
			personRole  		: $("#personRole option:selected").text(),
			personRank  		: $("#personRank option:selected").text(),
			personDirectorate 	: $("#personDirectorate option:selected").text(),
			personActive 	 	: $("#personActive option:selected").text(),
			pseudoName  	 	: $("#personRole option:selected").text() +  $("#personLName").val() + $("#personFName").val()
		};
	return 	information;		
}	
	
/* 
 * Attributes inputs
 */
var personAttributes = function() {
	var attribute  = {
			cardType		: $("#cardType option:selected").text(),
			cardId   		: $("#ccCardID").val(),
			cardLimit 		: $("#ccCardLimit").val(),
			currentExchange : $("#ccExchangeRate").val(),
			openDate 		: $("#openDate").val(),
			closeDate 		: $("#closeDate").val(),
			cycleLimit  	: $("#ccCycleLimit").val(),
			spendingLimit	: $("#ccSPL").val(),
			personAgent  	: $("#ccAgent").val(),
			levelFour   	: $("#cclevel4").val(),
			levelFive    	: $("#cclevel5").val(),
			billingOfficial : $("#billingOfficialCardHolder").val()
		};
	var jsonString = JSON.stringify(attribute);
	return jsonString;				
};

/*
 * Training inputs 
 */
var personTraining	= function (){
	var numItems 	= $('.training').length;
	var item  		= {}; 
	for( j=0;j<numItems;j++){
		item[j] = { 
			id  	: $('.training')[j].id, 
			date 	: $('.training')[j].value
		};
	}
	var jsonString = JSON.stringify(item);
	return jsonString; 
}

/*
 * Gather Approval data inpurt from form
 */
var getApprovalData = function(){
	var ApprovalData = {	
			/* Directores section */
			directorateComment:   $("#directorateComments").val(),
			directorateStatus:    $("#directorateReview").val(), 
			directorateSignature: encodeURIComponent($("#directorateSignature").val()),
			/* Billin Official section */
			boComment:   $("#boComments").val(),
			boStatus:    $("#boReview").val(), 
			boSignature: encodeURIComponent($("#boSignature").val()),
			/* J6 section */
			j6Comment: $("#j6Comments").val(),
			j6Status:  $("#j6Review").val(), 
			j6Signature:  encodeURIComponent($("#j6Signature").val()),
			/* PBO section */
			pboComment:   $("#pboComments").val(),
			pboStatus:    $("#pboReview").val(), 
			pboSignature: encodeURIComponent($("#pboSignature").val()),
			/* Budget Officer section */
			budgetOfficerComment:   $("#budgetOfficerComments").val(),
			budgetOfficerStatus:    $("#budgetOfficerReview").val(), 
			budgetOfficerSignature: encodeURIComponent($("#budgetOfficerSignature").val()),
			/* J8 section */
			j8Comment:    $("#j8Comments").val(),
			j8FiscalYear: $("#j8FiscalYear option:selected").val(),
			j8Quater:     $("#j8Quater option:selected").val(),
			j8Signature:  encodeURIComponent($("#j8Signature").val()),
			/* Card Holder section */
			cardHolderComment:       $("#cardHolderComments").val(),
			cardHolderTransactionId: $("#cardHolderTransactionId").val(),
			cardHolderSignature: encodeURIComponent($("#cardHolderSignature").val()),
			/* Requestor section */
			requestorComment: $("#requestorComments").val(),
			requestorSignature: encodeURIComponent($("#requestorSignature").val()),	
			/* Supply section */
			supplyComment:  $("#supplyComments").val(), 
			supplySignature: encodeURIComponent($("#supplySignature").val()),
			/* J4 section */
			j4Comment:   $("#j4Comments").val(),
			j4Signature: encodeURIComponent($("#j4Signature").val())
		};
	return ApprovalData;
} 

/* 
 * Verification steps 
 */
var returnedStep = 	[	
		{stepName: 'directorate',	stepStatus:'DIRECTORATE_APPROVAL', 		stepArray: ['directorateComment','directorateStatus','directorateSignature']},
		{stepName: 'bo', 			stepStatus:'BILLING_OFFICIAL_APPROVAL', stepArray: ['boComment','boStatus','boSignature']},
		{stepName: 'j6',	 		stepStatus:'J6_APPROVAL', 				stepArray: ['j6Comment','j6Status','j6Signature'] },
		{stepName: 'pbo', 			stepStatus:'PBO_APPROVAL', 				stepArray: ['pboComment','pboStatus','pboSignature']},
		{stepName: 'budget',		stepStatus:'BUDGET_OFFICER_APPROVAL',	stepArray: ['budgetOfficerComment','budgetOfficerStatus','budgetOfficerSignature']},
		{stepName: 'j8',			stepStatus:'J8_APPROVAL', 				stepArray: ['j8Comment','j8FiscalYear','j8Quater','j8Signature']},
		{stepName: 'cardholder',	stepStatus:'CARD_HOLDER_VALIDATION', 	stepArray: ['cardHolderComment','cardHolderTransactionId','cardHolderSignature']},
		{stepName: 'requestor',		stepStatus:'REQUESTOR_VALIDATION', 		stepArray: ['requestorComment','requestorSignature']},
		{stepName: 'supply',		stepStatus:'SUPPLY_VALIDATION', 		stepArray: ['supplyComment','supplySignature']},
		{stepName: 'j4',			stepStatus:'FINAL_VALIDATION', 			stepArray: ['j4Comment','j4Signature']}
	];

/*
 * Return signature values for each step
 */
var returnedSignatureStep = [	
		{name: 'directorate',	domId: '#directorateSignature' },
		{name: 'bo', 			domId: '#boSignature'},
		{name: 'j6',	 		domId: '#j6Signature'},
		{name: 'pbo', 			domId: '#pboSignature'},
		{name: 'budget', 		domId: '#budgetOfficerSignature'},
		{name: 'j8',			domId: '#j8Signature'},
		{name: 'cardholder',	domId: '#cardHolderSignature'},
		{name: 'requestor',		domId: '#requestorSignature'},
		{name: 'supply',		domId: '#supplySignature'},
		{name: 'j4',			domId: '#j4Signature'}
	];	

/*
 * Set the Dollar or Euro value
 */
var setCurrency = function(){
	var returnCurrent;
	$("#RequestCurrencyType").is(":checked") === true ? returnCurrent = 'Dollar': returnCurrent = 'Euro';
	return returnCurrent;
}

/*
 * Set the Dollar or Euro value
 */
var setJ6Validation = function(){
	var returnCurrent;
	$("#RequestIsJ6").is(":checked") === true ? returnCurrent = 'Yes': returnCurrent = 'No';
	return returnCurrent;
}


/*
 * Create object with all the initial values
 */
var createInitialJson = function(){  
	var initialJson = { 
			RequestCardType			: $("#RequestCardType option:selected").val(),
			Requestor				: $("#Requestor").val(),
			RequestorCardHolderName	: $("#RequestCardHolderName").val(),
			RequestorDSN			: $("#RequestorDSN").val(),							
			RequestorDirectorate	: $("#personDirectorate option:selected").val(),
			RequestDateofRequest	: $("#RequestDateOfRequest").val(),				
			RequestSource			: $("#RequestSource").val(),							
			RequestJustification	: $("#RequestJustification").val(),					
			RequestCurrencyType		: setCurrency(),
			RequestIsJ6				: setJ6Validation()
		};
	var jsonString = JSON.stringify(initialJson);
	return jsonString;				  
}

/*
 * Get all SP users and return and array
 */
var getSpUserList = function(){
	var userArray = [];
	$.ajax({  
		url: siteUrl+"/_api/web/siteusers", 
        type: "GET",  
		headers: {  
            "Accept": "application/json;odata=verbose"  
		},  
		success: function(data, textStatus, xhr) {
			$.each(data.d.results, function( index, value ) {
  				userArray.push(value.LoginName);
			});
		},  
		error: function r(xhr, textStatus, errorThrown) {  
			console.log("getSpUserList: error");  
		}  
	});
	return userArray;
}

/*
 * Populate user search with SharePoint user list
 */
var getSpUser = function (){
	var users = getSpUserList();

	var substringMatcher = function(strs) {
  		return function findMatches(q, cb) {
    		var matches = [];
    		var substringRegex;
    	    substrRegex = new RegExp(q, 'i');
    		$.each(strs, function(i, str) {
      			if (substrRegex.test(str)) {
        			matches.push(str);
      			}
    		});
    		cb(matches);
  		};
	};

	/* enable search on DOM */
	$('#bloodhound .typeahead')
	.typeahead({
		input: 'Typeahead-input',
		hint: true,
		highlight: true,
		minLength: 3,
		cursor: true
	},{
		name: 'users',
		source: substringMatcher(users)
	});
}


/*
 * Get accounts to start notification - BO
 */
var getCardHolderBillingApprover = function(){
    var id;
    var billingOfficialArray = [];

    $.each(userList, function( index, value ) {

		if ((userList[index].PERSON_EMAIL === requestNotification.RequestorCardHolderName) && (userList[index].PERSON_ROLE === 'CARD HOLDER')) {
			console.log(userList[index]);
            id = index;
            billingOfficialArray['billingOfficial'] = JSON.parse(userList[id].PERSON_ATTRIBUTES).billingOfficial;
            billingOfficialArray['directorAprove']  = userList[id].PERSON_DIRECTORATE;
            //billingOfficialArray['cardHolder']		= requestNotification.RequestorCardHolderName;
		}
    });
	return billingOfficialArray;
}

/*
 * Directorate approval
 */
var getDirectorateApprover = function(){
    var directorateArray = [];
    $.each(userList, function( index, value ) {
        if ((userList[index].PERSON_DIRECTORATE === getCardHolderBillingApprover().directorAprove) && (userList[index].PERSON_ROLE === 'DIRECTORATE APPROVAL')){
           directorateArray.push(userList[index].PERSON_EMAIL); 
        }
    });
    return directorateArray;
} 

/*
 * J6 approval
 */
var getOtherApprover = function(role){
    var directorateArray = [];
    $.each(userList, function( index, value ) {
        if (userList[index].PERSON_ROLE === role){
           directorateArray.push(userList[index].PERSON_EMAIL); 
        }
    });
    return directorateArray;
} 