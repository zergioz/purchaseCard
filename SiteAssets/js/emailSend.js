function processSendEmails(value) {
    var from = 'n015-portal.noreply@socom.mil';
    var body = "THIS IS A TEST | IGNORE IT | There is a request pending for your review: https://soceur.sof.socom.mil/app/GPC/Pages/Purchase_Request.aspx?id="+qId + " please review";
	var subject = "GPC Card Request:"+qId;

	/* DEBUG */
	//console.log(requestNotification);
	//console.log("requested by: ", requestNotification.Requestor);
	//console.log("card holder: ", requestNotification.RequestorCardHolderName);
	//console.log("billingOfficial: ",  getCardHolderBillingApprover().billingOfficial);
	//console.log("director approver: ",  getCardHolderBillingApprover().directorAprove);
	//console.log("director e-mail: ", getDirectorateApprover());
    console.log("value submitted", value);

    if (value === 'submit') {
		//console.log('Requestor Director');
		//console.log(getDirectorateApprover());
		subject = 'Directorate purchase request notification | request: '+qId;
		var to = getDirectorateApprover();
		for (i = 0; i < to.length; i++) {
			sendEmail(from, to[i], body, subject);
		}
    }
    if (value === 'directorate') {
		//console.log('Send Billing Official Notification');
        //console.log('Billing Official', getCardHolderBillingApprover().billingOfficial);
        subject = 'Billing official purchase request notification | request: '+qId;
        var to = getCardHolderBillingApprover().billingOfficial;
        for (i = 0; i < to.length; i++) {
            sendEmail(from, to[i], body, subject);
        }
    }
    if(value === 'bo'){
		//console.log('Send j6 Notification');
		//console.log('J6 approver', getOtherApprover('IT APPROVAL/J6'));
		subject = 'J6 purchase request notification | request: ' + qId;
		var to = getCardHolderBillingApprover().billingOfficial;
		for (i = 0; i < to.length; i++) {
			sendEmail(from, to[i], body, subject);
		}       
    }
    if(value === 'j6'){
		//console.log('Send PBO Notification');
		//console.log('BPO approver', getOtherApprover('PROPERTY BOOKS OFFICER/J4'));
		subject = 'PBO purchase request notification | request: '+qId;
		var to = getCardHolderBillingApprover().billingOfficial;
		for (i = 0; i < to.length; i++) {
			sendEmail(from, to[i], body, subject);
        }        
    }
    if(value === 'pbo'){
		//console.log('Send budget Notification'); 
        //console.log('J8 approver', getOtherApprover('FINANCIAL OFFICER/J8'));
		subject = 'J8 purchase request notification | request: '+qId;
		var to = getOtherApprover('FINANCIAL OFFICER/J8');
        for (i = 0; i < to.length; i++) {
			sendEmail(from, to[i], body, subject);
        }           
    }
    if(value === 'j8'){
		//console.log('Send cardholder Notification');
        //console.log('Send to Cardholder', requestNotification.RequestorCardHolderName);
        subject = 'Card holder purchase request notification | request: '+qId;
		var to = requestNotification.RequestorCardHolderName;
		sendEmail(from, to, body, subject);		
    }
    if(value === 'cardholder'){
        //console.log('Send J8 and Requestor,');
        //console.log('J8 approver', getOtherApprover('FINANCIAL OFFICER/J8') +"and Requestor "+ requestNotification.Requestor);
		subject = 'Requestor and J8 purchase request notification | Funds Execution | request: '+qId;
		var to = getOtherApprover('FINANCIAL OFFICER/J8');
		for (i = 0; i < to.length; i++) {
			sendEmail(from, to[i], body, subject);
		}
		console.log(requestNotification.Requestor);
		sendEmail(from, requestNotification.Requestor, body, subject);

    }
    if(value === 'requestor'){
        //console.log('Send SUPPLY Notification');
        //console.log('SUPPLY approver', getOtherApprover('SUPPLY'));
		subject = 'SUPPLY purchase request notification | request: '+qId;
		var to = getOtherApprover('SUPPLY');
		for (i = 0; i < to.length; i++) {
			sendEmail(from, to[i], body, subject);
		}
    }
    if(value === 'supply'){
        //console.log('JPBO');
        //console.log('J4/JPBO approver', getOtherApprover('PROPERTY BOOKS OFFICER/J4'));
		var to = getOtherApprover('PROPERTY BOOKS OFFICER/J4');
		for (i = 0; i < to.length; i++) {
			sendEmail(from, to[i], body, subject); 
		}		
    }
     if(value === 'j4'){
        subject = 'purchase request notification| CLOSED | request: '+qId;
        console.log('Close request- end request');
        sendEmail(from, requestNotification.Requestor, body, subject);     
    }

              
} 


function sendEmail(from, to, body, subject) {
    var siteurl = _spPageContextInfo.webServerRelativeUrl;
    var urlTemplate = siteurl + "/_api/SP.Utilities.Utility.SendEmail";
    $.ajax({
        contentType: 'application/json',
        url: urlTemplate,
        type: "POST",
        data: JSON.stringify({
            'properties': {
                '__metadata': {
                    'type': 'SP.Utilities.EmailProperties'
                },
                'From': from,
                'To': {
                    'results': [to]
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
			//DEBUG
            //alert('Email Sent Successfully to: '+to);
        },
        error: function(err) {
            alert('Error in sending Email: ' + JSON.stringify(err));
        }
    });
}