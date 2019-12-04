//@ts-check
'use strict';
/*
 * Training inputs 
 */
var personTraining	= function (){
	var item  		= {}; 
	var numItems 	= $('.training').length;
	for(var j = 0; j < numItems; j++){
		console.log($('.training').id);
		item[j] = { 
			id  	: $('.training')[j].id, 
			date 	: $('.training')[j].value
				  };
	}
	var jsonString = JSON.stringify(item);
	return jsonString; 
}

/*	
 * Create account information: including training and attributes. 
 */
function pushUserData(accountType){
	if (accountType === 'newAccount'){	
		createUserInformation();
	}
	if (accountType === 'updateAccount'){
		updateUserInformation();
	}
}

/*
 *	Create user account with input given with JQuery SP Service. The function "completefunc" will return the ID provided to the new account. 
 *	Such ID will be used to create the attributes and training tables.
 */
function createUserInformation(){
	console.log("function: createUserInformation");
	$().SPServices({
		operation: "UpdateListItems",
		webURL: siteUrl,
		async: false,
		batchCmd: "New",
		listName:"ccUsers",
		valuepairs:[
						["Title", personInformation().pseudoName], 
						["PERSON_EMAIL", personInformation().personEmail], 
						["P_LAST_NAME", personInformation().personLastName],	
						["P_FIRST_NAME", personInformation().personFirstName], 
						["PERSON_ROLE", personInformation().personRole], 
						["PERSON_RANK", personInformation().personRank], 
						["PERSON_DIRECTORATE", personInformation().personDirectorate], 
						["PERSON_ACTIVE", personInformation().personActive],
						["PERSON_ATTRIBUTES", personAttributes()],
						["PERSON_TRAINING", personTraining()]
					],
		completefunc: function (xData, Status) {
			$(xData.responseXML).SPFilterNode("z:row").each(function(){
				userId = $(this).attr("ows_ID");
			})
		}
	});
	// Redirect
	setTimeout(function(){
		setUserInformationRedirect(userId);
	}, 2000);	
}

/*
 * Update User Accoint with the newest information
 */
function updateUserInformation(){
	console.log('function: updateUserInformation');
	$().SPServices({
		operation: "UpdateListItems",
		webURL: siteUrl,
		aync: false,
		batchCmd: "Update",
		listName: "ccUsers",
		ID: userId,
		valuepairs:[
						["Title", personInformation().pseudoName ], 
						["PERSON_EMAIL", personInformation().personEmail], 
						["P_LAST_NAME", personInformation().personLastName],	
						["P_FIRST_NAME", personInformation().personFirstName], 
						["PERSON_ROLE", personInformation().personRole], 
						["PERSON_RANK", personInformation().personRank], 
						["PERSON_DIRECTORATE", personInformation().personDirectorate],
						["PERSON_ACTIVE", personInformation().personActive], 
						["PERSON_ATTRIBUTES", personAttributes()],
						["PERSON_TRAINING", personTraining()]
					],
		completefunc: function(xData, Status){
			console.log('update user account succesfully');
		}
	});
	setTimeout(function(){
		setUserInformationRedirect(userId);
	}, 2000);
}

/*
 * Send Notification
 */
function sendNotification(from,recipient,subject,body){
	console.log('Executing Email Notification');
	var siteurl = _spPageContextInfo.webServerRelativeUrl;
	var urlTemplate = siteUrl + "/_api/SP.Utilities.Utility.SendEmail";
	
	$.ajax({
	    contentType: 'application/json',
	    url: urlTemplate,
	    type: "POST",
	    data: JSON.stringify({
	        'properties': {
	            	'metadata': {
	                'type': 'SP.Utilities.EmailProperties'
	        },
	        	'From': from,
	            'To': {
	                'results': recipient
	        },
	            'Body': body,
	            'Subject': subject
	        }
	    }),
    	headers: {
	    	"Accept": "application/json;odata=verbose",
	    	"content-type": "application/json;odata=verbose",
	        "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
	    },
    	success: function(data) {
        	alert('Email Sent Successfully');
        	var isSent = true;
    	},
    	error: function(err) {
        	alert('Error in sending Email to System Admin: ' + JSON.stringify(err));
    	}
	});
}

