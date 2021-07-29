<%@ tag body-content="empty" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ attribute name="showLinks" required="false" type="java.lang.Boolean" %>
<%@ attribute name="starsClass" required="false" type="java.lang.String" %>

<spring:htmlEscape defaultHtmlEscape="true"/>

<%@ attribute name="product" required="true"
	type="de.hybris.platform.commercefacades.product.data.ProductData"%>

<h1>Product review summary</h1>
<div class="rating">
	<c:set var="ratingJson">${ycommerce:encodeJSON(product.averageRating)}</c:set>
	<div class="rating-stars pull-left js-ratingCalc ${fn:escapeXml(starsClass)}" data-rating='{"rating":"${fn:escapeXml(ratingJson)}","total":5}' >
		<div class="greyStars">
			<c:forEach  begin="1" end="5">
				<span class="glyphicon glyphicon-star"></span>
			</c:forEach>
		</div>
		<div class="greenStars js-greenStars">
			<c:forEach  begin="1" end="5">
				<span class="glyphicon glyphicon-star active"></span>
			</c:forEach>
		</div>
	</div>

	<c:if test="${not empty product.reviews}">
		<spring:theme code="review.based.on"
			arguments="${fn:length(product.reviews)}" />
	</c:if>

	<c:choose>
		<c:when test="${showLinks}" >
			<c:if test="${not empty product.reviews}">
				<a href="#tabreview" class="js-openTab"><spring:theme code="review.see.reviews" /></a>
			</c:if>
			<a href="#tabreview" class="js-writeReviewTab"><spring:theme code="review.write.title" /></a>
		</c:when>
		<c:otherwise>
			<spring:theme code="review.reviews" />
		</c:otherwise>
	</c:choose>
	
</div>
