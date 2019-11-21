/*
 * Load the progress bar
 */
function loadProgressBar(status, cur, Total){
	var w = Number(Total);	
	var a = Math.round(w);
	var y = Number(cur)*a;		
	document.getElementById("myRequestProgress").innerHTML='<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="'+y+'" aria-valuemin="0" aria-valuemax="100" style="width:'+y+'%">'+status+' '+y+'%</div>';
}

/*
 * get item id from url 
 */
function getCurrentId(){
	var url =  window.location.search;
	var res =  url.split("=");
	/* Set and return as global */		
	qId =  res[1];
	return qId;
}

/* 
 * Call for current user
 */
function GetCurrentUser(){
	var userName=$().SPServices.SPGetCurrentUser({ fieldName:"Title" });
	$("#myUser").text(userName);
}

/*
 * Initial load when created - will load the data using a caml query to load existing data if it exists
 */
function loadCCRequestTracker(qId){
	if (qId > 0) {
		/*jshint multistr: true */
		var query = "<Query><Where><Eq><FieldRef Name='ID'/><Value Type='Text'>"+qId+"</Value></Eq></Where></Query>";
		var viewFields = "<ViewFields><FieldRef Name='ID'/>\
						   <FieldRef Name='REQUEST_FIELD'/>\
						   <FieldRef Name='PURCHASE_DETAILS'/>\
						   <FieldRef Name='DIRECTORATE_APPROVAL'/>\
						   <FieldRef Name='J6_APPROVAL'/>\
						   <FieldRef Name='PBO_APPROVAL'/>\
						   <FieldRef Name='BILLING_OFFICIAL_APPROVAL'/>\
						   <FieldRef Name='J8_APPROVAL'/>\
						   <FieldRef Name='CARD_HOLDER_VALIDATION'/>\
						   <FieldRef Name='REQUESTOR_VALIDATION'/>\
						   <FieldRef Name='SUPPLY_VALIDATION'/>\
						   <FieldRef Name='FINAL_VALIDATION'/>\
						   <FieldRef Name='FISCAL_YEAR'/>\
						   <FieldRef Name='REQUEST_STATUS'/>\
						  </ViewFields>";
		$().SPServices({
			operation:"GetListItems",
			webURL: siteUrl,
			asyn: true,
			listName: "ccRequestTracker",
			CAMLQuery: query,
			CAMLViewFields: viewFields,
			completefunc: function(xData){
				$(xData.responseXML)
					.SPFilterNode("z:row")
					.each(function(){
						/* Load information for notification */
						requestNotification = JSON.parse($(this).attr("ows_REQUEST_FIELD"));	
						/* Load requester information */
						loadRequestorDom(JSON.parse($(this).attr("ows_REQUEST_FIELD")));			
						/* Load order details or load default if entry is empty or ivalid */					
						loadDetailsDom(JSON.parse($(this).attr("ows_PURCHASE_DETAILS")));
						loadRowDetails(JSON.parse($(this).attr("ows_PURCHASE_DETAILS")));
						/*
						 * load verification process - tabs  
						 * provide: 
						 *  - Ows object
						 *  - DOM #id to poulate in array form 
						 *  - JSon property name in array form 
						 */
	 					loadReviewTab($(this).attr("ows_DIRECTORATE_APPROVAL"),['#directorateComments','#directorateSignature','#directorateReview'],['directorateComment','directorateSignature','directorateStatus'],'#directorateText');
					 	loadReviewTab($(this).attr("ows_BILLING_OFFICIAL_APPROVAL"),['#boComments','#boSignature','#boReview'],['boComment','boSignature','boStatus'],'#billingOfficialText');
						loadReviewTab($(this).attr("ows_J6_APPROVAL"),['#j6Comments','#j6Signature','#j6Review'],['j6Comment','j6Signature','j6Status'],'#j6Text');
					 	loadReviewTab($(this).attr("ows_PBO_APPROVAL"),['#pboComments','#pboSignature','#pboReview'],['pboComment','pboSignature','pboStatus'],'#propertyBookText');
						//loadReviewTab($(this).attr("ows_BUDGET_OFFICER_APPROVAL"),['#budgetOfficerComments','#budgetOfficerSignature','#budgetOfficerReview'],['budgetOfficerComment','budgetOfficerSignature','budgetOfficerStatus'],'#budgetOfficerText');
					 	loadReviewTab($(this).attr("ows_J8_APPROVAL"),['#j8Comments','#j8Signature','#j8Review','#j8FiscalYear','#j8Quater'],['j8Comment','j8Signature','j8Status','j8FiscalYear','j8Quater'],'#j8Text');
						loadReviewTab($(this).attr("ows_CARD_HOLDER_VALIDATION"),['#cardHolderComments','#cardHolderTransactionId','#cardHolderSignature'],['cardHolderComment','cardHolderTransactionId','cardHolderSignature'],'#cardHolderText');
						loadReviewTab($(this).attr("ows_REQUESTOR_VALIDATION"),['#requestorComments','#requestorSignature'],['requestorComment','requestorSignature'],'#requestorText');	
						loadReviewTab($(this).attr("ows_SUPPLY_VALIDATION"),['#supplyComments','#supplySignature'],['supplyComment','supplySignature'],'#supplyText');
						loadReviewTab($(this).attr("ows_FINAL_VALIDATION"),['#j4Comments','#j4Signature'],['j4Comment','j4Signature'],'#j4Text');
						/* Load request status and set status bar */
						setValue($(this).attr("ows_REQUEST_STATUS"));
						/* Check for qId to enable upload option */
						disableUploads(qId);
						disableSubmit(qId);	
						/* List attached Items */
						listMyAttachments(qId);
						/* if Request is finizalied and closed make it read only */
						isClosed($(this).attr("ows_REQUEST_STATUS"));
					});
			}, 
			error: function(xhr, textStatus, errorThrown){alert('Error');	}	
		});
	}else{
		/* Load order details */
		loadRowDetails();
		/* Check for qId to enable upload and submit options */
		disableUploads();
		disableSubmit();
	}
}

