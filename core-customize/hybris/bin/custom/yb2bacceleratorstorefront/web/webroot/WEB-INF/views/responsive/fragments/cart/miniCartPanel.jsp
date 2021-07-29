<%@ page trimDirectiveWhitespaces="true" contentType="application/json" %>
<%@ taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="format" tagdir="/WEB-INF/tags/shared/format" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:if test="${totalDisplay == 'TOTAL'}">
	<c:set var="totalToDisplayHtml" ><format:price priceData="${totalPrice}"/></c:set>
</c:if>
<c:if test="${totalDisplay == 'SUBTOTAL'}">
	<c:set var="totalToDisplayHtml"><format:price priceData="${subTotal}"/></c:set>
</c:if>
<c:if test="${totalDisplay == 'TOTAL_WITHOUT_DELIVERY'}">
	<c:set var="totalToDisplayHtml"><format:price priceData="${totalNoDelivery}"/></c:set>
</c:if>

{"miniCartCount": ${ycommerce:encodeJSON(totalItems)}, "miniCartPrice": "${ycommerce:encodeJSON(totalToDisplayHtml)}"}
