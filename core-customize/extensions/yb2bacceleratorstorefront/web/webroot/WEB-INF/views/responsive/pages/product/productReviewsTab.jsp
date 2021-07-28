<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<div id="tabreview" class="tabhead">
	<a href="">${fn:escapeXml(title)}</a> <span class="glyphicon"></span>
</div>
<div class="tabbody">
	<div class="container-lg">
		<div class="row">
			<div class="col-md-6 col-lg-4">
				<div class="tab-container">
					<product:productPageReviewsTab product="${product}" />
				</div>
			</div>
		</div>
	</div>
</div>