/*
 * Load SharePoint list values - there should be an item ID by the time this is loaded.
 */
function loadRequestorDom(myObj){
	console.log(myObj)
	setTimeout(function() {
		$("#RequestCardType").val(myObj.RequestCardType); 	
		$("#RequestUser").text(myObj.RequestUser);
		$("#RequestStatus").text(myObj.RequestStatus);	
		$("#RequestCardHolderName").val(myObj.RequestorCardHolderName);
		$("#Requestor").val(myObj.Requestor);
		$("#RequestorDSN").val(myObj.RequestorDSN);
		$("#RequestorDirectorate").val(myObj.RequestorDirectorate);
		$("#RequestDateOfRequest").val(Date(myObj.RequestDateOfRequest));
		$("#personDirectorate").val(myObj.RequestorDirectorate);
		$("#RequestJustification").val(myObj.RequestJustification);
		$("#RequestSource").val(myObj.RequestSource);			
		$("#RequestCurrencyType").bootstrapToggle(dValue(myObj.RequestCurrencyType));
		$("#RequestIsJ6").bootstrapToggle(j6Value(myObj.RequestIsJ6));
	},500);
}

/*
 * Load DOM with correct information from SP List
 */
function loadDetailsDom(requestDetails){
	/* Append,count, build details and, disable action to delete based on number of rows  */	
	for (var counter = 0; counter < requestDetails.Details.length; counter++){
		var newRow = $("<tr>");
		var cols = "";
		/* Add rows and columns */
		newRow.append(rowDetailsColHtml(counter,cols));
		$("#myPurchaseRequest").append(newRow);
		/* Set values for all inputs */
		$("#RequestQTY"+counter).val(requestDetails.Details[counter].requestQty);
		$("#Description"+counter).val(requestDetails.Details[counter].requestDesc);
		$("#DD"+counter).prop( "checked", isBool(requestDetails.Details[counter].requestDdForm));
		$("#Source"+counter).val(requestDetails.Details[counter].requestSrc);
		$("#RequestCost"+counter).val(requestDetails.Details[counter].requestCost);
		$("#RequestTotal"+counter).val(requestDetails.Details[counter].requestTotal);
		/* Add return to array as float to sum and update DOM */
		totalPrice.push(parseFloat(requestDetails.Details[counter].requestTotal));	
		/* Disable delete */
		disableDeleteBtn(counter,1);
		/* re-arrange details array to track old data and add new data attributes correctly */
		createDetails(counter);
	}
	/* Update total value when loading values */
	addGrandTotal(totalPrice);
}

/*
 * Create draft request and fetch request id to redirect
 */
