/*
 *	get all users from CC_Users and display all user as table entries    
 */
function getUsersList(){
	$.ajax({  
		url: "../_api/web/lists/getbytitle('ccUsers')/Items", 
		type: "GET",
		cache:true,
		headers: { 
			"Accept": "application/json;odata=verbose"  
		}, 
		success: function(data, textStatus, xhr) {  
			$.each(data.d.results, function(i, item) {
				getUsersListHtml(item);
			})        
		}, 
		error: function r(xhr, textStatus, errorThrown) {  
			alert("error 'getCommanddata': " + JSON.stringify(xhr));  
		}  
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
}

/*
 *	get all users from CC_Users and display all user as table entries    
 */
function getRequestsList(){
	$.ajax({  
		url: "../_api/web/lists/getbytitle('ccRequestTracker')/Items", 
		type: "GET",
		cache:true,
		headers: {"Accept": "application/json;odata=verbose"}, 
		success: function(data, textStatus, xhr) {  
			$.each(data.d.results, function(i, item) {
				getRequestsListHtml(item);
			})        
		}, 
		error: function r(xhr, textStatus, errorThrown) {  
			alert("error 'getCommanddata': " + JSON.stringify(xhr));  
		}  
	});  
}

/*
 * Load values and append rows
 */
function getRequestsListHtml(item){
	$('#usersList')
		.append('<tr>\
					<td>'+ item.Id +'</td>\
					<td>'+ item.Title +'</td>\
					<td>'+ JSON.parse(item.REQUEST_FIELD).RequestorDirectorate +'</td>\
					<td>'+ getFiscalInformation(item.J8_APPROVAL,'year') +'</td>\
					<td>'+ getFiscalInformation(item.J8_APPROVAL,'quater') +'</td>\
					<td>'+ JSON.parse(item.REQUEST_FIELD).RequestJustification +'</td>\
					<td><a href="#" onclick="setRequestInformationRedirect('+item.Id+')">' + item.REQUEST_STATUS +'</td>\
				</tr>');
}

/*
 * Get fiscal information for request from JSON object
 */
function getFiscalInformation(jsonData,type){
	if (typeof jsonData !== 'undefined' && jsonData !== null){
		var parsedReturn;
	 	var parsedJson = JSON.parse(jsonData);
		type = 'year' ? parsedReturn = parsedJson.j8FiscalYear : parsedReturn = parsedJson.j8Quater;
	}
	return parsedReturn;
}

/*
 * Get user information based on UseId and assign values to form
 */
 function getUserInformation(userId){
	$.ajax({  
		url: "../_api/web/lists/getbytitle('ccUsers')/Items("+userId+")", 
		type: "GET",
		cache:true,
		headers: { 
			"Accept": "application/json;odata=verbose"  
		}, 
		success: function(data, textStatus, xhr) {  
			$.each(data, function(i, item) {
				getUserInformationHtml(item);
			})        
		}, 
		error: function r(xhr, textStatus, errorThrown) {  
			alert("error 'getCommanddata': " + JSON.stringify(xhr));  
		}  
	});
 }

/*
 * Load DOM values for users' profile
 */
 function getUserInformationHtml(item){
 	var attributes = JSON.parse(item.PERSON_ATTRIBUTES); 
 	/*
 	 * Basic information
 	 */
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
	$('#cardType').attr(attributes.cardType);
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
	/*
	 * Load card holder pane when it matches the user role
	 */
	item.PERSON_ROLE === "CARD HOLDER" ? $("#attributes_main").css("display", "block") : $("#attributes_main").css("display", "none");
	/*
	 * Training information
	 */
	var training = JSON.parse(item.PERSON_TRAINING); 
	for (var key in training) {
  		$("#"+training[key]['id']).val(training[key]['date']);
	}
 }
 
/*
 * Fetch All training variables for customer and the id to cross reference user_id and course id 
 * and enable date picker right after appending items; otherwise, high network 
 * latency will make the call fail when loaded from the main "training list" page.
 */
function getTrainingList (){
	$.ajax({  
		url: "../_api/web/lists/getbytitle('ccUsersTrainingCourses')/Items", 
		type: "GET", 	
		headers: { 
			"Accept": "application/json;odata=verbose"  
		}, 
		success: function(data, textStatus, xhr) {  
			$.each(data.d.results, function(i, item) {
				getTrainingListHtml(item);
			})
			$('input').filter(".training").datepicker();	 
		}, 
		error: function r(xhr, textStatus, errorThrown) {  
			alert("error 'getTrainingList': " + JSON.stringify(xhr));  
		}  
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
 * Get card holder list
 */
function getUserCardHolder(){
	$.ajax({  																						  
		url: "../_api/web/lists/getbytitle('ccUsers')/Items", 
		type: "GET", 	
		headers: { 
			"Accept": "application/json;odata=verbose"  
		}, 
		success: function(data, textStatus, xhr) {
			$.each(data.d.results, function(i, item) {
					$('#RequestCardHolderName')
						.append('<option>'+item.PERSON_DIRECTORATE+" / "+item.P_LAST_NAME+" "+item.P_FIRST_NAME+"</option>");
			})
		}, 
		error: function r(xhr, textStatus, errorThrown) {  
			alert("error 'getTrainingList': " + JSON.stringify(xhr));  
		}  
	});
} 
 
/*    
 * Fetch site classification to render top banner - function might be deprecated in the future  
 */
function getCommandData(){
	$.ajax({  
		url: "../_api/web/lists/getbytitle('ccCommand')/Items?$Select=Title, COMMAND_URL, COMMAND_WARNING, COMMAND_CLASSIFICATION", 
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
 * Fetch current user username and role and redder context for manipulation -  function might be deprecated in the future  
 */
function getCleanUser(){
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
 * Fetch all directorate for form consumption and data input standardization 
 */
function getDirectorate(){
	for(i = 0; i < personDirectorate.length; i++){
		$('#personDirectorate').append('<option value="'+personDirectorate[i]+'">'+personDirectorate[i]+'</option>');
	}
}

/*
 * Fetch all ranks and titles for form consumption and data input standardization 
 */
function getRank(){
	for(i = 0; i < personRank.length; i++){
		$('#personRank').append('<option value="'+personRank[i]+'">'+personRank[i]+'</option>');
	}
}

/*
 * Provide a standardized list for form-data consumption
 */
function getRole(){
	for(i = 0; i < personType.length; i++){
		$('#personRole').append('<option value="'+personType[i]+'">'+personType[i]+'</option>');
	}
}

/*
 * get user name for current user
 */
function getUserName(){
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
 *	get user user information based on provided id
 */
function setUserInformationRedirect(userId){
	window.open("../Pages/cc_user_edit.aspx?PersonId="+userId,"_self");
}

/*
 *	get user user information based on provided id
 */
function setRequestInformationRedirect(userId,redirectArgument){
	window.open("../Pages/Purchase_Request.aspx?id="+userId,redirectArgument);
}

/*
 *  redirect user to defined url
 */
function redirectUrl(urlAddress){
	window.location.assign(urlAddress);
} 			