<!DOCTYPE html>
<%@ Page language="C#" %>
<%@ Register Tagprefix="SharePoint" 
     Namespace="Microsoft.SharePoint.WebControls" 
     Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Import Namespace="Microsoft.SharePoint" %>
<html>

<head>
	<meta name="WebPartPageExpansion" content="full" />
	<script src="/_layouts/1033/init.js"></script>
	<script src="/_layouts/MicrosoftAjax.js"></script>
	<script src="/_layouts/sp.core.js"></script>
	<script src="/_layouts/sp.runtime.js"></script>
	<script src="/_layouts/sp.js"></script>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=10" />
	<title>Add User</title>

	<!-- STANDARD: LIBRARIES -->
	<link href="../SiteAssets/bootstrap-4.3.1/css/bootstrap.min.css" rel="stylesheet">
	<link href="../SiteAssets/css/toolkit-light.css" rel="stylesheet">
	<link href="../SiteAssets/css/font-awesome.min.css" rel="stylesheet">
	<link href="../SiteAssets/css/application.css" rel="stylesheet">
	<link href="../SiteAssets/css/jquery-ui.css" type="text/css" rel="stylesheet" />
	<link href="../SiteAssets/css/select2.min.css" rel="stylesheet" />
	<script src="../SiteAssets/js/jquery-1.12.0.js" type="text/javascript"></script>
	<script src="../SiteAssets/js/jquery.SPServices.js" type="text/javascript"></script>
	<script src="../SiteAssets/js/jquery-ui.js" type="text/javascript"></script>
	<script src="../SiteAssets/js/jquery.tablesorter.js"></script>
	<script src="../SiteAssets/js/jquery.tablesorter.widgets.js"></script>
	<script src="../SiteAssets/js/jquery.tablesorter.pager.js"></script>
	<script src="../SiteAssets/bootstrap-4.3.1/js/bootstrap.min.js"></script>
	<script src="../SiteAssets/js/popper.min.js"></script>
	<script src="../SiteAssets/js/chart.js"></script>
	<script src="../SiteAssets/js/toolkit.js"></script>
	<script src="../SiteAssets/js/application.js"></script>
	<script src="../SiteAssets/js/select2.min.js"></script>

	<!-- CUSTOM: LIBRARIES -->
	<script src="../SiteAssets/js/appConfig.js" type="text/javascript"></script>
	<script src="../SiteAssets/js/userFunctions.js" type="text/javascript"></script>
	<script src="../SiteAssets/js/moneyCalculations.js" type="text/javascript"></script>
	<link href="../SiteAssets/css/style.css" type="text/css" rel="stylesheet" />


</head>

