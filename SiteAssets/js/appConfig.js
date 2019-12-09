//@ts-check
'use strict';
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
var getRequestsList;
var getUsersList;
var getTrainingList ;

/*
 * Constant values
 */ 
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

var stepStatus = [
	{caseStep: 'DRAFT', 						fwd: "DRAFT", 					fwdj6:"DRAFT", numerStep:1},
	{caseStep: 'SUBMITTED', 					fwd: "DIR APPROVAL", 			fwdj6:"DIR APPROVAL", numerStep:2},
	{caseStep: 'DIRECTORATE_APPROVAL', 			fwd: "BO APPROVAL", 			fwdj6:"BO APPROVAL", numerStep:3},
	{caseStep: 'BILLING_OFFICIAL_APPROVAL', 	fwd: "PBO APPROVAL", 			fwdj6:"J6 APPROVAL", numerStep:4},
	{caseStep: 'J6_APPROVAL', 					fwd: "ERROR: SEE KM", 			fwdj6:"PBO APPROVAL", numerStep:5},
	{caseStep: 'PBO_APPROVAL', 					fwd: "J8 APPROVAL", 			fwdj6:"J8 APPROVAL", numerStep:6},	
	{caseStep: 'J8_APPROVAL', 					fwd: "CARD HOLDER VALIDATION",	fwdj6:"CARD HOLDER VALIDATION", numerStep:7},
	{caseStep: 'CARD_HOLDER_VALIDATION', 		fwd: "REQUESTOR VALIDATION",	fwdj6:"REQUESTOR VALIDATION", numerStep:8},
	{caseStep: 'REQUESTOR_VALIDATION', 			fwd: "SUPPLY VALIDATION",		fwdj6:"SUPPLY VALIDATION", numerStep:9.3},
	{caseStep: 'SUPPLY_VALIDATION',				fwd: "PENDING PBO FINAL",		fwdj6:"PENDING PBO FINAL", numerStep:9.6},
	{caseStep: 'FINAL_VALIDATION', 				fwd: "PENDING CLOSING",			fwdj6:"PENDING CLOSING", numerStep:9.9},
	{caseStep: 'CLOSED', 						fwd: "CLOSED",					fwdj6:"CLOSED", numerStep:10}		
];
/* 
 * Verification steps 
 */
var returnedStep = 	[	
		{stepName: 'directorate',	stepStatus:'DIRECTORATE_APPROVAL', 		stepArray: ['directorateComment','directorateStatus','directorateSignature'], domId: '#directorateSignature'},
		{stepName: 'bo', 			stepStatus:'BILLING_OFFICIAL_APPROVAL', stepArray: ['boComment','boStatus','boSignature'],domId: '#boSignature'},
		{stepName: 'j6',	 		stepStatus:'J6_APPROVAL', 				stepArray: ['j6Comment','j6Status','j6Signature'],domId: '#j6Signature' },
		{stepName: 'pbo', 			stepStatus:'PBO_APPROVAL', 				stepArray: ['pboComment','pboStatus','pboSignature'],domId: '#pboSignature'},
		{stepName: 'budget',		stepStatus:'BUDGET_OFFICER_APPROVAL',	stepArray: ['budgetOfficerComment','budgetOfficerStatus','budgetOfficerSignature'],domId: '#budgetOfficerSignature'},
		{stepName: 'j8',			stepStatus:'J8_APPROVAL', 				stepArray: ['j8Comment','j8FiscalYear','j8Quater','j8Signature'],domId: '#j8Signature'},
		{stepName: 'cardholder',	stepStatus:'CARD_HOLDER_VALIDATION', 	stepArray: ['cardHolderComment','cardHolderTransactionId','cardHolderExecuted','cardHolderSignature'],domId: '#cardHolderSignature'},
		{stepName: 'requestor',		stepStatus:'REQUESTOR_VALIDATION', 		stepArray: ['requestorComment','requestorSignature'],domId: '#requestorSignature'},
		{stepName: 'supply',		stepStatus:'SUPPLY_VALIDATION', 		stepArray: ['supplyComment','supplySignature'],domId: '#supplySignature'},
		{stepName: 'j4',			stepStatus:'FINAL_VALIDATION', 			stepArray: ['j4Comment','j4Signature'],domId: '#j4Signature'}
	];

