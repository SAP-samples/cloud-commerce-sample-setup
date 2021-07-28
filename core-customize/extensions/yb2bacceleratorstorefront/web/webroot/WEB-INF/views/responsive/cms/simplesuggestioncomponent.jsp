<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="format" tagdir="/WEB-INF/tags/shared/format" %>
<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product" %>
<%@ taglib prefix="component" tagdir="/WEB-INF/tags/shared/component" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<product:addToCartTitle/>
<div id="quickViewTitle" class="quickView-header display-none"><spring:theme code="popup.quick.view.select"/></div>

<c:choose>
	<c:when test="${not empty suggestions and component.maximumNumberProducts > 0}">
		<div class="carousel-component">
			<div class="headline">${fn:escapeXml(component.title)}</div>
			<div class="carousel js-owl-carousel js-owl-lazy-reference js-owl-carousel-reference">				
				<c:forEach end="${component.maximumNumberProducts}" items="${suggestions}" var="suggestion">
					<c:url value="${suggestion.url}/quickView" var="productQuickViewUrl"/>
					<div class="item">
						<a href="${fn:escapeXml(productQuickViewUrl)}" class="js-reference-item">
                            <div class="thumb">
                                <product:productPrimaryReferenceImage product="${suggestion}" format="product"/>
                            </div>
							<c:if test="${component.displayProductTitles}">
								<div class="item__name">${fn:escapeXml(suggestion.name)}</div>
							</c:if>
							<c:if test="${component.displayProductPrices}">
								<div class="item__price"><format:fromPrice priceData="${suggestion.price}"/></div>
							</c:if>
						</a>
					</div>
				</c:forEach>
			</div>
		</div>
	</c:when>
	<c:otherwise>
		<component:emptyComponent/>
	</c:otherwise>
</c:choose>