<body>
	<form runat="server">
		<SharePoint:FormDigest ID="FormDigest1" runat="server"></SharePoint:FormDigest>
	</form>
	<!-- START: BODY -->
	<div class="container-fluid">
		<div class="row">

			<!-- START: SIDEBAR -->
			<div class="col-md-3 sidebar">
				<nav class="sidebar-nav">
					<div class="sidebar-header">
						<button class="nav-toggler nav-toggler-md sidebar-toggler" type="button" data-toggle="collapse"
							data-target="#nav-toggleable-md">
							<span class="sr-only">Toggle nav</span>
						</button>
					</div>
					<div class="collapse nav-toggleable-md" id="nav-toggleable-md">
						<ul class="nav nav-pills nav-stacked flex-column">
							<li class="nav-header">Users</li>
							<li class="nav-item"><a class="nav-link" href="../Pages/cc_user_list.aspx">Users
									Overview</a></li>
							<li class="nav-item"><a class="nav-link active" href="../Pages/cc_user_add.aspx">Add
									User</a></li>
							<li class="nav-header">Requests</li>
							<li class="nav-item"><a class="nav-link"
									href="../Pages/cc_purchase_request_list.aspx">Request Status</a></li>
							<li class="nav-item"><a class="nav-link" href="../Pages/purchase_request.aspx"
									target="_blank">Submit Request</a></li>
							<li class="nav-header">Documentation & Other</li>
							<li class="nav-item"><a class="nav-link" href="../Shared%20Documents/Forms/AllItems.aspx"
									target="_blank">Documentation</a></li>
							<li class="nav-item"><a class="nav-link" href="#">Other</a></li>
						</ul>
					</div>
				</nav>
				<hr class="visible-xs mt-3">
			</div>
			<!-- END: SIDEBAR -->

			<!-- START: CONTENT  -->
			<div class="col-md-9 content">
				<div class="card mb-4 box-shadow">
					<div class="card-header">
						<div class="dashhead-titles">
							<h4 class="dashhead-title  mb-3">User basic information</h4>
						</div>
						<div class="btn-toolbar dashhead-toolbar">
							<div class="btn-toolbar-item">
								<a class="sidebar-brand img-responsive" href="#">
									<span style="display:none;">
										<asp:LoginName runat="server" id="loginName" FormatString="{0}"></asp:LoginName>
									</span>
									<span class="topTitle" id="command" style="display:none;">SOCEUR </span>
									<span id="cleanUser"></span>
								</a>
							</div>
						</div>
					</div>

					<!-- START: USER FORM -->
					<div class="card-body">
						<div class="form-group row">
							<label for="personLName" class="col-sm-1 col-form-label d-none d-xl-block">Last Name</label>
							<div class="col-sm-5">
								<input type="text" id="personLName" class="form-control" placeholder="Last Name">
							</div>
							<label for="personFName" class="col-sm-1 col-form-label d-none d-xl-block">First
								Name</label>
							<div class="col-sm-5">
								<input type="text" id="personFName" class="form-control" placeholder="First Name">
							</div>
						</div>

						<div class="form-group row">
							<label for="personEmail" class="col-sm-1 col-form-label d-none d-xl-block">Email</label>
							<div class="col-sm-5">
								<div class="input-group mb-2">
									<div class="input-group-prepend">
										<div class="input-group-text">@</div>
									</div>
									<input type="text" id="personEmail" class="form-control" placeholder="Email">
								</div>
							</div>
							<label for="personRole" class="col-sm-1 col-form-label d-none d-xl-block">Role</label>
							<div class="col-sm-5">
								<select id="personRole" class="inputSelectCCUSer form-control" placeholder="Role">
									<option selected>Please Select</option>
								</select>
							</div>
						</div>

						<div class="form-group row">
							<label for="personRank" class="col-sm-1 col-form-label d-none d-xl-block">Rank</label>
							<div class="col-sm-5">
								<select id="personRank" class="inputSelectCCUSer form-control" placeholder="Rank">
									<option selected>Please Select</option>
								</select>
							</div>
							<label for="personDirectorate"
								class="col-sm-1 col-form-label d-none d-xl-block">Directorate</label>
							<div class="col-sm-5">
								<select id="personDirectorate" class="inputSelectCCUSer form-control"
									placeholder="Directorate">
									<option selected>Please Select</option>
								</select>
							</div>
						</div>

						<div class="form-group row">
							<label for="personDirectorate"
								class="col-sm-1 col-form-label d-none d-xl-block">Active</label>
							<div class="col-sm-5">
								<select id="personActive" class="inputSelectCCUSer form-control"
									placeholder="PLEASE SELECT">
									<option selected>Please Select</option>
									<option value="YES">YES</option>
									<option value="NO">NO</option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<!-- END: USER FORM -->

				<!-- START: USER ATTRIBUTES -->
				<div class="card mb-4 box-shadow" id="attributes_main">
					<div class="card-header">
						<h4 class="dashhead-title mb-3">User attributes</h4>
					</div>
					<div class="card-body">
						<div class="form-group row">
							<label for="cardType" class="col-sm-1 col-form-label d-none d-xl-block">Holder Type</label>
							<div class="col-lg-5">
								<select id="cardType" class="inputSelectCCUSer form-control"
									placeholder="PLEASE SELECT">
									<option value="STANDARD CARD">STANDARD CARD</option>
									<option value="TRAINING">TRAINING CARD</option>
									<option value="ORF">ORF</option>
								</select>
							</div>
							<label for="ccCardID" class="col-sm-1 col-form-label d-none d-xl-block">Card ID</label>
							<div class="col-sm-5">
								<input type="text" id="ccCardID" class="inputTextCCUser form-control"
									placeholder="Card ID">
							</div>
						</div>
						<div class="form-group row">
							<label for="ccCardLimit" class="col-sm-1 col-form-label d-none d-xl-block">Card
								Limit</label>
							<div class="col-sm-3">
								<div class="input-group mb-2">
									<div class="input-group-prepend">
										<div class="input-group-text">&#36;</div>
									</div>
									<input type="number" id="ccCardLimit" class="inputTextCCUser form-control"
										placeholder="Card Limit">
								</div>
							</div>
							<div class="col-sm-2">
								<div class="input-group mb-2">
									<div class="input-group-prepend">
										<div class="input-group-text">&#128;</div>
									</div>
									<input type="number" id="ccExchangeRate" class="inputTextCCUser form-control"
										placeholder="Ex Rate">
								</div>
							</div>
							<label for="ccCycleLimit" class="col-sm-1 col-form-label d-none d-xl-block">Cycle
								Limit</label>
							<div class="col-sm-5">
								<div class="input-group mb-2">
									<div class="input-group-prepend">
										<div class="input-group-text">&#36;</div>
									</div>
									<input type="number" id="ccCycleLimit" class="inputTextCCUser form-control"
										placeholder="Cycle Limit">
								</div>
							</div>
						</div>
						<div class="form-group row">
							<label for="openDate" class="col-sm-1 col-form-label d-none d-xl-block">Open</label>
							<div class="col-sm-5">
								<div class="input-group mb-2">
									<div class="input-group-prepend">
										<div class="input-group-text">&#128197;</div>
									</div>
									<input id="openDate" class="inputTextCCUser form-control attributes">
								</div>
							</div>
							<label for="closeDate" class="col-sm-1 col-form-label d-none d-xl-block">Close</label>
							<div class="col-sm-5">
								<div class="input-group mb-2">
									<div class="input-group-prepend">
										<div class="input-group-text">&#128197;</div>
									</div>
									<input id="closeDate" class="inputTextCCUser form-control attributes">
								</div>
							</div>
						</div>
						<div class="form-group row">
							<label for="ccSPL" class="col-sm-1 col-form-label d-none d-xl-block">SPL</label>
							<div class="col-sm-5">
								<div class="input-group mb-2">
									<div class="input-group-prepend">
										<div class="input-group-text">&#36;</div>
									</div>
									<input type="number" id="ccSPL" class="inputTextCCUser form-control"
										placeholder="SPL">
								</div>
							</div>
							<label for="ccAgent" class="col-sm-1 col-form-label d-none d-xl-block">Agent</label>
							<div class="col-sm-5">
								<input type="text" id="ccAgent" class="inputTextCCUser form-control"
									placeholder="Agent">
							</div>
						</div>
						<div class="form-group row">
							<label for="cclevel4" class="col-sm-1 col-form-label d-none d-xl-block">Level 4</label>
							<div class="col-sm-5">
								<input type="text" id="cclevel4" class="inputTextCCUser form-control"
									placeholder="Level 4">
							</div>
							<label for="cclevel5" class="col-sm-1 col-form-label d-none d-xl-block">Level 5</label>
							<div class="col-sm-5">
								<input type="text" id="cclevel5" class="inputTextCCUser form-control"
									placeholder="Level 5">
							</div>
						</div>
					</div>
				</div>
				<!-- END: USER ATTRIBUTES -->

				<!-- START: USER BILLING OFFICIAL -->
				<div class="card mb-4 box-shadow" id="billing_official_main">
					<div class="card-header">
						<h4 class="dashhead-title mb-3">Billing offical</h4>
					</div>
					<div class="card-body">
						<div class="form-group row">
							<label for="billingOfficialCardHolder"
								class="col-sm-6 col-form-label d-none d-xl-block">Select Corresponding Billing Officials
							</label>
							<div class="col-sm-12" id="the-basics">
								<select id="billingOfficialCardHolder" class="inputTextCCUser form-control"
									name="billingOfficialCardHolder[]" multiple="multiple"
									placeholder="Add Card Holders Accounts" style="width: 100%">
								</select>
							</div>
						</div>
					</div>
				</div>
				<!-- END: USER BILLING OFFICIAL -->


				<!-- START: USER TRAINING -->
				<div class="card mb-4 box-shadow" id="training_main">
					<div class="card-header">
						<div class="dashhead-titles">
							<h4 class="dashhead-title mb-3">User training</h4>
						</div>
					</div>
					<div class="card-body">
						<table id="myCourses" class="table table-hover  table-sm">
							<thead class="table-dark">
								<tr>
									<th style="text-align:left">Name</th>
									<th style="text-align:left" class="d-none d-xl-block">Code</th>
									<th style="text-align:left">Frequency</th>
									<th style="text-align:left" class="d-none d-xl-block">Audience</th>
									<th style="text-align:left">Completion</th>
								</tr>
							</thead>
							<tbody id="usersTraining">
								<!-- JS APPENDING -->
							</tbody>
						</table>
					</div>
				</div>
				<!-- END: USER TRAINING -->

				<!-- START: SUBMIT BUTTON -->
				<div class="container-fluid">
					<div class="row">
						<div class="col col-lg-12">
							<div class="input-group">
								<div class="input-group-prepend">
									<div class="input-group-text"><i class="fa fa-user"></i></div>
									<input type="button" class="btn btn-success btn-block" value="Save User Profile"
										onclick="pushUserData('newAccount')" data-toggle="modal"
										data-target="#myModal" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- END: SUBMIT BUTTON -->
			</div>
			<!-- ENDS: CONTENT -->
		</div>
	</div>
	<!-- END: BODY-->

	<!-- START: MODAL -->
	<div class="modal fade" id="myModal" role="dialog">
		<div class="modal-dialog">
			<!-- MODAL CONTENT -->
			<div class="modal-content">
				<div class="modal-body text-center">
					The user account for was created successfully.
				</div>
			</div>
		</div>
	</div>
	<!-- END: MODAL -->
</body>

<!-- JS CALLS -->
<script type="text/javascript">
	/*
	 * Enable feature for the DOM datepicker and viable filed based on role
	 */
	$(document).ready(function () {
		$("input").filter(".attributes").datepicker();
		$("#attributes_main").hide();
		$("#billing_official_main").hide();
		$("#training_main").hide();
		/*
		 * Load user all data this page is for new account and it should be empty.  
		 */
		getCommandData();
		getDirectorate();
		getRank();
		getRole();
		getTraining();
		getAutoComplete();
		/*
		   * Load roles to be consumed on the form - nothing special, but a one less call to SP back-end
		   */
		$("#personRole").change(function () {
			getUserPanesHtml();
		});
	});
</script>

</html>