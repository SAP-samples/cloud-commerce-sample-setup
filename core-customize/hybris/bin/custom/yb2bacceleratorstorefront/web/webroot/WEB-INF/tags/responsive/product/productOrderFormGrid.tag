<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="product" required="true" type="de.hybris.platform.commercefacades.product.data.ProductData" %>
<%@ attribute name="showName" required="false" type="java.lang.Boolean"%>
<%@ attribute name="filterSkus" required="false" type="java.util.List" %>
<%@ attribute name="readOnly" required="false" type="java.lang.Boolean"%>
<%@ attribute name="isOrderForm" required="false" type="java.lang.Boolean"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="grid" tagdir="/WEB-INF/tags/responsive/grid" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:set var="dimensions" value="1" />
<c:if test="${!empty(product.variantOptions) && !empty(product.variantOptions[0].variantOptionQualifiers)}">
	<c:set var="dimensions" value="${fn:length(product.variantOptions[0].variantOptionQualifiers)}" />
</c:if>
<c:if test="${!empty(product.baseOptions) && !empty(product.baseOptions[0].options)
		&& !empty(product.baseOptions[0].options[0].variantOptionQualifiers)}">
	<c:set var="dimensions" value="${fn:length(product.baseOptions[0].options[0].variantOptionQualifiers)}" />
</c:if>
<c:if test="${!empty(product.variantMatrix) && !empty(product.variantMatrix[0].elements)
        && !empty(product.variantMatrix[0].elements[0].elements) && !empty(product.variantMatrix[0].elements[0].elements[0].variantOption)
        && !empty(product.variantMatrix[0].elements[0].elements[0].variantOption.variantOptionQualifiers)}">
    <c:set var="dimensions" value="${fn:length(product.variantMatrix[0].elements[0].elements[0].variantOption.variantOptionQualifiers)}" />
</c:if>
<c:if test="${empty(product.variantOptions) && empty(product.baseOptions)}">
	<c:set var="dimensions" value="${fn:length(product.categories) - 1}" />
</c:if>

<c:if test="${dimensions >= 3}">
	<grid:grid3dimensions product="${product}" showName="${showName}" filterSkus="${filterSkus}" readOnly="${readOnly}"/>
</c:if>
<c:if test="${dimensions == 2}">
	<grid:grid2dimensions product="${product}" showName="${showName}" filterSkus="${filterSkus}" readOnly="${readOnly}"/>
</c:if>
<c:if test="${dimensions == 1}">
	<grid:grid1dimension product="${product}" readOnly="${readOnly}"/>
</c:if>
