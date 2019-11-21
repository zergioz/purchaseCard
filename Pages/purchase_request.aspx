<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head runat="server">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<SharePoint:CssRegistration Name="default" runat="server"/>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<link rel="shortcut icon" type="image/x-icon" href="../favicon.ico">
	<title>Purchase Request</title>

	<!-- STANDARD: LIBRARIES -->
	<link href="../SiteAssets/bootstrap-4.3.1/css/bootstrap.min.css" rel="stylesheet">
    <link href="../SiteAssets/css/toolkit-light.css" rel="stylesheet">
    <link href="../SiteAssets/css/font-awesome.min.css" rel="stylesheet" >
    <link href="../SiteAssets/css/bootstrap4-toggle.min.css" rel="stylesheet">
	<link href="../SiteAssets/css/application.css" rel="stylesheet">
	<link href="../SiteAssets/css/jquery-ui.css" type="text/css" rel="stylesheet"/>
	<script src="../SiteAssets/js/jquery-1.12.0.js" type="text/javascript"></script>
	<script src="../SiteAssets/js/jquery.SPServices.js" type="text/javascript"></script>
	<script src="../SiteAssets/js/jquery-ui.js" type="text/javascript"></script>
	<script src="../SiteAssets/js/jquery.tablesorter.js"></script>
	<script src="../SiteAssets/js/jquery.tablesorter.widgets.js"></script>
	<script src="../SiteAssets/js/jquery.tablesorter.pager.js"></script>
	<script src="../SiteAssets/js/angular.min.js" type="text/javascript"></script>
	<script src="../SiteAssets/bootstrap-4.3.1/js/bootstrap.min.js"></script>	
	<script src="../SiteAssets/js/popper.min.js"></script>
	<script src="../SiteAssets/js/chart.js"></script>
    <script src="../SiteAssets/js/bootstrap4-toggle.min.js"></script>
    <script src="../SiteAssets/js/typeahead.bundle.js" type="text/javascript"></script>
  
      
    <!-- CUSTOM: LIBRARIES -->
    <script src="../SiteAssets/js/appConfig.js" type="text/javascript"></script>
	<script src="../SiteAssets/js/loadPageData.js" type="text/javascript"></script>
	<script src="../SiteAssets/js/userFunctions.js" type="text/javascript"></script>
	<script src="../SiteAssets/js/moneyCalculations.js" type="text/javascript"></script>
	<script src="../SiteAssets/js/ccHelper.js" type="text/javascript" ></script>
	<script src="../SiteAssets/js/emailSend.js" type="text/javascript"></script>
	<link  href="../SiteAssets/css/style.css" type="text/css" rel="stylesheet"/>

