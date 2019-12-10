//@ts-check
'use strict';
function processSendEmails(value) {
    var from = 'n015-portal.noreply@socom.mil';
    var body = "There is a request pending for your review: https://soceur.sof.socom.mil/app/GPC/Pages/Purchase_Request.aspx?id="+qId + " please review";
	//var subject = "GPC Card Request:"+qId;

	// DEBUG
	//console.log(requestNotification);
	//console.log("requested by: ", requestNotification.Requestor);
	//console.log("card holder: ", requestNotification.RequestorCardHolderName);
	//console.log("billingOfficial: ",  getCardHolderBillingApprover().billingOfficial);
	//console.log("director approver: ",  getCardHolderBillingApprover().directorAprove);
	//console.log("director e-mail: ", getDirectorateApprover());
    console.log("value submitted", value);

    if (value === 'submit') {
		console.log('Requestor Director');
		console.log(getDirectorateApprover());
		var subject = 'Directorate purchase request notification | request: '+qId;
        var to = getDirectorateApprover();
        /*
		for (var i = 0; i < to.length; i++) {
			console.log('notification to:' + to[i] );
			sendEmail(from, to[i], body, subject);
        }*/
        alert('Email Director');
    }
    if (value === 'directorate') {
		console.log('Send Billing Official Notification');
        console.log('Billing Official', getCardHolderBillingApprover().billingOfficial);
        var subject = 'Billing official purchase request notification | request: '+qId;
        var to = getCardHolderBillingApprover().billingOfficial;		
        /*
        for (var i = 0; i < to.length; i++) {
			sendEmail(from, to[i], body, subject);
        }
        */
       alert('Email BO');
	}
    if(value === 'bo') {
        if (notifyJ6 === 'Yes'){
            console.log('Send j6 Notification');
		    console.log('J6 approver', getOtherApprover('IT APPROVAL/J6'));
		    var subject = 'J6 purchase request notification | request: ' + qId;
		    var to = getOtherApprover('IT APPROVAL/J6');
            /*
            for (var i = 0; i < to.length; i++) {
			    sendEmail(from, to[i], body, subject);
            }
            */
            alert('Email J6 when included');  
        }else{
            console.log('Send PBO Notification');
            console.log('BPO approver', getOtherApprover('PROPERTY BOOKS OFFICER/J4'));
            subject = 'PBO purchase request notification | request: '+qId;
            var to = getOtherApprover('PROPERTY BOOKS OFFICER/J4');
            /*
            for (var i = 0; i < to.length; i++) {
                sendEmail(from, to[i], body, subject);
            }
            */
            alert('Email PBO');   
        }      
    }

    if(value === 'j6') {
		console.log('Send PBO Notification');
		console.log('BPO approver', getOtherApprover('PROPERTY BOOKS OFFICER/J4'));
		subject = 'PBO purchase request notification | request: '+qId;
		var to = getOtherApprover('PROPERTY BOOKS OFFICER/J4');
        /*
        for (var i = 0; i < to.length; i++) {
			sendEmail(from, to[i], body, subject);
        }
        */
       alert('Email PBO');       
    }
    if(value === 'pbo') {
		console.log('Send budget Notification'); 
        console.log('J8 approver', getOtherApprover('FINANCIAL OFFICER/J8'));
		subject = 'J8 purchase request notification | request: '+qId;
		var to = getOtherApprover('FINANCIAL OFFICER/J8');
        /*
        for (var i = 0; i < to.length; i++) {
			sendEmail(from, to[i], body, subject);
        } 
        */
       alert('Email J8');               
    }
    if(value === 'j8') {
		console.log('Send cardholder Notification');
        console.log('Send to Cardholder', requestNotification.RequestorCardHolderName);
        subject = 'Card holder purchase request notification | request: '+qId;
		var to = requestNotification.RequestorCardHolderName;
        /*
        sendEmail(from, to, body, subject);
        */
       alert('Email Card Holder');      		
    }
    if(value === 'cardholder') {
        console.log('Send J8 and Requestor,');
        console.log('J8 approver', getOtherApprover('FINANCIAL OFFICER/J8') +"and Requestor "+ requestNotification.Requestor);
		subject = 'Requestor and J8 purchase request notification | Funds Execution | request: '+qId;
		var to = getOtherApprover('FINANCIAL OFFICER/J8');
        /*
        for (var i = 0; i < to.length; i++) {
			sendEmail(from, to[i], body, subject);
		}
		console.log(requestNotification.Requestor);
		sendEmail(from, requestNotification.Requestor, body, subject);
        */
       alert('Email Requestor and J8');      
    }
    if(value === 'requestor') {
        console.log('Send SUPPLY Notification');
        console.log('SUPPLY approver', getOtherApprover('SUPPLY'));
		subject = 'SUPPLY purchase request notification | request: '+qId;
		var to = getOtherApprover('SUPPLY');
        /*
        for (i = 0; i < to.length; i++) {
			sendEmail(from, to[i], body, subject);
        }
        */
       alert('Email Supply');   
    }
    if(value === 'supply') {
        console.log('JPBO');
        console.log('J4/JPBO approver', getOtherApprover('PROPERTY BOOKS OFFICER/J4'));
		var to = getOtherApprover('PROPERTY BOOKS OFFICER/J4');
        /*
        for (i = 0; i < to.length; i++) {
			sendEmail(from, to[i], body, subject); 
        }
        */
       alert('Email PBO Final'); 		
    }
     if(value === 'j4') {
        subject = 'purchase request notification| close the following request: '+qId;
        console.log('Email BO Final for closing');
        /*
        sendEmail(from, requestNotification.Requestor, body, subject);
        */
       alert('BO Final Email'); 	
    }

              
} 


function sendEmail(from, to, body, subject) {
    //var siteUrl = _spPageContextInfo.webServerRelativeUrl;
    var urlTemplate = siteUrl + "/_api/SP.Utilities.Utility.SendEmail";
    // @ts-ignore
    $.ajax({
        contentType: 'application/json',
        url: urlTemplate,
        type: "POST",
        data: JSON.stringify({
                'properties': {'__metadata': {'type': 'SP.Utilities.EmailProperties'},
                'From': from,
                'To': {'results': [to]},
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
            alert('Email Sent Successfully to: '+to);
        },
        error: function(err) {
            console.log('Error in sending Email: ' + JSON.stringify(err));
        }
    });
}