<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<%@ attribute name="product" required="true" type="de.hybris.platform.commercefacades.product.data.ProductData" %>


<div class="bundle">
	<ycommerce:testId code="productDetails_promotion_label">
		<c:if test="${not empty product.potentialPromotions}">
			<c:choose>
				<c:when test="${not empty product.potentialPromotions[0].couldFireMessages}">
					<p class="promotion">${ycommerce:sanitizeHTML(product.potentialPromotions[0].couldFireMessages[0])}</p>
				</c:when>
				<c:otherwise>
					<c:forEach items="${product.potentialPromotions}" var="promotion">
						<p class="promotion">${ycommerce:sanitizeHTML(promotion.description)}</p>
					</c:forEach>
				</c:otherwise>
			</c:choose>
		</c:if>
	</ycommerce:testId>
</div>
