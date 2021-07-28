<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="theme" tagdir="/WEB-INF/tags/shared/theme" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="format" tagdir="/WEB-INF/tags/shared/format" %>

<%-- Determine if product is one of apparel style or size variant --%>
<c:if test="${product.variantType eq 'ApparelStyleVariantProduct'}">
	<c:set var="variantStyles" value="${product.variantOptions}" />
</c:if>
<c:if test="${(not empty product.baseOptions[0].options) and (product.baseOptions[0].variantType eq 'ApparelStyleVariantProduct')}">
	<c:set var="variantStyles" value="${product.baseOptions[0].options}" />
	<c:set var="variantSizes" value="${product.variantOptions}" />
	<c:set var="currentStyleUrl" value="${product.url}" />
</c:if>
<c:if test="${(not empty product.baseOptions[1].options) and (product.baseOptions[0].variantType eq 'ApparelSizeVariantProduct')}">
	<c:set var="variantStyles" value="${product.baseOptions[1].options}" />
	<c:set var="variantSizes" value="${product.baseOptions[0].options}" />
	<c:set var="currentStyleUrl" value="${product.baseOptions[1].selected.url}" />
</c:if>
<c:url value="${currentStyleUrl}" var="currentStyledProductUrl"/>
<%-- Determine if product is other variant --%>
<c:if test="${empty variantStyles}">
	<c:if test="${not empty product.variantOptions}">
		<c:set var="variantOptions" value="${product.variantOptions}" />
	</c:if>
	<c:if test="${not empty product.baseOptions[0].options}">
		<c:set  var="variantOptions" value="${product.baseOptions[0].options}" />
	</c:if>
</c:if>

<c:if test="${not empty variantStyles or not empty variantSizes}">
	<c:choose>
		<c:when test="${product.purchasable and product.stock.stockLevelStatus.code ne 'outOfStock' }">
			<c:set var="quickViewShowAddToCart"  value="${true}" scope="request" />
		</c:when>
		<c:otherwise>
			<c:set var="quickViewShowAddToCart" value="${false}" scope="request" />
		</c:otherwise>
	</c:choose>
	<c:if test="${not empty variantSizes}">						
		<c:forEach items="${variantSizes}" var="variantSize">
			<c:if test="${(variantSize.url eq product.url)}">
				<c:set var="quickViewShowAddToCart" value="${true}" scope="request" />
			</c:if>
		</c:forEach>
	</c:if>
</c:if>

<c:if test="${not empty variantOptions}">
	<c:choose>
		<c:when test="${product.purchasable and product.stock.stockLevelStatus.code ne 'outOfStock' }">
			<c:set var="quickViewShowAddToCart"  value="${true}" scope="request"/>
		</c:when>
		<c:otherwise>
			<c:set var="quickViewShowAddToCart" value="${false}" scope="request" />
		</c:otherwise>
	</c:choose>
</c:if>