function createDraftRequest(){
	$().SPServices({
		operation: "UpdateListItems",
		webURL: siteUrl,
		async: false,
		batchCmd: "New",
		listName:"ccRequestTracker",
		valuepairs:[
			["Title", $("#Requestor").val()],
			["REQUEST_FIELD", createInitialJson()], 
			["PURCHASE_DETAILS", createDetailsJson()],
			["REQUEST_STATUS",	"DRAFT"]
		],
		completefunc: function (xData, Status) {
			$(xData.responseXML).SPFilterNode("z:row").each(function(){
				var newId = $(this).attr("ows_ID");
				setTimeout(function(){
					redirectUrl("purchase_request"+fileExt+"?id="+newId);
				}, 2000);	
			});
		}
	});
	
}

/*
 * Set request status to submit
 */
function modifyDraftRequest(){
	/* DEBUG */
	console.log("function: modifyDraftRequest");
	$().SPServices({
		operation: "UpdateListItems",
		webURL: siteUrl,
		async: false,
		batchCmd: "Update",
		listName: "ccRequestTracker",
		ID: qId,
		valuepairs:[
			["REQUEST_FIELD", createInitialJson()],
			["PURCHASE_DETAILS", createDetailsJson()]
		],
		completefunc: function(xData, Status){
			setTimeout(function(){
				redirectUrl("purchase_request"+fileExt+"?id="+qId);
			}, 2000);
		}
	});
}

/*
 * Save data as JSON string to SharePoint list - DRAFT button.
 */
function submitDraft(){
	/* DEBUG */
	console.log("Function: Save Draft");
	/* for undefined requests "new" entries. Create and add details and save draft */
	typeof qId === 'undefined' ? createDraftRequest() : modifyDraftRequest();
}

/*
 * Submit Form
 */
function submitRequest(){
	/* DEBUG */
	console.log("submitRequest", qId);
	/* Save latest changes */
	submitDraft();
	/* Change status of request to SUBMITTED */
	createSubmit();
}

/*
 * Chaange request to submit
 */
function createSubmit(){
	/* Change Status */
	$().SPServices({
		operation: "UpdateListItems",
		webURL: siteUrl,
		aync: false,
		batchCmd: "Update",
		listName: "ccRequestTracker",
		ID: qId,
		valuepairs:[["REQUEST_STATUS",	"SUBMITTED"]],
		completefunc: function(xData, Status){
			console.log('submitRequest: change request status to SUBMITTED');
		}
	});	
}

/*
 * Save review data from form
 */
function submitReview(fieldUpdate,fieldJson){	
	$().SPServices({
		operation: "UpdateListItems",
		webURL: siteUrl,
		aync: false,
		batchCmd: "Update",
		listName: "ccRequestTracker",
		ID: qId,
		valuepairs:[[fieldUpdate,fieldJson],
					["REQUEST_STATUS",fieldUpdate]],
		completefunc: function(xData, Status){
			console.log('submitReview');
		}
	});	
}

/*
 * Close request and set read only
 */
function closeRequest(){
	/* DEBUG */
	console.log("Function: closeRequest");
	$().SPServices({
		operation: "UpdateListItems",
		webURL: siteUrl,
		aync: false,
		batchCmd: "Update",
		listName: "ccRequestTracker",
		ID: qId,
		valuepairs:[['REQUEST_STATUS','CLOSED']],
		completefunc: function(xData, Status){
			console.log('closeRequest: Changed request status to "CLOSED" to ID# '+qId);
		}
	});	
}

/*
 * Select the type of file to upload. 
 * We will need information to rename the file which is later used to sort the files by type
 */
function setUploadType(clickedId){
	documentType = clickedId;
	enableUploadStatus('uploading');
	myUpload();
}

/*
 * Rename file and add "-" for later use
 */
function renameUploadFile(fileName){
	return documentType+"-"+Date.now()+"-"+fileName;
}

/*
 * Attachment functions - this function will upload files to the current request
 */