</head>
<body>
<form id="form1"  runat="server">		
<SharePoint:FormDigest  ID="FormDigest1" runat="server"></SharePoint:FormDigest>
	<div class="container-fluid">
		<div class="card card-header m-0 header">
			<div class="row mb-0 text-center">
				<div class="col-12">
					<h1 class="h1 font-weight-bold mb-0 card-title ">SPECIAL OPERATIONS COMMAND EUROPE</h1>
				<h6 class="h6 mb-0 ">Government Purchase Card Request</h6>
				</div>
			</div>		
		</div>
	</div>
	<!--BEGIN BUTTON ROW-->
	<div class="container-fluid">	
		<div class="row mb-1 mb-4 box-shadow">
			<div class="col-6">
				<div class="progress" id="myRequestProgress" style="height:2rem;"></div>
			</div>
			<div class="col-3">
				<button type="button" class="btn btn-sm btn-block btn-primary" id="btnSaveDraft" value="Draft" title="Save Draft Version"  data-toggle="modal" data-target="#draftModal"><i class="fa fa-save"></i> Save</button>	
			</div>
			<div class="col-3">
				<button type="button" class="btn btn-sm btn-block btn-success" id="btnSubmitRequest" value="Submit"  title="Create a draft version before submitting" data-toggle="modal" data-target="#submitModal"><i class="fa fa-upload"></i> Submit</button>	
			</div>
		</div>
	</div>
	<!--END BUTTON ROW-->
	
	<!--BEGIN REQUEST SECTION-->
	<div class="container-fluid">
		<div class="card mb-4 box-shadow">
			<div class="card-header">Request Details:</div>
			<div class="card-body">

				<!-- ROW ONE-->	
				<div class="row">
					
					<div class="col-lg-3" style="text-align:right;">
						<p class="card-text">Requestor:</p>
					</div>
					<div class="col-lg-3">
						<div class="input-group">
							<div id="bloodhound">
								<input type="text" class="typeahead form-control shadow-sm" id="Requestor" placeholder="Name Lookup_">
							</div>
							<!-- ICON -->
							<!--
							<div class="input-group-prepend input-group-sm">
								<span class="input-group-text"  style="font-size: 1em;" required>
									<li class="fa fa-user"></li>
								</span>
							</div>
							-->
							<!-- ICON -->
						</div>
					</div>

					<div class="col-lg-2" style="text-align:right;">
						<p class="card-text">Requestor DSN:</p>
					</div>
					<div class="col-lg-3">
						<div class="input-group">
							<input type="text" class="form-control shadow-sm" id="RequestorDSN" required>
							<!-- ICON -->
							<div class="input-group-prepend input-group-sm">
								<span class="input-group-text" style="font-size: 1em;">
									<li class="fa fa-phone"></li>
								</span>
							</div>
							<!-- ICON -->
						</div>
					</div>
				</div>

				<!-- ROW TWO -->
				<div class="row">
					<div class="col-lg-3" style="text-align:right;">
						<p class="card-text">Card Type:</p>
					</div>
					<div class="col-lg-3">
						<div class="input-group">
							<select id="RequestCardType" class="form-control shadow-sm" required>
								<option value="Select">Please Select</option>
								<option value="ORF">ORF Card</option>
								<option value="Standard">Standard Card</option>
								<option value="Training">Training Card</option>
							</select>
							<!-- ICON -->
							<div class="input-group-prepend input-group-sm">
								<span class="input-group-text" style="font-size: .66em;" required>
									<li class="fa fa-credit-card"></li>
								</span>
							</div>
							<!-- ICON -->
						</div>
					</div>
					<div class="col-lg-6">
						<div class="text-danger" id="warnoText"></div>
					</div>
				</div>

				<!-- ROW THREE -->
				<div class="row">
					<div class="col-lg-3" style="text-align:right;">
						<p class="card-text">Card Holder:</p>
					</div>
					<div class="col-lg-3">
						<div class="input-group">
							<select class="form-control shadow-sm" id="RequestCardHolderName" required>
								<option  value="Select">Please Select</option>
							</select>
							<!-- ICON -->
							<div class="input-group-prepend input-group-sm">
								<span class="input-group-text" style="font-size: 1em;" required>
									<li class="fa fa-user"></li>
								</span>
							</div>
							<!-- ICON -->
						</div>
					</div>

					<div class="col-lg-2" style="text-align:right;">
						<p class="card-text">Directorate:</p>
					</div>
					<div class="col-lg-3">
						<div class="input-group">
							<select id="personDirectorate" class="form-control shadow-sm" required>
								<option value="Select">Please Select</option>
							</select>
							<!-- ICON -->
							<div class="input-group-prepend input-group-sm">
								<span class="input-group-text" style="font-size: .8em;" required>
									<li class="fa fa-sitemap"></li>
								</span>
							</div>
							<!--ICON-->
						</div>
					</div>
				</div>

				<!-- ROW FOUR -->
				<div class="row">
						<div class="col-lg-3" style="text-align:right;">
						<p class="card-text">Request Date:</p>
					</div>
					<div class="col-lg-3">
						<div class="input-group">
							<input type="text" class="form-control shadow-sm" id="RequestDateOfRequest" required>
							<!--ICON -->
							<div class="input-group-prepend input-group-sm">
								<span class="input-group-text" style="font-size: .77em;">
									<i class="fa fa-calendar"></i>
								</span>
							</div>
							<!-- ICON -->
						</div>
					</div>

					<div class="col-lg-2" style="text-align:right;">
						<p class="card-text">Funding:</p>
					</div>
					<div class="col-lg-3">
						<div class="input-group">
							<select id="RequestSource" class="form-control shadow-sm" required>
								<option value="Select">Please Select</option>
							</select>
							<!-- ICON --->
							<div class="input-group-prepend input-group-sm">
								<span class="input-group-text" style="font-size: .8em;" required>
									<i class="fa fa-shopping-bag"></i>
								</span>
							</div>
							<!-- ICON -->
						</div>
					</div>
				</div>
				
				<!-- ROX SIX -->
				<div class="row">
					<div class="col-lg-3" style="text-align:right;">
						<p class="card-text">Justification:</p>
					</div>
					<div class="col-lg-8">
						<textarea rows="5" id="RequestJustification" class="form-control shadow-sm  form-control-sm" placeholder="Please provide a justification for what you are purchasing" required></textarea>
					</div>
				</div>

				<!-- ROW SEVEN -->
				<div class="row">
					<div class="col-lg-3" style="text-align:right;">
						<p class="card-text font-italic">&#10045; Currency?</p>
					</div>
					<div class="col-lg-1">
						<input id="RequestCurrencyType" type="checkbox"  checked data-toggle="toggle" data-on="USD" data-off="EUR">
					</div>
				</div>
				<hr>
				<!-- ROW SEVEN -->
				<div class="row">
					<div class="col-lg-3" style="text-align:right;">
						<p class="card-text font-italic">&#10045; J6 Request?</p>
					</div>
					<div class="col-lg-1">
						<input id="RequestIsJ6" type="checkbox"  checked data-toggle="toggle" data-on="Yes" data-off="No">
					</div>
					<div class="col-lg-6">
						Does the purchase include Software, Hardward, or I.T Services?
					</div>
				</div>
			</div>
		</div>
	</div>	
	<!--END REQUEST SECTION-->
			
	
	<!--BEGIN PURCHASE DETAILS SECTION-->
	<div class="container-fluid">
		<div class="card mb-4 box-shadow">
			<div class="card-header">Purchase Details:</div>
			<div class="card-body">
				<div class="row mb-0">
					<div class="col-12">
						<table id="myPurchaseRequest" class="table-light" style="width:100%;">
							<thead>
								<tr>
									<th>Row</th>
									<th>QTY</th>
									<th style="width:45%">Description</th>
									<th style="width:15%">Vendor</th>
									<th>Unit Cost</th>
									<th>Rate</th>
									<th>DD250</th>
									<th>Total</th>
									<th></th>
								</tr>
							</thead>
							<tbody class="table-bordered" id="purchaseDetails">
								<!-- JS: DYNAMIC DATA INPUT -->
							</tbody>
							<tfoot>
								<tr>
									<td colspan="6"></td>
									<td colspan="1"><p>Total:$</p></td>
									<td colspan="3"><p id="grandTotal"></p></td>
								</tr>
								<tr>
									<td colspan="6"></td>
									<td colspan="2"><button type="button" class="btn btn-block btn-success" id="btnAddRow" value="Add a Row"> <i class="fa fa-plus"> Add Row</i></button></td>
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>	
	<!--END PURCHASE DETAILS SECTION-->
			
	<!--BEGIN SECTION FOR THE ATTACHMENTS-->
	<div class="container-fluid">
		<div class="card mb-4 box-shadow">
			<div class="card-header">Attachments:</div>
			<div class="card-body">
				<div class="row mb-0">
					<div class="col-4">
						<h6 class="h6 border-bottom mb-0">Upload Attachment:</h6>
						<div class="input-group">						
							<div class="custom-file">
								<input type="file" class="custom-file-input" id="inputGroupFile03">
								<label class="custom-file-label" for="inputGroupFile03">Choose File</label>
							</div>	
							<div class="input-group-append">
								<button type="button" value="Upload File" class="btn btn-outline-secondary" id="btnSaveUpload" title="Create a draft version before uploading" 
								data-toggle="modal" data-target="#uploadModal"><i class="fa fa-cloud-upload"></i> Start Upload</button>
							</div>					
						</div>
					</div>
					<div class="col-2">
						<div class="hr-divider mb-3">
							<h3 class="hr-divider-content hr-divider-heading">Quotes:</h3>
						</div>	
						<ul id="Quote" class="list-spaced  list-group"></ul>
					</div>
					<div class="col-2">
						<div class="hr-divider mb-3">
							<h3 class="hr-divider-content hr-divider-heading">Receipts:</h3>
						</div>
						<ul id="Receipt" class="list-spaced  list-group"></ul>
					</div>
					<div class="col-2">
						<div class="hr-divider mb-3">
							<h3 class="hr-divider-content hr-divider-heading">Forms:</h3>
						</div>
						<ul id="Form" class="list-spaced  list-group"></ul>
					</div>
					<div class="col-2">
						<div class="hr-divider mb-3">
							<h3 class="hr-divider-content hr-divider-heading">Other:</h3>
						</div>
						<ul id="Other" class="list-spaced  list-group"></ul>
					</div>
				</div>
			</div>
		</div>
	</div>	
	<!--END SECTION FOR THE ATTACHMENTS-->
		
	<!-- START: APPROVAL TABS -->
	<div class="container-fluid">
		<div class="card">
			<div class="card-header">Reviewing Process:</div>
			<div class="card-body">
				<div class="row">
					<div class="container-fluid">

						<!--BEGIN BUTTON ROW-->
						<ul class="nav nav-tabs col-12 nav-justified">
							<li class="nav-item active">
								<a class="nav-link active" data-toggle="tab" href="#directoratePane"><p id="directorateText">Directorate</p></a>
							</li>
							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#billingOfficialPane"><p id="billingOfficialText">B.O</p></a>
							</li>
							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#j6Pane"><p id="j6Text"> J6</p></a>
							</li>
							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#propertyBookPane"><p id="propertyBookText">P.B.O</p></a>
							</li>
							<!--
							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#budgetOfficerPane"><p id="budgetOfficerText">Budget Officer</p></a>
							</li>
							-->
							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#j8Pane"><p id="j8Text">J8</p></a>
							</li>
							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#cardHolderPane"><p id="cardHolderText">Card Holder</p></a>
							</li>
							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#requestorPane"><p id="requestorText">Requestor</p></a>
							</li>
							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#supplyPane"><p id="supplyText">Supply</p></a>
							</li>
							<li class="nav-item">
								<a class="nav-link" data-toggle="tab" href="#j4Pane"><p id="j4Text">Final</p></a>
							</li>
						</ul>
						<!--END BUTTON ROW-->

					</div>
					<div class="container-fluid">		
						<div class="tab-content">

							<!--BEGIN DIRECTORATE APPROVAL SECTION-->
							<div class="tab-pane active" id="directoratePane">
								<div class="card" style="border-top-width:0px;">
									<div class="card-body">
										<div class="row mb-0">
											<div class="col-1" style="text-align:right;"><p class="card-text">Comments:</p>
											</div>
											<div class="col-9">
												<textarea rows="5" id="directorateComments" class="form-control shadow-sm  form-control-sm" placeholder="Provide Financial Director Comments" required></textarea>
												
												<div class="input-group">
													<input class="form-control shadow-sm  form-control-sm" type="text" name="directorateSignature" id="directorateSignature" placeholder="Signature">
												  	<div class="input-group-append">
												 		<button class="btn btn-sm btn-success" type="button" id="btnDirectorateSign" value="directorate" data-toggle="modal" data-target="#reviewModal">
												 			<i class="fa fa-pencil" style="font-size: .8rem;"></i> Sign Request
												 		</button>
												  	</div>
												</div>	
											</div>
											<div class="col-2">
												<div class="input-group mb-3">
												  <select class="custom-select" id="directorateReview">
												    <option selected>Choose...</option>
												    <option value="Approved">Approved</option>
												    <option value="Declined">Declined</option>
												  </select>
												  <div class="input-group-append">
												    <label class="input-group-text" for="directorateReview">Status</label>
												  </div>
												</div>
											</div>
										</div>
									</div>	
								</div>
							</div>
							<!--END DIRECTORATE APPROVAL SECTION-->	

							<!--BEGIN BO APPROVAL SECTION-->
							<div class="tab-pane fade" id="billingOfficialPane">
								<div class="card"  style="border-top-width:0px;">
									<div class="card-body">
										<div class="row">
											<div class="col-1" style="text-align:right;"><p class="card-text">Comments:</p>
											</div>
											<div class="col-9">
												<textarea rows="5" id="boComments" class="form-control shadow-sm  form-control-sm" placeholder="Provide Billing Official Comments" required></textarea>
											
												<div class="input-group">
													<input class="form-control shadow-sm  form-control-sm" type="text" name="boSignature" id="boSignature" placeholder="Signature">
												  	<div class="input-group-append">
												 		<button class="btn btn-sm btn-success" type="button" id="btnBoSign" value="bo" data-toggle="modal" data-target="#reviewModal">
												 			<i class="fa fa-pencil" style="font-size: .8rem;"></i> Sign Request
												 		</button>
												  	</div>
												</div>
											</div>
											<div class="col-2" style="text-align:right;">
												<div class="input-group mb-3">
												  <select class="custom-select" id="boReview">
												    <option selected>Choose...</option>
												    <option value="Approved">Approved</option>
												    <option value="Declined">Declined</option>
												  </select>
												  <div class="input-group-append">
												    <label class="input-group-text" for="boReview">Status</label>
												  </div>
												</div>			
											</div>
										</div>
									</div>
								</div>
							</div>
							<!--END BO APPROVAL SECTION-->	

							<!--BEGIN J6 APPROVAL SECTION-->
							<div class="tab-pane fade" id="j6Pane">
								<div class="card"  style="border-top-width:0px;">
									<div class="card-body">
										<div class="row">
											<div class="col-1" style="text-align:right;"><p class="card-text">Comments:</p>
											</div>
											<div class="col-9">
												<textarea rows="5" id="j6Comments" class="form-control shadow-sm  form-control-sm" placeholder="Provide J6 Comments" required></textarea>
											
												<div class="input-group">
													<input class="form-control shadow-sm  form-control-sm" type="text" name="j6Signature" id="j6Signature" placeholder="Signature">
												  	<div class="input-group-append">
												 		<button class="btn btn-sm btn-success" type="button" id="btnJ6Sign" value="j6" data-toggle="modal" data-target="#reviewModal">
												 			<i class="fa fa-pencil" style="font-size: .8rem;"></i> Sign Request
												 		</button>
												  	</div>
												</div>
											</div>
											<div class="col-2" style="text-align:right;">
												<div class="input-group mb-3">
												  <select class="custom-select" id="j6Review">
												    <option selected>Choose...</option>
												    <option value="Approved">Approved</option>
												    <option value="Declined">Declined</option>
												  </select>
												  <div class="input-group-append">
												    <label class="input-group-text" for="j6Review">Status</label>
												  </div>
												</div>		
											</div>
										</div>
									</div>
								</div>
							</div>
							<!--END J6 APPROVAL SECTION-->
				
							<!--BEGIN PBO APPROVAL SECTION-->
							<div class="tab-pane fade" id="propertyBookPane">
								<div class="card"  style="border-top-width:0px;">
									<div class="card-body">
										<div class="row">
											<div class="col-1" style="text-align:right;"><p class="card-text">Comments:</p>
											</div>
											<div class="col-9">
												<textarea rows="5" id="pboComments" class="form-control shadow-sm  form-control-sm" placeholder="Provide PBO  Comments" required></textarea>

												<div class="input-group">
													<input class="form-control shadow-sm  form-control-sm" type="text" name="pboSignature" id="pboSignature" placeholder="Signature">
												  	<div class="input-group-append">
												 		<button class="btn btn-sm btn-success" type="button"  id="btnPboSign" value="pbo" data-toggle="modal" data-target="#reviewModal">
												 			<i class="fa fa-pencil" style="font-size: .8rem;"></i> Sign Request
												 		</button>
												  	</div>
												</div>	
											</div>
											<div class="col-2" style="text-align:right;">
												<div class="input-group mb-3">
												  <select class="custom-select" id="pboReview">
												    <option selected>Choose...</option>
												    <option value="Approved">Approved</option>
												    <option value="Declined">Declined</option>
												  </select>
												  <div class="input-group-append">
												    <label class="input-group-text" for="pboReview">Status</label>
												  </div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!--END PBO APPROVAL SECTION-->	

							<!--BEGIN BUDGET OFFICER APPROVAL SECTION-->
							<!--
							<div class="tab-pane fade" id="budgetOfficerPane">
								<div class="card" style="border-top-width:0px;">
									<div class="card-body">
										<div class="row mb-0">
											<div class="col-1" style="text-align:right;"><p class="card-text">Comments:</p>
											</div>
											<div class="col-9">
												<textarea rows="5" id="budgetOfficerComments" class="form-control shadow-sm  form-control-sm" placeholder="Budget Officer Comments" required></textarea>
												
												<div class="input-group">
													<input class="form-control shadow-sm  form-control-sm" type="text" name="budgetOfficerSignature" id="budgetOfficerSignature" placeholder="Budget Officer Signature">
												  	<div class="input-group-append">
												 		<button class="btn btn-sm btn-success" type="button" id="btnBudgetOfficerSign" value="budget" data-toggle="modal" data-target="#reviewModal">
												 			<i class="fa fa-pencil" style="font-size: .8rem;"></i> Sign Request
												 		</button>
												  	</div>
												</div>	
											</div>
											<div class="col-2">
												<div class="input-group mb-3">
												  <select class="custom-select" id="budgetOfficerReview">
												    <option selected>Choose...</option>
												    <option value="Approved">Approved</option>
												    <option value="Declined">Declined</option>
												  </select>
												  <div class="input-group-append">
												    <label class="input-group-text" for="budgetOfficerReview">Status</label>
												  </div>
												</div>
											</div>
										</div>
									</div>	
								</div>
							</div>
							-->
							<!--END BUDGET OFFICER APPROVAL SECTION-->	

							<!--BEGIN J8 APPROVAL SECTION-->
							<div class="tab-pane fade" id="j8Pane">
								<div class="card"  style="border-top-width:0px;">
									<div class="card-body">
										<div class="row">
											<div class="col-1" style="text-align:right;"><p class="card-text">Comments:</p></div>
											<div class="col-9">
												<textarea rows="5" id="j8Comments" class="form-control shadow-sm  form-control-sm" placeholder="Provide J8 Comments" required></textarea>

												<!-- SIGN OPTION -->
												<div class="input-group">
													<input class="form-control shadow-sm  form-control-sm" type="text" name="j8Signature" id="j8Signature" placeholder="Signature">
												  	<div class="input-group-append">
												 		<button class="btn btn-sm btn-success" type="button" id="btnJ8Sign" value="j8" data-toggle="modal" data-target="#reviewModal">
												 			<i class="fa fa-pencil" style="font-size: .8rem;"></i> Sign Request
												 		</button>
												  	</div>
												</div>
											</div>
											<div class="col-2">
												<div class="input-group mb-3">
												  <select class="custom-select" id="j8FiscalYear">
												    <option selected>Choose...</option>
												  </select>
												  <div class="input-group-append">
												    <label class="input-group-text" for="j8FiscalYear">FY</label>
												  </div>
												</div>
												<div class="input-group mb-3">
												  <select class="custom-select" id="j8Quater">
												    <option selected>Choose...</option>
												    <option value="Q1">Q1</option>
												    <option value="Q2">Q2</option>
												    <option value="Q3">Q3</option>
												    <option value="Q4">Q4</option>
												  </select>
												  <div class="input-group-append">
												    <label class="input-group-text" for="j8Quater">QT</label>
												  </div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!--END J8 APPROVAL SECTION-->	
				
							<!--BEGIN CARD HOLDER APPROVAL SECTION-->
							<div class="tab-pane fade" id="cardHolderPane">
								<div class="card"  style="border-top-width:0px;">
									<div class="card-body">
										<div class="row">
											<div class="col-1" style="text-align:right;"><p class="card-text">Comments:</p></div>
											<div class="col-11">
												<textarea rows="5" id="cardHolderComments" class="form-control shadow-sm  form-control-sm" placeholder="Provide Cardholder Comments" required></textarea>
											</div>
										</div>
										<div class="row">
											<div class="col-1" style="text-align:right;"><p class="card-text">Bank Transaction ID:</p></div>
											<div class="col-11">
												<input rows="5" id="cardHolderTransactionId" class="form-control shadow-sm  form-control-sm" placeholder="Bank Unique Identifier or Transaction ID i.e., 082030091907319722018-XX-XXXXXX" name="cardHolderTransactionId" required="required"></input>

												<!-- SIGN OPTION -->
												<div class="input-group">
													<input class="form-control shadow-sm  form-control-sm" type="text" name="cardHolderSignature" id="cardHolderSignature" placeholder="Card Holder Signature">
												  	<div class="input-group-append">
												 		<button class="btn btn-sm btn-success" type="button" id="btnCardHolderSign" value="cardholder" data-toggle="modal" data-target="#reviewModal"><i class="fa fa-pencil" style="font-size: .8rem;"></i> Sign Request
												 		</button>
												  	</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!--END CARD HOLDER APPROVAL SECTION-->

							<!--BEGIN REQUESTOR APPROVAL SECTION-->
							<div class="tab-pane fade" id="requestorPane">
								<div class="card"  style="border-top-width:0px;">
									<div class="card-body">
										<div class="row">
											<div class="col-1" style="text-align:right;"><p class="card-text">Comments:</p>
											</div>
											<div class="col-11">
												<textarea rows="5" id="requestorComments" class="form-control shadow-sm  form-control-sm" placeholder="Requestor Comments" required></textarea>
											
												<div class="input-group">
													<input class="form-control shadow-sm  form-control-sm" type="text" name="requestorSignature" id="requestorSignature" placeholder="Signature">
												  	<div class="input-group-append">
												 		<button class="btn btn-sm btn-success" type="button" id="btnRequestorSign" value="requestor" data-toggle="modal" data-target="#reviewModal"><i class="fa fa-pencil" style="font-size: .8rem;"></i> Sign Request
												 		</button>
												  	</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!--END REQUESTOR APPROVAL SECTION-->


							<!--BEGIN SUPPLY APPROVAL SECTION-->
							<div class="tab-pane" id="supplyPane">
								<div class="card"  style="border-top-width:0px;">
									<div class="card-body">
										<div class="row">
											<div class="col-1" style="text-align:right;"><p class="card-text">Comments:</p>
											</div>
											<div class="col-11">
												<textarea rows="5" id="supplyComments" class="form-control shadow-sm  form-control-sm" placeholder="SOHC Supply Comments" required></textarea>
											
												<div class="input-group">
													<input class="form-control shadow-sm  form-control-sm" type="text" name="supplySignature" id="supplySignature" placeholder="Signature">
												  	<div class="input-group-append">
												 		<button class="btn btn-sm btn-success" type="button" id="btnSupplySign" value="supply" data-toggle="modal" data-target="#reviewModal">
												 			<i class="fa fa-pencil" style="font-size: .8rem;"></i> Sign Request
												 		</button>
												  	</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!--END SUPPLY APPROVAL SECTION-->		

							<!--BEGIN J4 APPROVAL SECTION-->
							<div class="tab-pane fade" id="j4Pane">
								<div class="card"  style="border-top-width:0px;">
									<div class="card-body">
										<div class="row">
											<div class="col-1" style="text-align:right;"><p class="card-text">Comments:</p></div>
											<div class="col-11">
												<textarea rows="5" id="j4Comments" class="form-control shadow-sm  form-control-sm" placeholder="Provide J4 Comments" required></textarea>

												<!-- SIGN OPTION -->
												<div class="input-group">
													<input class="form-control shadow-sm  form-control-sm" type="text" name="j4Signature" id="j4Signature" placeholder="Signature">
												  	<div class="input-group-append">
												 		<button class="btn btn-sm btn-success" type="button" id="btnJ4Sign" value="j4" data-toggle="modal" data-target="#reviewModal"><i class="fa fa-pencil" style="font-size: .8rem;"></i> Sign and Close
												 		</button>
												  	</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<!--END J4 APPROVAL SECTION-->
				
							<div class="row mb-0">
								<div class="col-12">
									<button type="button" id="closeRequestWindow" class="btn btn-block btn-secondary" id="btnCancelRequest" value="&#10060; Cancel">Close & Exit</button>
								</div>
							</div>
						</div>
					</div>
					<!-- END: APPROVAL TABS --> 
				</div>
			</div>
		</div>	
	</div>

	<!-- START: MODAL -->
	<div class="modal fade" id="uploadModal" role="dialog">
		<div class="modal-dialog">
			<!-- MODAL CONTENT -->
			<div class="modal-content">
				<div class="modal-header" style="align-self: center;">
					<h5 class="modal-title">Select Document Type</h5>
				</div>
				<div class="modal-body" style="text-align: center;">
					  <button  id="Quote" 	type="button" class="btn btn-secondary" onclick="setUploadType(this.id);">Quotes</button>
					  <button  id="Receipt" type="button" class="btn btn-secondary" onclick="setUploadType(this.id);">Receipt</button>
					  <button  id="Form" 	type="button" class="btn btn-secondary" onclick="setUploadType(this.id);">Forms</button>
					  <button  id="Other" 	type="button" class="btn btn-secondary" onclick="setUploadType(this.id);">Other</button>
				</div>
				<button id="uploadingFile" 		style="display: none;" type="button" class="btn btn-sm btn-warning" data-dismiss="modal" disabled=""><i class="fa fa-upload"></i> Uploading...[please wait]</button>
				<button id="uploadedFile" 		style="display: none;" type="button" class="btn btn-sm btn-success" data-dismiss="modal" disabled=""><i class="fa fa-check"></i> Done Uploading</button>
				<!--
			 	<button id="uploadedFileDone" 	style="display: none;" type="button" class="btn btn-dark" id="btnclose" data-dismiss="modal">[Close Window]</button>
			 	-->	
			</div>
		</div>
	</div>
			
	<!-- START: DRAFT MODAL -->
	<div class="modal fade" id="draftModal" role="dialog">
		<div class="modal-dialog">
			<!-- MODAL CONTENT -->
			<div class="modal-content">
				<div class="modal-header" style="align-self: center;">
					<h5 class="modal-title">Draft version</h5>
				</div>
				<div class="modal-body" style="text-align: center;">
					  <i class="fa fa-upload" style="color: green;"></i> Saving form...
				</div>
			</div>
		</div>
	</div>
	<!-- END: MODAL -->
	
	<!-- START: DRAFT MODAL -->
	<div class="modal fade" id="submitModal" role="dialog">
		<div class="modal-dialog">
			<!-- MODAL CONTENT -->
			<div class="modal-content">
				<div class="modal-header" style="align-self: center;">
					<h5 class="modal-title">Submitting Request</h5>
				</div>
				<div class="modal-body" style="text-align: center;">
					  <i class="fa fa-upload" style="color: green;"></i> Sending form for approval
				</div>
			</div>
		</div>
	</div>
	<!-- END: DRAFT MODAL -->

	<!-- START: REVIEW MODAL -->
	<div class="modal fade" id="reviewModal" role="dialog">
		<div class="modal-dialog">
			<!-- MODAL CONTENT -->
			<div class="modal-content">
				<div class="modal-header" style="align-self: center;">
					<h5 class="modal-title">Submitting Review</h5>
				</div>
				<div class="modal-body" style="text-align: center;">
					  <i class="fa fa-upload" style="color: green;"></i> Saving Inputs
				</div>
			</div>
		</div>
	</div>
	<!-- END: DRAFT MODAL -->
