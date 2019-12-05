<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=10" />
		<title>Requests Status</title>
				
		<!-- STANDARD: LIBRARIES -->
		<link href="../SiteAssets/bootstrap-4.3.1/css/bootstrap.min.css" rel="stylesheet">
        <link href="../SiteAssets/css/toolkit-light.css" rel="stylesheet">
        <link href="../SiteAssets/css/font-awesome.min.css" rel="stylesheet" >
		<link href="../SiteAssets/css/application.css" rel="stylesheet">
		<link href="../SiteAssets/css/jquery-ui.css" type="text/css" rel="stylesheet"/>
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

		<!-- CUSTOM: LIBRARIES -->
		<script src="../SiteAssets/js/appConfig.js" type="text/javascript"></script>
		<script src="../SiteAssets/js/userFunctions.js" type="text/javascript"></script>
		<link href="../SiteAssets/css/style.css" type="text/css" rel="stylesheet"/>
	</head>
	<body class="loading">
		<!-- START: BODY -->
		<div class="container-fluid">
			<div class="row">
			
				<!-- START: SIDEBAR -->
				<div class="col-md-3 sidebar">
					<nav class="sidebar-nav">
						<div class="sidebar-header">
							<button class="nav-toggler nav-toggler-md sidebar-toggler" type="button" data-toggle="collapse" data-target="#nav-toggleable-md">
								<span class="sr-only">Toggle nav</span>
							</button>
						</div>
						<div class="collapse nav-toggleable-md" id="nav-toggleable-md">
							<ul class="nav nav-pills nav-stacked flex-column">
								<li class="nav-header">Users</li>
								<li class="nav-item"><a class="nav-link" href="cc_user_list.html">Users Overview</a></li>
								<li class="nav-item"><a class="nav-link" href="cc_user_add.html">Add User</a></li>
								<li class="nav-header">Requests</li>
								<li class="nav-item"><a class="nav-link active" href="cc_purchase_request_list.html">Request Status</a></li>
								<li class="nav-item"><a class="nav-link" href="purchase_request.html" target="_blank">Submit Request</a></li>
								<li class="nav-header">Documentation & Other</li>
								<li class="nav-item"><a class="nav-link" href="../Shared%20Documents/Forms/AllItems.html" target="_blank">Documentation</a></li>
								<li class="nav-item"><a class="nav-link" href="#">Other</a></li>
							</ul>
							<div class="hr-divider mt-5 mb-3">
								<h3 class="hr-divider-content hr-divider-heading">Credit Card Breakdown</h3>
							</div>
						</div>
					</nav>
					
					<!-- START: CHARTS -->
					<div class="row text-center mt-5">
						<div class="col-md-4 mb-4 mb-md-3">
							<div class="w-3 mx-auto">
								<canvas
									class="ex-graph"
									width="200" height="200"
									data-chart="doughnut"
									data-dataset="[230, 130]"
									data-dataset-options="{ borderColor: '#252830', backgroundColor: ['#1ca8dd', '#1bc98e'] }"
									data-labels="['Active', 'Inactive']">
								</canvas>
							</div>
							<strong class="text-muted">Active/Inactive</strong>
						</div>
						<div class="col-md-4 mb-4 mb-md-3">
							<div class="w-3 mx-auto">
								<canvas
									class="ex-graph"
									width="200" height="200"
									data-chart="doughnut"
									data-dataset="[330,30]"
									data-dataset-options="{ borderColor: '#252830', backgroundColor: ['#1ca8dd', '#1bc98e'] }"
									data-labels="['CARD HOLDER', 'ORF']">
								</canvas>
							</div>
							<strong class="text-muted">Card Type</strong>
						</div>
						<div class="col-md-4 mb-4 mb-md-3">
							<div class="w-3 mx-auto">
								<canvas
									class="ex-graph"
									width="200" height="200"
									data-chart="doughnut"
									data-dataset="[2,2,10,12]"
									data-dataset-options="{ borderColor: '#252830', backgroundColor: ['#1ca8dd', '#1bc98e','1bc98e'] }"
									data-labels="['J1', 'J5', 'J6','J9']">
								</canvas>
							</div>
							<strong class="text-muted">Directorates</strong>
						</div>
					</div>
					<!-- END: CHARTS -->
					
					<!-- START: QUICK STATS -->
					<div class="hr-divider mt-5 mb-3">
						<h3 class="hr-divider-content hr-divider-heading">Quick Stats</h3>
					</div>

					<div class="row statcards">
						<div class="col-md-4">
							<div class="statcard statcard-success">
								<div class="p-3">
									<span class="statcard-desc">Credit Limit</span>
									<h2 class="statcard-number">1,293 <small class="delta-indicator delta-positive">5%</small></h2>
									<hr class="statcard-hr mb-0">
								</div>
								<canvas id="sparkline1" width="378" height="94" class="sparkline"
									data-chart="spark-line"
									data-dataset="[[28,68,41,43,96,45,100]]"
									data-labels="['a','b','c','d','e','f','g']"
									style="width: 189px; height: 47px;">
								</canvas>
							</div>
						</div>
						<div class="col-md-4">
							<div class="statcard statcard-danger">
								<div class="p-3">
									<span class="statcard-desc">Credit Limit</span>
									<h2 class="statcard-number">1,293 <small class="delta-indicator delta-negative">1.3%</small></h2>
									<hr class="statcard-hr mb-0">
								</div>
								<canvas id="sparkline1" width="378" height="94" class="sparkline"
									data-chart="spark-line"
									data-dataset="[[4,34,64,27,96,50,80]]"
									data-labels="['a', 'b','c','d','e','f','g']"
									style="width: 189px; height: 47px;">
								</canvas>
							</div>
						</div>
						<div class="col-md-4">
							<div class="statcard statcard-info">
								<div class="p-3">
									<span class="statcard-desc">Credit Limit</span>
									<h2 class="statcard-number">1,293 <small class="delta-indicator delta-positive">6.75%</small></h2>
									<hr class="statcard-hr mb-0">
								</div>
								<canvas id="sparkline1" width="378" height="94" class="sparkline"
									data-chart="spark-line"
									data-dataset="[[12,38,32,60,36,54,68]]"
									data-labels="['a', 'b','c','d','e','f','g']"
									style="width: 189px; height: 47px;">
								</canvas>
							</div>
						</div>
					</div>
					<!-- END: QUICK STATS -->
					<hr class="visible-xs mt-3">
				</div>
				<!-- END: SIDEBAR -->
				
				<!-- START: CONTENT  -->
				<div class="col-md-9 content">
					<div class="card mb-4 box-shadow">
						<div class="card-header">
							<div class="dashhead-titles">
								<h4 class="dashhead-title mb-3">Requests Status</h4>
							</div>
							<div class="btn-toolbar dashhead-toolbar">
								<div class="btn-toolbar-item">
									<a class="sidebar-brand img-responsive" href="#">
										<span style="display:none;"><asp:LoginName runat="server" id="loginName" FormatString="{0}"></asp:LoginName></span>
										<span class="topTitle" id="command" style="display:none;">SOCEUR </span>
										<span id="cleanUser"></span>
									</a>
								</div>
							</div>
						</div>
						
						<!-- CONTENT: TABLE STARTS -->
						<div class="card-body">
							<div class="table-responsive">
								<table class="table table-hover tablesorter"  id="myTable">
									<thead>
										<tr>
											<th style="text-align:left">Id</th>
											<th style="text-align:left">Requestor</th>
											<th style="text-align:left">Directorate</th>
											<th style="text-align:left">FY</th>
											<th style="text-align:left">Qt</th>
											<th style="text-align:left">Justification</th>
											<th style="text-align:left">Status</th>
										</tr>
									</thead>
									<tbody id="requestList">
										<!-- JS APPENDING -->
									</tbody>
								</table>
							</div>
						</div>
						<!-- CONTENT: TABLE ENDS -->
						
						<!-- START: PGINATION -->
						<div class="text-center pager tablesorter-pager">
							<nav  class="navbar navbar-expand-lg navbar-light bg-light">
								<ul class="navbar-nav">
									<li class="nav-item">
										<a class="nav-link prev disabled" href="#" aria-label="Previous Page" tabindex="0" title="Previous page" alt="Prev">
											<span aria-hidden="true">&laquo; Previous Page</span>
										</a>
									</li>							
									<li class="nav-item">
										<a class="nav-link next disabled" href="#" aria-label="Next" tabindex="0" title="Next page" alt="Next">
											<span aria-hidden="true">Next Page &raquo;</span>
										</a>
									</li>
									<li class="nav-item dropdown">
											<select class="gotoPage form-control">
												<option class="dropdown-item" value="1">1</option>
											</select>	
									</li>		
								</ul>
							</nav>
						</div>
						<!-- ENDS: PAGINATION -->
					</div>	
				</div>
				<!-- ENDS: CONTENT -->
			</div>
		</div>
		<!-- END: BODY-->
	</body>
	<!-- JS CALLS -->
	<script type="text/javascript">
		getAllRequest();
		getRequestsList.done(function() {
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
	</script>
	<!-- OVERLAY -->
	<div class="modalLoad"><!-- MODAL PAGE--></div>
</html>