function myUpload(){
	var getFileBuffer = function(file){
		var deferred  = $.Deferred();
		var reader    = new FileReader();
		reader.onload = function (e){ 
			deferred.resolve(e.target.result);
		};
		reader.onerror = function (e){
			deferred.reject(e.target.error);
		};		
		reader.readAsArrayBuffer(file);
		return deferred.promise();
	};
	
	if($("#inputGroupFile03")[0].files.length > 0){
		var file = $("#inputGroupFile03")[0].files[0];
		getFileBuffer(file).then(function(buffer){
			$.ajax({
				url: siteUrl+"/_api/web/lists/getbytitle('ccRequestTracker')/items('"+qId+"')/AttachmentFiles/add(FileName='"+renameUploadFile(file.name)+"')",
				method: "POST",
				data: buffer,
				processData: false,
				headers: {
					"Accept": "application/json; odata=verbose",
					"content-type": "application/json; odata=verbose",
					"X-RequestDigest": document.getElementById("__REQUESTDIGEST").value
				},
				success: function(){
					enableUploadStatus('uploaded');
					ListAttachmentsClear();
					listMyAttachments(qId);
				},
				error: function(){
					console.log('function: error myUpload');
				}
			});
		});			
	}
}

/*
 * Displays all current attachments - remove current DOM values and relist
 */
function listMyAttachments(qId){
	$.ajax({
		url: siteUrl+"/_api/web/lists/getbytitle('ccRequestTracker')/items('"+qId+"')/AttachmentFiles/",
		type: "GET",
		headers:{"Accept":"application/json;odata=verbose"},
		success:function(data, textStatus, xhr){
			$.each(data.d.results, function(i, item){
				var documentName = item.FileName.substring(0,15);
				var b="<a id='attachedFile' class='btn btn-link text-danger' onclick=\"deleteMyAttachment('"+qId+"','"+item.FileName+"')\"><i class='fa fa-times' style='color:red;'></i></a>";							
				var t= "<li class='list-group-item'><a href='"+item.ServerRelativeUrl+"' title='"+item.FileName+"' target='_blank'>"+getFileIcon(item.FileName)+" "+documentName+"</i></a>"+b+"</li>";	
				var itemRow = t;
				ListAttachmentsByType(item.FileName,itemRow);
			});
		},
		error: function r(xhr, textStatus, errorThrown){
		}
	});
}

/*
 * Split file name by "-" to find the type of upload 
 */
function ListAttachmentsByType(fileName,itemRow){
	var fileType = fileName.split("-");
	if(fileType[0] === 'Quote'){
		$("#Quote").append(itemRow);
	}
	if(fileType[0] === 'Receipt'){
		$("#Receipt").append(itemRow);
	}
	if(fileType[0] === 'Form'){
		$("#Form").append(itemRow);	
	}
	if(fileType[0] === 'Other'){	
		$("#Other").append(itemRow);
	}
}

/*
 * Clean DOM for attachemnt and avoid duplicate entries
 */
function ListAttachmentsClear(){
	$("#Quote").empty();
	$("#Receipt").empty();
	$("#Form").empty();
	$("#Other").empty();
}

/*
 * Deletes attachments
 */
function deleteMyAttachment(QID, fileName){
	$.ajax({
		url: siteUrl+"/_api/web/lists/getbytitle('ccRequestTracker')/getItemById('"+QID+"')/AttachmentFiles/getByFileName('"+fileName+"')",
		method: "POST",
		contentType: "application/json;odata=verbose",
		headers:{ 
			"X-RequestDigest": document.getElementById("__REQUESTDIGEST").value,
			"X-HTTP-Method":"DELETE",
			"Accept":"application/json;odata=verbose"
		},
		success: function(){
			ListAttachmentsClear();
			listMyAttachments(QID);
		},
		error: function(){
			console.log('deleteMyAttachment: Error deleting files');
		}
	});
}

/*
 * Show selected file name when selected
 */
 function setFileName(){
 	$('#inputGroupFile03').on('change',function(){
 		//get the file name
        var fieldVal = $(this).val();
        var fileName = fieldVal.replace("C:\\fakepath\\", "");
        //replace the "Choose a file" label
        $(this).next('.custom-file-label').html(fileName);
    });
}

/*
 * This function translates the status to a number to pass to the status bar
 */
