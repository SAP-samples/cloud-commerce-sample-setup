<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="format" tagdir="/WEB-INF/tags/shared/format"%>
<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="storepickup" tagdir="/WEB-INF/tags/responsive/storepickup" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:set var="qtyMinus" value="1" />
<c:url value="${fn:escapeXml(product.url)}" var="productUrlHtml" />

<div class="quick-view-popup">

	<div class="product-image">
		<a  href="${productUrlHtml}"> 
			<product:productPrimaryImage product="${product}" format="product" />
		</a>
	</div>
	<div class="product-details">

		<div class="name">
			<a href="${productUrlHtml}"><c:out value="${product.name}" /></a>
		</div>

		<product:productReviewSummary product="${product}" showLinks="false" starsClass="quick-view-stars"/>

		<div class="summary">${ycommerce:sanitizeHTML(product.summary)}</div>

		<c:if test="${not empty product.potentialPromotions}">
			<div class="bundle">
				<c:choose>
					<c:when
						test="${not empty product.potentialPromotions[0].couldFireMessages}">
						<p>${ycommerce:sanitizeHTML(product.potentialPromotions[0].couldFireMessages[0])}</p>
					</c:when>
					<c:otherwise>
						<p>${ycommerce:sanitizeHTML(product.potentialPromotions[0].description)}</p>
					</c:otherwise>
				</c:choose>
			</div>
		</c:if>

		<div class="price">
			<format:fromPrice priceData="${product.price}" />
		</div>
		
	</div>

	<div class="addtocart-component">
		<product:quickViewProductVariantSelector />	

		<c:url value="/cart/add" var="addToCartUrl"/>
		<form:form method="post" class="add_to_cart_form" action="${addToCartUrl}">
		<input type="hidden" name="productCodePost" value="${fn:escapeXml(product.code)}"/>
			
		<c:if test="${empty quickViewShowAddToCart ? true : quickViewShowAddToCart}">

				<div class="qty-selector input-group js-qty-selector">
					<span class="input-group-btn">
						<button class="btn btn-primary js-qty-selector-minus" type="button" <c:if test="${qtyMinus <= 1}"><c:out value="disabled='disabled'"/></c:if> ><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button>
					</span>
					<input type="text" maxlength="3" class="form-control js-qty-selector-input" size="1" value="${fn:escapeXml(qtyMinus)}" data-max="${fn:escapeXml(product.stock.stockLevel)}" data-min="1" id="qty" name="qty"  />
					<span class="input-group-btn">
						<button class="btn btn-primary js-qty-selector-plus" type="button"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
					</span>
				</div>
				
				<c:if test="${product.stock.stockLevel gt 0}">
					<c:set var="productStockLevelHtml">${fn:escapeXml(product.stock.stockLevel)}&nbsp;
						<spring:theme code="product.variants.in.stock"/>
					</c:set>
				</c:if>
				<c:if test="${product.stock.stockLevelStatus.code eq 'lowStock'}">
					<c:set var="productStockLevelHtml">
						<spring:theme code="product.variants.only.left" arguments="${product.stock.stockLevel}"/>
					</c:set>
				</c:if>
				<c:if test="${product.stock.stockLevelStatus.code eq 'inStock' and empty product.stock.stockLevel}">
					<c:set var="productStockLevelHtml">
						<spring:theme code="product.variants.available"/>
					</c:set>
				</c:if>
				<div class="stock-status">
					${productStockLevelHtml}
				</div>

			<c:set var="buttonType">button</c:set>
			<c:if test="${product.purchasable and product.stock.stockLevelStatus.code ne 'outOfStock' }">
				<c:set var="buttonType">submit</c:set>
			</c:if>
			<c:choose>
				<c:when test="${fn:contains(buttonType, 'button')}">
					<button type="${buttonType}" class="btn btn-primary btn-block js-add-to-cart btn-icon glyphicon-shopping-cart outOfStock" disabled="disabled">
						<spring:theme code="product.variants.out.of.stock"/>
					</button>
				</c:when>
				<c:otherwise>
					<button id="addToCartButton" type="${buttonType}" class="btn btn-primary btn-block js-add-to-cart js-enable-btn btn-icon glyphicon-shopping-cart" disabled="disabled">
						<spring:theme code="basket.add.to.basket"/>
					</button>
				</c:otherwise>
			</c:choose>
		</c:if>
		</form:form>

		<c:if test="${empty quickViewShowAddToCart ? true : quickViewShowAddToCart and product.availableForPickup}">
			<c:set var="actionUrl" value="${fn:replace(url,'{productCode}', ycommerce:encodeUrl(product.code))}" scope="request"/>
			<storepickup:clickPickupInStore product="${product}" cartPage="false"/>
			<c:remove var="actionUrl"/>
		</c:if>

	</div>	
</div>
	