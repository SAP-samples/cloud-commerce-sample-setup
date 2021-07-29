<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="product" required="true" type="de.hybris.platform.commercefacades.product.data.ProductData" %>
<%@ attribute name="showName" required="false" type="java.lang.Boolean"%>
<%@ attribute name="filterSkus" required="false" type="java.util.List" %>
<%@ attribute name="readOnly" required="false" type="java.lang.Boolean"%>
<%@ attribute name="isOrderForm" required="false" type="java.lang.Boolean"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="grid" tagdir="/WEB-INF/tags/responsive/grid" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:set var="categoriesSize" value="${fn:length(product.categories)}" />

<c:if test="${isOrderForm}">
	<c:set var="categoriesSize" value="${categoriesSize -1}" />
</c:if>

<c:if test="${categoriesSize >= 3}">
	<grid:grid3dimensions product="${product}" showName="${showName}" filterSkus="${filterSkus}" readOnly="${readOnly}"/>
</c:if>
<c:if test="${categoriesSize == 2}">
	<grid:grid2dimensions product="${product}" showName="${showName}" filterSkus="${filterSkus}" readOnly="${readOnly}"/>
</c:if>
<c:if test="${categoriesSize == 1}">
	<grid:grid1dimension product="${product}" readOnly="${readOnly}"/>
</c:if>