function setValue(statusValue){
	var stepStatus = [
			{caseStep: 'DRAFT', 						numerStep: 1 	},
			{caseStep: 'SUBMITTED', 					numerStep: 2 	},
			{caseStep: 'DIRECTORATE_APPROVAL', 			numerStep: 3 	},
			{caseStep: 'BILLING_OFFICIAL_APPROVAL', 	numerStep: 4 	},
			{caseStep: 'J6_APPROVAL', 					numerStep: 5 	},
			{caseStep: 'PBO_APPROVAL', 					numerStep: 6 	},	
			{caseStep: 'J8_APPROVAL', 					numerStep: 7 	},
			{caseStep: 'CARD_HOLDER_VALIDATION', 		numerStep: 8 	},
			{caseStep: 'REQUESTOR_VALIDATION', 			numerStep: 9.3 	},
			{caseStep: 'FINAL_VALIDATION', 				numerStep: 9.6 	},
			{caseStep: 'SUPPLY_VALIDATION',				numerStep: 9.9 	},
			{caseStep: 'CLOSED', 						numerStep: 10 	}		
		];

	for (var i = 0; i < stepStatus.length; i++) {
    	if (stepStatus[i].caseStep === statusValue) {
        	loadProgressBar(statusValue, stepStatus[i].numerStep, "10");
        }
    }				
}

/*
 * Populating item rows and action buttons delete/add rows 
 * - adding and substracting the total as itemas are added or removed
 */
function loadRowDetails(startCounter){
	var counter;
	typeof startCounter === 'undefined' ? counter = 0 : counter = startCounter.Details.length;
	/*
	 * Add row action 
	 * - Append to last row
	 * - Enable and disable the delete button and keep last row delete enabled
	 */
	$("#btnAddRow").on("click", function(){	
		var newRow 		= $("<tr>");
		var cols 		= "";
		newRow.append(rowDetailsColHtml(counter,cols));
		$("#myPurchaseRequest").append(newRow);
		counter++;
		createDetails(counter);
		disableDeleteBtn(counter,2);	
	});
	/*
	 * Remove row action and add totals based on change
	 * - Remove last row
	 * - Update total 
	 */
	$("#myPurchaseRequest").on("click", ".ibtnDel", function (event){
		var grandTotal	= 0;
		$(this).closest("tr").remove();       
		counter -= 1;
		deleteDetails(counter);
		$("#myPurchaseRequest")
			.find('input[name^="Total"]')
			.each(function(){
				grandTotal += +$(this).val();
		});
		/*
		 * Adding and substracting the total as itemas are added or removed
		 */	
		addGrandTotal(grandTotal);
	});			
}

/*
 * DOM for details and attributes
 */
function rowDetailsColHtml(counter,cols){
		cols += '<td><p class="card-text font-weight-bold">'+counter+'</p></td>';
		cols +=	'<td><input id="RequestQTY'+counter+'" type="text" class="form-control form-control-sm" name="qty' + counter + '"/></td>';
		cols +=	'<td><input id="Description'+counter+'" type="text" class="form-control form-control-sm" name="Desc' + counter + '"/></td>';
		cols +=	'<td><input id="Source'+counter+'" type="text" class="form-control form-control-sm" name="Src' + counter + '"/></td>';
		cols +=	'<td><input id="RequestCost'+counter+'" type="text" onchange="updateForm(\''+counter+'\')" class="form-control form-control-sm" name="Cost' + counter + '"/></td>';
		cols +=	'<td><input id="Rate'+counter+'" type="text"     class="form-control form-control-sm" name="Rate' + counter + '"/></td>';
		
	  	cols +=	'<td><input id="DD'+counter+'"   type="checkbox"  class="form-control form-control-sm" name="DD' + counter + '" style="border:none;border-radius:0px;"/></td>';
		//cols +=	'<td><input id="DD'+counter+'"   type="checkbox"  checked data-toggle="toggle"         name="DD' + counter + '" data-on="Yes" data-off="No">';
		
		cols +=	'<td><input id="RequestTotal'+counter+'" type="text" class="form-control form-control-sm" name="Total' + counter + '" readonly="readonly"/></td>';
		cols +=	'<td><input type="button"  id="btnDel-'+counter+'" class="ibtnDel btn btn-sm btn-danger" style="width:100%"  value="&#10060; Delete" onclick="enableDeleteBtn(this)"></td>';
		return cols;
}

/*
 * Simply push value into array to calculate the amount of articles added to the form
 */
function createDetails(detailData){
	itemsDetails.push(detailData);
}

/*
 * Function to delete one item from the array. the delete is driven by the counter id
 */
function deleteDetails(item){
	itemsDetails.pop(item,1);
}

/* 
 * Gather all values from the dynamic form and create into a JSON output
 */