</form>
</body>
<!-- START: FOOTER SCRIPTS-->
<script type="text/javascript">	
	$(document).ready(function(){
		/*
		 * Change card message base on card type
		 */
		cardMessage();
		/*
		 * Load all available directotes
 		 */
		getDirectorate();
		/*
		 * Load all available funding sources
 		 */
		getFundingSource();
		/*
		 * Load fiscal Years
		 */
		getFiscalYear();
		/*
		 * Get card holders
		 */
		getUser();
		/*
		 * Get Card Holder List
		 */
		getCardHolder();
		/*
		 * Get all SharePoint user 
		 */
		getSpUser();
		/*
	 	 * Load Purchase Request
		 */
		loadCCRequestTracker(getCurrentId());
		/*
		 * Display name of file selected for upload
		 */
		setFileName();
		/*
		 * Load datepicker 
		 */
		$("#RequestDateOfRequest").datepicker();
		/*
		 * Save form data 
		 */
		$("#btnSaveDraft").click(function(){			
		    submitDraft();
		});	
		/*
		 * Submit
		 */
		$("#btnSubmitRequest").click(function(){			
			submitRequest();
			processSendEmails('submit');
		});
		/* 
		 * Disable all Sign buttons 
		 */	
		signatureRequired(); 
		/*
		 * Start Signature proces
		 */	
		$("#btnBoSign, #btnJ6Sign , #btnPboSign, #btnDirectorateSign, #btnJ8Sign, #btnCardHolderSign, #btnRequestorSign, #btnSupplySign, #btnJ4Sign, #btnBudgetOfficerSign").click(function(){
			signRequest($(this).attr('value'));
			processSendEmails($(this).attr('value'));
			setApprovalProcess($(this).attr('value'));
			closeModal($(this).attr('value'));
		});
		$('#closeRequestWindow').click(function(){
			window.top.close();
		});
	});

</script>
</html>	
