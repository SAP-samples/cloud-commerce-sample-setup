<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ attribute name="searchPageData" required="true" type="de.hybris.platform.commerceservices.search.pagedata.SearchPageData" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="storepickup" tagdir="/WEB-INF/tags/responsive/storepickup" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"  %>

{"data":[
	<c:forEach items="${searchPageData.results}" var="pickupStore" varStatus="pickupEntryNumber">
		<c:set value="${ycommerce:storeImage(pickupStore, 'store')}"  var="storeImage"/>
		<c:set var="stockPickupHtml"><storepickup:pickupStoreStockLevel stockData="${pickupStore.stockData}"/></c:set>
		
		{
			"name" : "${ycommerce:encodeJSON(pickupStore.name)}",
			"displayName" : "${ycommerce:encodeJSON(pickupStore.displayName)}",
			"town" : "${ycommerce:encodeJSON(pickupStore.address.town)}",
			"line1" : "${ycommerce:encodeJSON(pickupStore.address.line1)}",
			"line2" : "${ycommerce:encodeJSON(pickupStore.address.line2)}",
			"country" : "${ycommerce:encodeJSON(pickupStore.address.country.name)}",
			"postalCode" : "${ycommerce:encodeJSON(pickupStore.address.postalCode)}",
			"formattedDistance" : "${ycommerce:encodeJSON(pickupStore.formattedDistance)}",
			"url" : "${ycommerce:encodeJSON(storeImage.url)}",
			"stockPickupHtml" : "${ycommerce:encodeJSON(stockPickupHtml)}",
			<storepickup:pickupStoreOpeningSchedule store="${pickupStore}"/>
			"productcode":"${ycommerce:encodeJSON(searchPageData.product.code)}",
			"storeLatitude":"${ycommerce:encodeJSON(pickupStore.geoPoint.latitude)}",
			"storeLongitude":"${ycommerce:encodeJSON(pickupStore.geoPoint.longitude)}",
			"stockLevel": "${ycommerce:encodeJSON(pickupStore.stockData.stockLevel)}"
		}<c:if test="${!pickupEntryNumber.last}">,</c:if>
	</c:forEach>
]}
