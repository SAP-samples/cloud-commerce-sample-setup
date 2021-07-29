<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="theme" tagdir="/WEB-INF/tags/shared/theme" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ attribute name="stockData" required="true" type="de.hybris.platform.commercefacades.product.data.StockData" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:choose>
	<c:when test="${stockData.stockLevelStatus.code eq 'outOfStock'}">
		<div class='resultStock negative'><spring:theme code="pickup.out.of.stock"/></div>
	</c:when>
	<c:when test="${stockData.stockLevelStatus.code ne 'outOfStock' and empty stockData.stockLevel}">
		<div class='resultStock'><spring:theme code="pickup.force.in.stock"/></div>
	</c:when>
	<c:otherwise>
		<div class='resultStock'><spring:theme code="pickup.in.stock" arguments="${stockData.stockLevel}"/></div>
	</c:otherwise>
</c:choose>