function createDetailsJson(){
	/* THIS IS NEEDS TO BE RE-WRITTEN */
	var detailsJson ='{';
		detailsJson+='"Details":[';
	for (i = 0; i < itemsDetails.length; i++) {
		detailsJson += '{';
		detailsJson += '"requestQty":"'		+ 	$('#RequestQTY'+i).val() 	+'",'; 
		detailsJson += '"requestDesc":"'	+ 	$('#Description'+i).val() 	+'",';
		detailsJson += '"requestSrc":"'		+ 	$('#Source'+i).val() 		+'",';
		detailsJson += '"requestDdForm":"'	+ 	$('#DD'+i).is( ":checked" )	+'",';
		/*
		 * add or remove trailing comma  based on record count 
		 */
		if( itemsDetails.length == 1 || i+1 == itemsDetails.length ){
			detailsJson += '"requestCost":"'	+	$('#RequestCost'+i).val()	+'",';	
			detailsJson += '"requestTotal":"'	+ 	$('#RequestTotal'+i).val()	+'"';
		}
		else if( itemsDetails.length > 1 ) {
			detailsJson += '"requestCost":"'	+ 	$('#RequestCost'+i).val()	+'",';
			detailsJson += '"requestTotal":"'	+ 	$('#RequestTotal'+i).val()	+'"';	
			detailsJson += '},';	
		}
	}
	detailsJson += '}]}';

	/*
	 * Safegate for empty entries 
	 */
	if (itemsDetails.length > 0) {
		return detailsJson;
	}else{
		detailsJson = '{"Details":[{"":"","":"","":"","":"","":"","":""}]}';
		return detailsJson;
	}
}

/*
 * Build the approval process JSON object for each section. 
 * - Submit an array with all the values to be assigned to each part of the object
 * - A matching id and a matching value to fetch from the DOM 
 */
function createJsonResponse(responseArray){
	var item = {};
	for (i = 0; i < responseArray.length; i++) {	
		item [responseArray[i]] = getApprovalData()[responseArray[i]];
	}
	jsonString = JSON.stringify(item);
	return jsonString;
}

/*
 * Approval signatures and comments. Provide JSON items to parse 
 * which should match the DOM id to update
 */
function setApprovalProcess(reviewStep){
	/* Look up for value to submit and fill with comment and signature */
	for (var i = 0; i < returnedStep.length; i++) {	
    	if (returnedStep[i].stepName === reviewStep) {
        	submitReview(returnedStep[i].stepStatus, createJsonResponse(returnedStep[i].stepArray));
        }
    }		
}

/*
 * Load tab functions - it populated tabs with correct information and icons by function
 */
 function loadReviewTab(tabResponse,domArray,responseArray,tabText){
 	if (typeof tabResponse !== 'undefined' && tabResponse !== null ) {
 			$(domArray[0]).val(JSON.parse(tabResponse)[responseArray[0]]);
			$(domArray[1]).val(decodeURIComponent(JSON.parse(tabResponse)[responseArray[1]]));
			$(domArray[2]).val(decodeURIComponent(JSON.parse(tabResponse)[responseArray[2]]));
			$(domArray[3]).val(JSON.parse(tabResponse)[responseArray[3]]);
		 	$(domArray[4]).val(JSON.parse(tabResponse)[responseArray[4]]);
		/* Update tab status function */
		if (responseArray[2] !== 'j8Status'){
			tabReviewStatus(JSON.parse(tabResponse)[responseArray[2]],tabText);
		}
		if (responseArray[2] === 'j8Status'){
			tabReviewStatus(JSON.parse(tabResponse)[responseArray[3]],tabText);
		}
	 }
}

/* 
 * Create signature for request form
 */
function signRequest(reviewStep){
	var now = new Date();
	/* Look up for value to submit and fill with comment and signature */
	for (var i = 0; i < returnedSignatureStep.length; i++) {
    	if ('signRequest', returnedSignatureStep[i].name === reviewStep) {
        	$(returnedSignatureStep[i].domId).val("SIGNED BY: "+getUserName().Name+" ON: "+now);
        	/* Close request when J4 Signs */
        	 if (returnedSignatureStep[i].name  === 'j4') {
        	 	closeRequest();
        	}
        }
    }
}

/*
 * Disables row items above the latest one. this was feature to avoid random deletes which created duplicate entries to the array set
 */
