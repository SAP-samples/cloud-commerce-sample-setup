<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="product" required="true" type="de.hybris.platform.commercefacades.product.data.ProductData" %>
<%@ attribute name="entry" required="true" type="de.hybris.platform.commercefacades.order.data.OrderEntryData" %>
<%@ attribute name="quantity" required="true" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="format" tagdir="/WEB-INF/tags/shared/format" %>
<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<div class="add-to-cart-item">
		<c:url value="${product.url}" var="entryProductUrl"/>
		<div class="thumb">
			<a href="${fn:escapeXml(entryProductUrl)}">
				<product:productPrimaryImage product="${entry.product}" format="cartIcon"/>
			</a>
		</div>
		<div class="details">
			<a class="name" href="${fn:escapeXml(entryProductUrl)}">${fn:escapeXml(product.name)}</a>
			<div class="qty"><span><spring:theme code="popup.cart.quantity.added"/></span>&nbsp;${fn:escapeXml(quantity)}</div>
			<c:forEach items="${product.baseOptions}" var="baseOptions">
				<c:forEach items="${baseOptions.selected.variantOptionQualifiers}" var="baseOptionQualifier">
					<c:set var="baseOptionQualifierValue" value="${fn:escapeXml(baseOptionQualifier.value)}"/>
					<c:if test="${baseOptionQualifier.qualifier eq 'style' and not empty baseOptionQualifier.image.url}">
						<div class="itemColor">
							<span class="label"><spring:theme code="product.variants.colour"/></span>
							<img src="${fn:escapeXml(baseOptionQualifier.image.url)}"  alt="${baseOptionQualifierValue}" title="${baseOptionQualifierValue}"/>
						</div>
					</c:if>
					<c:if test="${baseOptionQualifier.qualifier eq 'size'}">
						<div class="itemSize">
							<span class="label"><spring:theme code="product.variants.size"/></span>
								${baseOptionQualifierValue}
						</div>
					</c:if>
				</c:forEach>
			</c:forEach>
			<c:if test="${not empty entry.deliveryPointOfService.name}">
				<div class="itemPickup"><span class="itemPickupLabel"><spring:theme code="popup.cart.pickup"/></span>&nbsp;${fn:escapeXml(entry.deliveryPointOfService.name)}</div>
			</c:if>
			<div class="price"><format:price priceData="${entry.basePrice}"/></div>
		</div>
    </div>