<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="theme" tagdir="/WEB-INF/tags/shared/theme" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="storepickup" tagdir="/WEB-INF/tags/responsive/storepickup" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:url var="pickUpInStoreFormActionUrl" value="${empty actionUrl ? defaultUrl : actionUrl}"/>

<div id="pickupTitle" class="display-none">
	<div class="pickup-header">
		<button class="btn btn-primary back__to__storelist js-back-to-storelist hidden-xs hidden-sm hidden-md hidden-lg">
			<spring:theme code="pickup.in.store.back.to.results"></spring:theme> 
		</button>
		<span class="headline-inner"><spring:theme code="pickup.product.availability"/></span>
	</div>
</div>


<div id="popup_store_pickup_form" class="display-none">
	
	<div id="pickupModal">

		<ycommerce:testId code="pickupPopup">
		<div class="pickup-component js-pickup-component">


			<div class="find-store-display js-find-store-display">
				<div class="store-navigation">

					<div class="pickup-search-product">
						<div class="pickup-search-bar">
							<form:form name="pickupInStoreForm" action="${pickUpInStoreFormActionUrl}" method="post" class="searchPOSForm clearfix">
								<div class="input-group">
									<input type="text"  class="form-control"  name="locationQuery" data-id="locationForSearch" placeholder="<spring:theme code="pickup.search.message" />" />
									<span class="input-group-btn">
										<button class="btn btn-link" type="button" data-id="pickupstore_location_search_button">
											<span class="glyphicon glyphicon-search"></span>
										</button>
									</span>
								</div>
								<input type="hidden" name="cartPage" data-id="atCartPage" value="${fn:escapeXml(cartPage)}" />
								<input type="hidden" name="entryNumber" value="${fn:escapeXml(entryNumber)}" data-id="entryNumber" />
							</form:form>
						</div>
					</div>

					<ul class="pickup-store-list js-pickup-store-list">
						<li class="loading"><span class="glyphicon glyphicon-repeat"></span></li>
						<li class="loading"><span class="glyphicon glyphicon-repeat"></span></li>
						<li class="loading"><span class="glyphicon glyphicon-repeat"></span></li>
						<li class="loading"><span class="glyphicon glyphicon-repeat"></span></li>
						<li class="loading"><span class="glyphicon glyphicon-repeat"></span></li>
					</ul>
					<div class="store-navigation-pager">
						<a class="prev js-pickup-store-pager-prev" href="#"><span class="glyphicon glyphicon-chevron-left"></span> <spring:theme code="pickup.pagination.previous"></spring:theme></a>
						<a class="next js-pickup-store-pager-next" href="#"><spring:theme code="pickup.pagination.next"></spring:theme> <span class="glyphicon glyphicon-chevron-right"></span></a>
						<div class="position">
							<span class="js-pickup-store-pager-item-from"></span>-<span class="js-pickup-store-pager-item-to"></span> 
							<spring:theme code="pickup.pagination.from" htmlEscape="false"/>
							<span class="js-pickup-store-pager-item-all"></span> 
							<spring:theme code="pickup.pagination.stores" htmlEscape="false"/>
						</div>
					</div>
				</div>
				
					<storepickup:pickupStoreDetails/>
	
			</div>
		</div>
		</ycommerce:testId>
	</div>

</div>