function disableDeleteBtn(counter,offset){
	var myId = counter - offset;
	$("#btnDel-"+myId).attr("disabled", true);
}

/*
 * This function enables the delete option above the recently deleted row
 */
function enableDeleteBtn(elem){
	var elementId   = $(elem).attr("id");
	var splitId  	= elementId.split("-");
	var cleanId 	= splitId[1]-1;
	$("#btnDel-"+cleanId).attr("disabled", false);
}

/*
 * Calculate totals for items added
 */		
function updateForm(counter){
	console.log('function: updateForm');
	var grandTotal = 0;
	var a = "#RequestTotal"+counter;
	var q = "#RequestQTY"+counter;
	var w = "#RequestCost"+counter;
	var t = Number($(q).val());
	var y = Number($(w).val());
	var l = t*y;
	
	$(a).val(l.toFixed(2));
	$("#myPurchaseRequest").
		find('input[name^="Total"]').
		each(function(){
			grandTotal += +$(this).val();
		}
	);
	addGrandTotal(grandTotal);
}		

/*
 * Determine dollar/euro
 */
function dValue(myChoice){	
	myChoice === "Dollar" ? value  = "on" : value = "off";
	return value;
}


/*
 * Determine dollar/euro
 */
function j6Value(myChoice){	
	myChoice === "Yes" ? value  = "on" : value = "off";
	return value;
}


/*
 * Disabled upload when a new purchase request is created. 
 * Upload is only available after saving the first draft to present users mistakes
 */
function disableUploads(qId){
	typeof qId === 'undefined' ? $("#btnSaveUpload").attr('disabled', 'disabled') : $("#btnSaveUpload").attr('title', 'Select file to upload');
}

/*
 * Enable upload when a draft purchase request is opened. 
 * Upload is only available after saving the first draft to present users mistakes
 */
function enableUploadStatus(step){
	if(step === 'uploading'){
		$("#uploadingFile").show();
	}
	if(step === 'uploaded'){
		$("#uploadedFile").show();
		$("#uploadedFileDone").show();
	setTimeout(
			function() {
				$('#uploadModal').modal('hide');
				$('body').removeClass('modal-open');
				$('.modal-backdrop').remove();
				$("#uploadingFile").hide();
				$("#uploadedFile").hide();
				$("#uploadedFileDone").hide();
			},2000
		);
	}
}

/*
 * disabled submit when a new purchase request is created. 
 * Submit is only available after saving the first draft to present users mistakes 
 */
function disableSubmit(qId){
	typeof qId === 'undefined' ? $("#btnSubmitRequest").attr('disabled', 'disabled') : $("#btnSubmitRequest").attr('title', 'Submit Request');
}

/*
 * return true or false strings as booleans
 */
function isBool(booleanValue){
	booleanValue === "true" ? isBoolean = true : isBoolean = false;
	return isBoolean;
}

/*
 * Make it read only when status is equal to closed
 */
 function isClosed(requestStatus){
	if (typeof requestStatus !== 'undefined' && requestStatus === 'CLOSED'){ 
		$(':input').attr('disabled','disabled');
		$('#closeRequestWindow').prop('disabled', false);
	}
 }

 /*
  * close modeal after 2 sec - UX
  */
function closeModal(){
	setTimeout(
		function() {
			$('#reviewModal').modal('hide');
			$('body').removeClass('modal-open');
			$('.modal-backdrop').remove();

		},2000
	);
 }

 /*
  * Tab status - UX 
  * - Change icons to green check mark
  * - Change icon to green x when declined
  * - Disabled all input from the review panes when declined
  */
function tabReviewStatus(reviewstatus,domId){
	switch (reviewstatus){
		case "Approved":
			$(domId).prepend("<i class='fa fa-check' style='color:green;'></i> ");
			break;
		case "Declined":
			$(domId).prepend("<i class='fa fa-times'  style='color:red;'></i> ");
			$(':input').attr('disabled','disabled');
			//$('#closeRequestWindow').prop('disabled', false);
			break;
		case "No Funding":
			$(domId).prepend("<i class='fa fa-times'  style='color:red;'></i> ");
			$(':input').attr('disabled','disabled');
			break;
		default:
			$(domId).prepend("<i class='fa fa-check' style='color:green;'></i> ");
			break;		
	}
}

