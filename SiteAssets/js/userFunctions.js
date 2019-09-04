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
 * Create account information: including training and attributes. 
 */
function pushUserData(accountType){
	if (accountType === 'newAccount'){	
		createUserInformation();
		personTraining();	
		/*
		 * Redirect to edit page as default behaiviour
		 */
		setUserInformationRedirect(userId);
	}
	if (accountType === 'updateAccount'){
		updateUserInformation();
		personTraining();

	}
}

/*
 * Update User Accoint with the newest information
 */
function updateUserInformation(){
	//console.log('updateUserInformation '+personInformation());
	$().SPServices({
		operation: "UpdateListItems",
		aync: false,
		batchCmd: "Update",
		listName: "ccUsers",
		ID: userId,
		valuepairs:[["Title", personInformation().pseudoName ], 
					["PERSON_EMAIL", personInformation().personEmail], 
					["P_LAST_NAME", personInformation().personLastName],	
					["P_FIRST_NAME", personInformation().personFirstName], 
					["PERSON_ROLE", personInformation().personRole], 
					["PERSON_RANK", personInformation().personRank], 
					["PERSON_DIRECTORATE", personInformation().personDirectorate], 
					["PERSON_ATTRIBUTES", personAttributes()],
					["PERSON_TRAINING", personTraining()]],
		completefunc: function(xData, Status){
			console.log('update user account succesfully');
		}
	});
}

/*
 *	Create user account with input given with JQuery SP Service. The function "completefunc" will return the ID provided to the new account. 
 *	Such ID will be used to create the attributes and training tables.
 */
function createUserInformation(type){	
	$().SPServices({
		operation: "UpdateListItems",
		async: false,
		batchCmd: "New",
		listName:"ccUsers",
		valuepairs:[["Title", personInformation().pseudoName ], 
					["PERSON_EMAIL", personInformation().personEmail], 
					["P_LAST_NAME", personInformation().personLastName],	
					["P_FIRST_NAME", personInformation().personFirstName], 
					["PERSON_ROLE", personInformation().personRole], 
					["PERSON_RANK", personInformation().personRank], 
					["PERSON_DIRECTORATE", personInformation().personDirectorate], 
					["PERSON_ACTIVE", personInformation().personActive],
					["PERSON_ATTRIBUTES", personAttributes()],
					["PERSON_TRAINING", personTraining()]],
		completefunc: function (xData, Status) {
			$(xData.responseXML).SPFilterNode("z:row").each(function(){
				userId = $(this).attr("ows_ID");
			})
		}
	});	
}