/*
 * Return signature values for each step
 */
/*
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
*/

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
	for(var j = 0; j < numItems;j++){
		item[j] = { 
			id  	: $('.training')[j].id, 
			date 	: $('.training')[j].value
		};
	}
	var jsonString = JSON.stringify(item);
	return jsonString; 
}

/*
 * Gather Approval data input from form
 */
var getApprovalData = function(){
	var ApprovalData = {	
			/* Directores section */
			directorateComment:   $("#directorateComments").val(),
			directorateStatus:    $("#directorateReview").val(), 
			directorateSignature: encodeURIComponent( $("#directorateSignature").val()),
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
			cardHolderExecuted: $("#cardHolderExecuted").val(),
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
 * Fetch site classification to render top banner - function might be deprecated in the future  
 */
var getCommandData = function(){
	$.ajax({  
		url: siteUrl+"/_api/web/lists/getbytitle('ccCommand')/Items?$Select=Title, COMMAND_URL, COMMAND_WARNING, COMMAND_CLASSIFICATION", 
        type: "GET",  
		headers: { "Accept": "application/json;odata=verbose" },
	}).done(function(data) {  
		var t="", ta="", tb="";  
		$.each(data.d.results, function(i, item) {            	        	    
			t+=item.Title;   
            ta+=item.COMMAND_WARNING;
        	tb+= item.COMMAND_CLASSIFICATION;
            document.getElementById('command').innerHTML=t;              
		})
	}).fail(function r(xhr, textStatus, errorThrown) {  
		console.log("error 'getCommanddata': " + JSON.stringify(xhr));  
	});  
}

/*  
 * Fetch current user username and role and redder context for manipulation -  function might be deprecated in the future  
 */
var getCleanUser = function(){
	var userName;
	var a = document.getElementById("loginName").innerText;
	var t = a.split("\\");
	var l = t.length;
	a= t[l-1];
	$(document).ready(function(){
		userName = $().SPServices.SPGetCurrentUser({ fieldName: "Title"});
		document.getElementById("cleanUser").innerHTML=userName;
	});	
}

/*
 * Create promise to populate users
 */ 
var getUser = $.ajax({
   	url: siteUrl+"/_api/web/lists/getbytitle('ccUsers')/Items", 
    type: "GET",  
	headers: {  "Accept": "application/json;odata=verbose" }
});

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
    	    var substrRegex = new RegExp(q, 'i');
    		$.each(strs, function(i, str) {
      			if (substrRegex.test(str)) {
        			matches.push(str);
      			}
    		});
    		cb(matches);
  		};
	};

	/* enable search on DOM */
	$('#bloodhound .typeahead').typeahead({
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

/*
 *	get all users from CC_Users and display all user as table entries    
 */
function getAllUser(){
	getUsersList = getUser.done(function(data) {
		$.each(data.d.results, function( index, value ) {
			getUsersListHtml(value);
		});
	});
}

/*
 * Load values and append rows
 */
function getUsersListHtml(item){
	$('#usersList')
	.append('<tr>\
				<td>'+ item.Id +'</td>\
				<td>'+ item.PERSON_RANK +'</td>\
				<td>'+ item.P_LAST_NAME +'</td>\
				<td>'+ item.P_FIRST_NAME +'</td>\
				<td>'+ item.PERSON_ROLE +'</td>\
				<td>'+ item.PERSON_EMAIL +'</td>\
				<td><a href="#" onclick="setUserInformationRedirect('+item.Id+');">'+ item.PERSON_DIRECTORATE +'</td>\
			</tr>');

	getUsersList.done(function(data) {
		// FadeOut Splash Screen
		$(".modalLoad").fadeOut();
		// Enable table sorter once rows are loaded
		$('#myTable').tablesorter({
			sortList : [[0,1]],
			widgets: ['filter', 'pager']
			})
		.tablesorterPager({
			container: '.pager',
			size: 10, 
			output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
			removeRows: true,
			fixedHeight: false,
			cssGoto: '.gotoPage'	
		});
		// Format after loading 
		$("input").addClass("form-control");
	});			
}

/*
 * Populate card holder when getUser promise is completed
 */
var getCardHolder =  getUser.done(function(data) {
	$.each(data.d.results, function( index, value ) {
		getUserHtml(value);
	});
});

/*
 * Get user information based on UseId and assign values to form
 */
function getUserInformation(userId){
	getUser.done(function(data) {
		$.each(data.d.results, function( index, value ) {
  			if (userId === value.Id){
  				getUserInformationHtml(value);
  			}
		 });
	});
}

/*
 * Get Billin Officials to on edit and adding users page and Card Holder 
 */
function getBillingOfficial(){
	var billingOfficial = getUser.done(function(data) {
		$.each(billingOfficial, function( index, value ) {
			getUserHtml(value);
		});
	});
}

/*
 *	get all users from CC_Users and display all user as table entries    
 */
function getAllRequest(){
	getRequestsList = $.ajax({  
			url: siteUrl+"/_api/web/lists/getbytitle('ccRequestTracker')/Items", 
			type: "GET",
			cache: true,
			headers: {"Accept": "application/json;odata=verbose"}
	}).done(function(data) {  
		$.each(data.d.results, function(i, item) {
			getRequestsListHtml(item);

		});       
	}).fail(function r(xhr, textStatus, errorThrown) {  
		console.log("error 'getRequestsList': " + JSON.stringify(xhr));  
	});  
}
/*
 * Load values and append rows - fadeout splash screen 
 */
function getRequestsListHtml(item){
	$('#requestList')
		.append('<tr>\
					<td>'+ item.Id +'</td>\
					<td>'+ item.Title +'</td>\
					<td>'+ JSON.parse(item.REQUEST_FIELD).RequestorDirectorate +'</td>\
					<td>'+ getFiscalInformation(item.J8_APPROVAL,'year') +'</td>\
					<td>'+ getFiscalInformation(item.J8_APPROVAL,'quater') +'</td>\
					<td>'+ JSON.parse(item.REQUEST_FIELD).RequestJustification +'</td>\
					<td><a href="#" onclick="setRequestInformationRedirect('+item.Id+')">' + stepForwardStatus(item.REQUEST_STATUS,JSON.parse(item.REQUEST_FIELD).RequestIsJ6) +'</td>\
				</tr>');

	getRequestsList.done(function(data) {
		// Fadeout Splash Screen
		$(".modalLoad").fadeOut();
		// Enable sorting after finished loading rows
		$('#myTable').tablesorter({
			sortList : [[0,1]],
			widgets: ['filter', 'pager']
		}).tablesorterPager({
			container: '.pager',
			size: 10, 
			output: '{startRow} - {endRow} / {filteredRows} ({totalRows})',
			removeRows: true,
			fixedHeight: false,
			cssGoto: '.gotoPage'	
		});	
		//Format after loading 
		$("input").addClass("form-control");
	});		
}

/*
 * Fetch All training variables for customer and the id to cross reference user_id and course id 
 * and enable date picker right after appending items; otherwise, high network 
 * latency will make the call fail when loaded from the main "training list" page.
 */
function getTraining(){
	getTrainingList = $.ajax({  
		url: siteUrl+"/_api/web/lists/getbytitle('ccUsersTrainingCourses')/Items", 
		type: "GET", 	
		headers: { "Accept": "application/json;odata=verbose" }
	}).done(function(data) {  
		$.each(data.d.results, function(i, item) {
			getTrainingListHtml(item);
			$('input').filter(".training").datepicker();
		}) 	
	}).fail(function r(xhr, textStatus, errorThrown) {   
		alert("error 'getTrainingList': " + JSON.stringify(xhr));  
	});
}

/*
 * Load DOM values for users' training list
 */
function getTrainingListHtml(item){
	$('#usersTraining')
	.append('<tr id="'+ item.TARGET_AUDIENCE +'">\
				<td class="d-none d-xl-block">'+ item.Title +'</td>\
				<td>'+ item.COURSE_CODE +'</td>\
				<td class="d-none d-xl-block">'+ item.COURSE_FREQUENCY +'</td>\
				<td>'+ item.TARGET_AUDIENCE +'</td>\
				<td>\
					<div class="input-group mb-2">\
						<div class="input-group-prepend">\
							<div class="input-group-text">&#128197;</div>\
						</div>\
						<input id="'+item.ID+'"  name"'+item.COURSE_CODE+'" class="inputTextCCUser form-control training">\
						<div>\
					</td>\
			</tr>');
}


/*
 * Load DOM values for users' profile
 */
 function getUserInformationHtml(item){
	console.log("function: getUserInformationHtml");
	var attributes = JSON.parse(item.PERSON_ATTRIBUTES); 
	// Basic information
 	$('#personLName').val(item.P_LAST_NAME);
	$('#personFName').val(item.P_FIRST_NAME);
	$('#personEmail').val(item.PERSON_EMAIL);
	$("#personRole").val(item.PERSON_ROLE);
	$("#personRank").val(item.PERSON_RANK);
	$('#personDirectorate').val(item.PERSON_DIRECTORATE);
	$('#personActive').val(item.PERSON_ACTIVE);
	/*
	 * Attributes
	 */
	$('#cardType').val(attributes.cardType);
	$('#ccCardID').val(attributes.cardId);
	$('#ccCardLimit').val(attributes.cardLimit);
	$('#ccExchangeRate').val(attributes.currentExchange);
	$('#ccCycleLimit').val(attributes.cycleLimit);
	$('#openDate').val(attributes.openDate);
	$('#closeDate').val(attributes.closeDate);
	$('#ccSPL').val(attributes.spendingLimit);
	$('#ccAgent').val(attributes.personAgent);
	$('#cclevel4').val(attributes.levelFour);
	$('#cclevel5').val(attributes.levelFive);
	$('#billingOfficialCardHolder').select2().val(attributes.billingOfficial).trigger('change');
	/*
	 * Load card holder pane when it matches the user role
	 */
	getUserPanesHtml();
	/*
	 * Training information
	 */
	var training = JSON.parse(item.PERSON_TRAINING); 
	for (var key in training) {
  		$("#"+training[key]['id']).val(training[key]['date']);
	}
	getUser.done(function(data) {
		$(".modalLoad").fadeOut();
	});
 }


/*
 * Populate DOM 
 */
function getUserHtml(item){
	/*
	 * Add list to the purchase request list page
	 */
	item.PERSON_ROLE === "CARD HOLDER" ? $('#RequestCardHolderName').append('<option value="'+item.PERSON_EMAIL+'">'+item.PERSON_EMAIL+'</option>') : false;
	/*
	 * Add "billion official" roles to add and edit users page
	 */
	item.PERSON_ROLE === "BILLING OFFICIAL" ? $('#billingOfficialCardHolder').append('<option value="'+item.PERSON_EMAIL+'">'+item.PERSON_EMAIL+'</option>'): false;
}

/* 
 * load panes based on role for add and edit user page
 */
function getUserPanesHtml(){
	var e1 = $("#personRole option:selected").val();
	e1 !== "CARD HOLDER" ? $("#attributes_main").hide() : $("#attributes_main").show();
	e1 !== "CARD HOLDER" ? $("#billing_official_main").hide() : $("#billing_official_main").show();
	e1 === "CARD HOLDER" ? $("#training_main").show() : e1 === "BILLING OFFICIAL" ? $("#training_main").show() : $("#training_main").hide(); 
}

/*
 * Load autocomplete
 */
 function getAutoComplete(){
 	$('#billingOfficialCardHolder').select2();
 }

/*
 * Get fiscal information for request from JSON object
 */
function getFiscalInformation(jsonData,type){
	if (typeof jsonData !== 'undefined' && jsonData !== null){
		var parsedReturn;
	 	var parsedJson = JSON.parse(jsonData);
		type === 'year' ? parsedReturn = parsedJson.j8FiscalYear : parsedReturn = parsedJson.j8Quater;
	} else {
		parsedReturn = "Pending";
	}
	return parsedReturn;
}

/*
 * Display pending step in the authorization process
 * @param {string} status
 */
function stepForwardStatus(status,isJ6){
	console.log(status + " " + isJ6);
	var forwardStatus;
	for(var i = 0; stepStatus.length > i; i++ ){
		//console.log(stepStatus[i].fwd);
		isJ6 === 'Yes' ?   ( status === stepStatus[i].caseStep ? forwardStatus = stepStatus[i].fwdj6 : false) :
							 status === stepStatus[i].caseStep ? forwardStatus = stepStatus[i].fwd   : false;
	}			
	return forwardStatus;
}


/* 
 * Fetch all directorate for form consumption and data input standardization 
 */
function getDirectorate(){
	for(var i = 0; i < personDirectorate.length; i++){
		$('#personDirectorate').append('<option value="'+personDirectorate[i]+'">'+personDirectorate[i]+'</option>');
	}
}

/*
 * Fetch all ranks and titles for form consumption and data input standardization 
 */
function getRank(){
	for(var i = 0; i < personRank.length; i++){
		$('#personRank').append('<option value="'+personRank[i]+'">'+personRank[i]+'</option>');
	}
}

/*
 * Provide a standardized list for form-data consumption
 */
function getRole(){
	for(var i = 0; i < personType.length; i++){
		$('#personRole').append('<option value="'+personType[i]+'">'+personType[i]+'</option>');
	}
}

/*
 * Get user name for current user
 */
var getUserName = function(){
	return $().SPServices.SPGetCurrentUser({ fieldNames: ["Title", "Name"]});
}

/*
 * Provide 'status' colour for training status based on date and/or initial status of training 
 */
function getStatus(trainingStatus, trainingDate){
	if(trainingStatus == 'initial' || trainingDate == true){
		trainigStatus = '<button type="button" class="btn btn-success">Success</button>';
	}
	return trainingStatus;
}

/*
 * Set the Dollar or Euro value
 */
var setCurrency = function(){
	var returnCurrent;
	$("#RequestCurrencyType").is(":checked") === true ? returnCurrent = 'Dollar': returnCurrent = 'Euro';
	return returnCurrent;
}

/*
 * Set J6 validation
 */
var setJ6Validation = function(){
	var returnCurrent;
	$("#RequestIsJ6").is(":checked") === true ? returnCurrent = 'Yes': returnCurrent = 'No';
	return returnCurrent;
}

/*
 *	Get user user information based on provided id
 */
function setUserInformationRedirect(userId){
	window.open("../Pages/cc_user_edit"+fileExt+"?PersonId="+userId,"_self");
}

/*
 *	get user user information based on provided id
 */
function setRequestInformationRedirect(requestId,redirectArgument){
	window.open("../Pages/purchase_request"+fileExt+"?id="+requestId,'_blank');
}
/*
 *	get user user information based on provided id
 */
function setPrintViewRedirect(requestId,redirectArgument){
	window.open("../Pages/purchase_request_print"+fileExt+"?id="+requestId,'_blank');
}
/*
 *  Redirect user to defined url
 */
function redirectUrl(urlAddress){
	window.location.assign(urlAddress);
}

/*
 * Disable sign button by default - user has to approve or declined to enable it
 */ 
 function signatureRequired(){
 	// Disabled all sign buttons
 	$("[id$=Sign]").prop("disabled", "true");
 	// Enable sign buttons when changed 	
	$('#directorateReview').change(function(){
		$('#btnDirectorateSign').prop("disabled", false);
	});
	$('#boReview').change(function(){
		$('#btnBoSign').prop("disabled", false);
	});
	$('#j6Review').change(function(){
		$('#btnJ6Sign').prop("disabled", false);
	});
	$('#pboReview').change(function(){
		$('#btnPboSign').prop("disabled", false);
	});
	$('#j8FiscalYear').change(function(){
		$('#btnJ8Sign').prop("disabled", false);
	});
	$('#cardHolderComments').keydown(function(){
		$('#btnCardHolderSign').prop("disabled", false);
	});
	$('#requestorComments').keydown(function(){
		$('#btnRequestorSign').prop("disabled", false);
	});
	$('#supplyComments').keydown(function(){
		$('#btnSupplySign').prop("disabled", false);
	});
	$('#j4Comments').keydown(function(){
		$('#btnJ4Sign').prop("disabled", false);
	});
 }	