/*
 * Change card message base on card type
 */
function cardMessage(){
	$("#RequestCardType").change(function(){
		var choice = $(this).val();
		switch (choice){
			case "Select":
				$("#warnoText").text("");
				break;
			case "ORF":
				$("#warnoText").text("The ORF card requires additional legal signatures. Ensure proper guidance. ");
				$("#warnoText").append('<span class="badge badge-secondary"><a href="https://sof.hq.socom.mil/sites/SOCS/SJS/Pubs/_layouts/15/WopiFrame.aspx?sourcedoc=/sites/SOCS/SJS/Pubs/USSOCOM%20IMTs/22.pdf&action=default" target="_blank" style="color:white;">Download Form</a></span>');
				break;
			case "Training":
				$("#warnoText").text("This card requires an SF-182 for each attendee and legal fill ratios. ");
				$("#warnoText").append('<span class="badge badge-secondary"><a href="../_layouts/15/WopiFrame.aspx?sourcedoc=/app/GPC/Shared%20Documents/SF182-06.pdf&action=default" target="_blank" style="color:white;">Download Form</a></span>');

				break;
			default:
				$("#warnoText").text("");
				break;
		}
	});
}

/*
 * Helper functions - this function determines the file icon to be displayed - split file by "." to get the extension the render
 */
function getFileIcon(myFile){
	var tr = myFile.split(".");
	var splitPeriod = tr[1].split("-");
	var icon = '<i class="fa fa-file-text"></i>';
	var returnedIcon = 	[	
							{name: 'pdf', 		domId: '<i class="fa fa-file-pdf-o"></i>'   	},
							{name: 'xls',	 	domId: '<i class="fa fa-file-excel-o"></i>' 	},
							{name: 'xlsx', 		domId: '<i class="fa fa-file-word-o"></i>'  	},
							{name: 'doc',		domId: '<i class="fa fa-file-word-o"></i>'  	},
							{name: 'docx',		domId: '<i class="fa fa-file-word-o"></i>'  	},
							{name: 'txt',		domId: '<i class="fa fa-file-text"></i>'    	},
							{name: 'pptx',		domId: '<i class="fa fa-file-powerpoint-o"></i>'},
							{name: 'jpg',		domId: '<i class="fa fa-image"></i>'			},
							{name: 'jpeg',		domId: '<i class="fa fa-image"></i>'			},
							{name: 'pptx',		domId: '<i class="fa fa-image"></i>'			},
							{name: 'jpg',		domId: '<i class="fa fa-image"></i>'			},
							{name: 'gif',		domId: '<i class="fa fa-image"></i>'			},
							{name: 'all',		domId: '<i class="fa fa-file-text"></i>'		}
						];

	/*
	 * Look up for value to submit and fill with comment and signature
	 */
	for (var i = 0; i < returnedIcon.length; i++) {
		if (returnedIcon[i].name === splitPeriod[0].toLowerCase()){
        	icon = returnedIcon[i].domId;
        }
    }
    return icon;
}

/*
 * Get all values added and change DOM on load 
 */
function addGrandTotal (numberData){
	var value;
	$.isArray(numberData) ? value = sum(numberData) :  value = numberData;
	var granTotal = $("#grandTotal").text(value);
	$("#grandTotal").html(value);
	value > 9999 ? 	$("#grandTotal").append(' for request over 10K <span class="badge badge-secondary"><a href="../_layouts/15/WopiFrame.aspx?sourcedoc=/app/GPC/Shared%20Documents/RSCA%20Version%202.0%20Jan%202017.pdf&action=default" target="_blank" style="color:white;">Download Form</a></span>') :  false;
}

/*
 * Adding values in array - EI does not support map.reduce
 */
var sum = function(arr) {
    var r = 0;
    $.each(arr, function(i, v) {
        r += +v;
    });
    return r;
}

/*
 * Get all funding sources. 
 */
function getFundingSource(){
	for(i = 0; i < fundingSource.length; i++){
		$('#RequestSource').append('<option value="'+fundingSource[i]+'">'+fundingSource[i]+'</option>');
	}
}

/*
 * Get fiscal years. 
 */
function getFiscalYear(){
	for(i = 0; i < fiscalYear.length; i++){
		$('#j8FiscalYear').append('<option value="'+fiscalYear[i]+'">'+fiscalYear[i]+'</option>');
	}
}



