<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="product" required="true" type="de.hybris.platform.commercefacades.product.data.ProductData" %>
<%@ attribute name="cartPage" required="true" type="java.lang.Boolean"%>
<%@ attribute name="entryNumber" required="false" type="java.lang.Long"%>
<%@ attribute name="deliveryPointOfService" required="false" type="java.lang.String"%>
<%@ attribute name="quantity" required="false" type="java.lang.Integer"%>
<%@ attribute name="searchResultsPage" required="false" type="java.lang.Boolean"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:set var="defaultUrl" value="/store-pickup/${ycommerce:encodeUrl(product.code)}/pointOfServices"/>
<c:url var="pickUpInStoreFormAction" value="${empty actionUrl ? defaultUrl : actionUrl}"/>
<c:set var="productPrimaryImageHtml">
	<product:productPrimaryImage product="${product}" format="thumbnail"/>
</c:set>
<c:set var="variantsJSON">
{
	<c:if test="${not empty product.baseOptions[0].selected.variantOptionQualifiers}">
		<c:forEach var="variant" items="${product.baseOptions[0].selected.variantOptionQualifiers}" varStatus="productcartVariantsNumber">
			<c:if test="${not empty variant.value}">
			<c:set var="variantValue"><spring:theme code="basket.pickup.product.variant" arguments="${variant.name},${variant.value}" htmlEscape="false"/></c:set>
			"${ycommerce:encodeJSON(variant.name)}":"${ycommerce:encodeJSON(variantValue)}"<c:if test="${!productcartVariantsNumber.last}">,</c:if>
			</c:if>
		</c:forEach>
	</c:if>
}
</c:set>

<ycommerce:testId code="pickupInStoreButton">
	<c:choose>
		<c:when test="${cartPage}">
			<a href="javascript:void(0)"
			   class="btn btn-default btn-block js-pickup-in-store-button"
			   id="product_${fn:escapeXml(product.code)}${fn:escapeXml(entryNumber)}" disabled="disabled"
			   data-productcart='${fn:escapeXml(product.price.formattedValue)}'
			   data-productcart-variants='${fn:escapeXml(variantsJSON)}'
			   data-img-html="${fn:escapeXml(productPrimaryImageHtml) }"
			   data-productname-html="${fn:escapeXml(ycommerce:sanitizeHTML(product.name))}"
			   data-cartpage="${fn:escapeXml(cartPage)}"
			   data-entryNumber="${fn:escapeXml(entryNumber)}"
			   data-actionurl="${fn:escapeXml(pickUpInStoreFormAction)}"
			   data-value="${fn:escapeXml(quantity)}">
				<c:choose>
					<c:when test="${not empty deliveryPointOfService}">
						<spring:theme code="basket.page.shipping.change.store"/>
					</c:when>
					<c:otherwise>
						<spring:theme code="basket.page.shipping.find.store" />
					</c:otherwise>
				</c:choose>
			</a>
		</c:when>
		<c:when test="${searchResultsPage}">
			<button class="btn btn-default btn-block js-pickup-in-store-button glyphicon glyphicon-map-marker" disabled="disabled" id="product_${fn:escapeXml(product.code)}${fn:escapeXml(entryNumber)}" type="button submit"
			data-productcart='${fn:escapeXml(product.price.formattedValue)}'
			data-productcart-variants='${fn:escapeXml(variantsJSON)}'
			data-img-html="${fn:escapeXml(productPrimaryImageHtml)}" data-productname-html="${fn:escapeXml(ycommerce:sanitizeHTML(product.name))}" data-cartpage="false" data-entryNumber="0" data-actionurl="${fn:escapeXml(pickUpInStoreFormAction)}" data-value="1">
			</button>
		</c:when>
		<c:otherwise>
			<button class="btn btn-default btn-block js-pickup-in-store-button glyphicon-map-marker btn-icon" disabled="disabled" id="product_${fn:escapeXml(product.code)}${fn:escapeXml(entryNumber)}" type="submit" data-productavailable="${fn:escapeXml(product.availableForPickup)}"
				data-productcart='${fn:escapeXml(product.price.formattedValue)}'
				data-productcart-variants='${fn:escapeXml(variantsJSON)}'
				data-img-html="${fn:escapeXml(productPrimaryImageHtml)}" data-productname-html="${fn:escapeXml(ycommerce:sanitizeHTML(product.name))}" data-cartpage="false" data-entryNumber="0" data-actionurl="${fn:escapeXml(pickUpInStoreFormAction)}" data-value="1">
				<spring:theme code="pickup.in.store"/>
			</button>
		</c:otherwise>
	</c:choose>
</ycommerce:testId>


