<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"  %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:url value="/entrygroups/cart/addToEntryGroup" var="addToEntryGroupUrl"/>
<c:choose>
	<c:when test="${product.stock.stockLevelStatus.code eq 'outOfStock' }">
		<spring:theme code="product.grid.outOfStock"/>
	</c:when>
	<c:otherwise>
		<form:form id="addToEntryGroupForm${fn:escapeXml(product.code)}" action="${addToEntryGroupUrl}" method="POST" class="configure_form">
			<input type="hidden" name="productCode" value="${fn:escapeXml(product.code)}"/>
			<input type="hidden" name="entryGroupNumber" value="${fn:escapeXml(entryGroupNumber)}"/>
			
			<c:choose>
				<c:when test="${product.stock.stockLevelStatus.code eq 'outOfStock'}">
					<button type="submit" class="btn btn-primary btn-block glyphicon" aria-disabled="true" disabled="disabled">
						<spring:theme code="basket.select.product"/>
					</button>
				</c:when>
				<c:when test="${product.addToCartDisabled}">
					<c:out value="${product.addToCartDisabledMessage}"/>
				</c:when>
				<c:otherwise>
					<button type="submit" class="btn btn-primary btn-block glyphicon js-enable-btn" disabled="disabled">
						<spring:theme code="basket.select.product"/>
					</button>
				</c:otherwise>
			</c:choose>
		</form:form>
	</c:otherwise>
</c:choose>
