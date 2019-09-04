/*
 * Requestor basic information
 */
var userId;

/*
 * Request variables
 */
var itemsDetails = []; 
var qId;
var documentType;
var requestStatus;
var totalPrice = [];

/* Constant values */
var  personType			= 	[ "BILLING OFFICIAL", "CARD HOLDER" ];
var  personRank      	= 	[ "CIV", "CTR", "AMN/E-2", "A1C/E-3", "SRA/E-4", "SSGT/E-5", "TSGT/E-6", "MSGT/E-7", "SMSGT/E-8", "PV2/E-2", "PFC/E-3", "SPC/E-4", "SGT/E-5", "SFC/E-7", "MSG/E-8", "SGM/E-9", "CSM/E-9", "PFC/E-2", "LCPL/E-3", "CPL/E-4", "GYSGT/E-7", "MSGT/E-8", "MGYSGT/E-9", "SA/E-2", "SN/E-3", "P03/E-4", "P02/E-5", "P01/E-6", "CPO/E-7", "MCPO/E-9", "CMC/E-9", "2LT/0-1", "1LT/0-2", "CAPT/0-3", "MAJ/0-4", "LTC/0-5", "COL/0-6", "ENS/0-1", "LTJG/0-2", "LT/0-3", "LCDR/0-4", "CDR/0-5", "CAPT/0-6" ];
var  personDirectorate 	=   [ "CG", "J1", "J2", "J3", "J4", "J5", "J6", "J8", "JX", "JOSOAC-E", "SSD"];
var  fundingSource 		=   [ "SOCE OPS", "3RD Joint Special Operations Aviation Component Ops", "SOCE EDI and Training Ops", "SOCE Military Liaison OPS Baseline", "SOCE Sensitive Activities", "SOCE OPS", "TSOC Persistent Engagement Sustainment Support OPS", "OCO", "EUCOM CE2T2", "PDP MFP2", "OCO - P2", "EDI - MFP2"];
var  fiscalYear			=   [ "No Funding","2019","2020","2021","2021","2022"];

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
			levelFive    	: $("#cclevel5").val()  	
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
		console.log($('.training').id);
		item[j] = 	{ 
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
			/*
			 * Directores section
			 */
			directorateComment:   $("#directorateComments").val(),
			directorateStatus:    $("#directorateReview").val(), 
			directorateSignature: encodeURIComponent($("#directorateSignature").val()),
			/*
			 * Billin Official section
			 */
			boComment:   $("#boComments").val(),
			boStatus:    $("#boReview").val(), 
			boSignature: encodeURIComponent($("#boSignature").val()),
			/*
			 * J6 section
			 */
			j6Comment: $("#j6Comments").val(),
			j6Status:  $("#j6Review").val(), 
			j6Signature:  encodeURIComponent($("#j6Signature").val()),
			/*
			 * PBO section
			 */
			pboComment:   $("#pboComments").val(),
			pboStatus:    $("#pboReview").val(), 
			pboSignature: encodeURIComponent($("#pboSignature").val()),
			/*
			 * Budget Officer section
			 */
			budgetOfficerComment:   $("#budgetOfficerComments").val(),
			budgetOfficerStatus:    $("#budgetOfficerReview").val(), 
			budgetOfficerSignature: encodeURIComponent($("#budgetOfficerSignature").val()),
			/*
			 * J8 section
			 */
			j8Comment:    $("#j8Comments").val(),
			j8FiscalYear: $("#j8FiscalYear option:selected").val(),
			j8Quater:     $("#j8Quater option:selected").val(),
			j8Signature:  encodeURIComponent($("#j8Signature").val()),
			/*
			 * Card Holder section
			 */
			cardHolderComment:       $("#cardHolderComments").val(),
			cardHolderTransactionId: $("#cardHolderTransactionId").val(),
			cardHolderSignature: encodeURIComponent($("#cardHolderSignature").val()),
			/*
			 * Requestor section
			 */
			requestorComment: $("#requestorComments").val(),
			requestorSignature: encodeURIComponent($("#requestorSignature").val()),	
			/*
			 * Supply section
			 */
			supplyComment:  $("#supplyComments").val(), 
			supplySignature: encodeURIComponent($("#supplySignature").val()),
			/*
			 * J4 section
			 */
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
 * create JSON string for with the initial values
 */
var createInitialJson = function(){  
	var initialJson = { 
			RequestCardType			: $("#RequestCardType option:selected").val(),
			Requestor				: $("#Requestor").val(),
			RequestorCardHolderName	: $("#RequestCardHolderName option:selected").val(),
			RequestorDSN			: $("#RequestorDSN").val(),							
			RequestorDirectorate	: $("#personDirectorate option:selected").val(),
			RequestDateofRequest	: $("#RequestDateOfRequest").val(),				
			RequestSource			: $("#RequestSource").val(),							
			RequestJustification	: $("#RequestJustification").val(),					
			RequestCurrencyType		: setCurrency()
		};
	var jsonString = JSON.stringify(initialJson);
	return jsonString;				  
}

