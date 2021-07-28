<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<c:if test="${not empty googleAnalyticsTrackingId}">
<script>
/* Google Analytics */

var googleAnalyticsTrackingId = '${ycommerce:encodeJavaScript(googleAnalyticsTrackingId)}';
var _gaq = _gaq || [];
_gaq.push(['_setAccount', googleAnalyticsTrackingId]);

<c:choose>
	<c:when test="${pageType == 'PRODUCT'}">
		<c:set var="categories" value="" />
		<c:forEach items="${product.categories}" var="category">
			<c:set var="categories">${categories},${ycommerce:encodeJavaScript(category.name)}</c:set>
		</c:forEach>
		_gaq.push(['_setCustomVar', 2, 'CategoryOfProduct', '${fn:substringAfter(categories, ',')}', 3]);
	</c:when>

	<c:when test="${pageType == 'CATEGORY' || pageType == 'PRODUCTSEARCH'}">
		<c:choose>
			<c:when test="${searchPageData.pagination.totalNumberOfResults > 0}">
				<c:if test="${not empty searchPageData.breadcrumbs}">
					<c:forEach items="${searchPageData.breadcrumbs}" var="breadcrumb">
						<c:set var="pageName" value="${pageType == 'CATEGORY' ? 'category' : 'facet'}"/>
						_gaq.push(['_trackEvent', '${ycommerce:encodeJavaScript(pageName)}', '${ycommerce:encodeJavaScript(breadcrumb.facetName)}', '${ycommerce:encodeJavaScript(breadcrumb.facetValueName)}']);
					</c:forEach>
				</c:if>
			</c:when>
			
			<c:otherwise>
				_gaq.push(['_setCustomVar', 1, 'ZeroResults', '${ycommerce:encodeJavaScript(searchPageData.freeTextSearch)}', 3]);
			</c:otherwise>
		</c:choose>
		
		_gaq.push(['_trackPageview']);
	</c:when>

	<c:when test="${pageType == 'ORDERCONFIRMATION'}">
		<c:set var="orderCode" value="${ycommerce:encodeJavaScript(orderData.code)}"/>
		_gaq.push([
	 		 '_addTrans',
	 		 '${orderCode}',
	 		 '${ycommerce:encodeJavaScript(siteName)}',
	 		 '${ycommerce:encodeJavaScript(orderData.totalPrice.value)}',
	 		 '${ycommerce:encodeJavaScript(orderData.totalTax.value)}',
	 		 '${ycommerce:encodeJavaScript(orderData.deliveryCost.value)}',
	 		 '${ycommerce:encodeJavaScript(orderData.deliveryAddress.town)}',
	 		 '${ycommerce:encodeJavaScript(orderData.deliveryAddress.postalCode)}',
	 		 '${ycommerce:encodeJavaScript(orderData.deliveryAddress.country.name)}'
	 	]);
	 	<c:forEach items="${orderData.entries}" var="entry">
	 		_gaq.push([
	 		    '_addItem',
	 			'${orderCode}',
	 			'${ycommerce:encodeJavaScript(entry.product.code)}',
	 			'${ycommerce:encodeJavaScript(entry.product.name)}',
	 			<c:choose>
		 			<c:when test="${not empty entry.product.categories}">
		 				'${ycommerce:encodeJavaScript(entry.product.categories[fn:length(entry.product.categories) - 1].name)}',
		 			</c:when>
		 			<c:otherwise>
		 				'',
		 			</c:otherwise>
	 			</c:choose>
	 			'${ycommerce:encodeJavaScript(entry.product.price.value)}',
	 			'${ycommerce:encodeJavaScript(entry.quantity)}'
	 		]);
	 	</c:forEach>
	 	_gaq.push(['_trackTrans']);
	</c:when>
	<c:otherwise>
		_gaq.push(['_trackPageview']);
	</c:otherwise>
</c:choose>

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


function trackAddToCart_google(productCode, quantityAdded) {
	_gaq.push(['_trackEvent', 'Cart', 'AddToCart', productCode, quantityAdded]);
}

function trackUpdateCart(productCode, initialQuantity, newQuantity) {
	if (initialQuantity != newQuantity) {
		if (initialQuantity > newQuantity) {
			_gaq.push(['_trackEvent', 'Cart', 'RemoveFromCart', productCode, initialQuantity - newQuantity]);
		} else {
			_gaq.push(['_trackEvent', 'Cart', 'AddToCart', productCode, newQuantity - initialQuantity]);
		}
	}
}

function trackRemoveFromCart(productCode, initialQuantity) {
	_gaq.push(['_trackEvent', 'Cart', 'RemoveFromCart', productCode, initialQuantity]);
}

window.mediator.subscribe('trackAddToCart', function(data) {
	if (data.productCode && data.quantity)
	{
		trackAddToCart_google(data.productCode, data.quantity);
	}
});

window.mediator.subscribe('trackUpdateCart', function(data) {
	if (data.productCode && data.initialCartQuantity && data.newCartQuantity)
	{
		trackUpdateCart(data.productCode, data.initialCartQuantity, data.newCartQuantity);
	}
});

window.mediator.subscribe('trackRemoveFromCart', function(data) {
	if (data.productCode && data.initialCartQuantity)
	{
		trackRemoveFromCart(data.productCode, data.initialCartQuantity);
	}
});
</script>
</c:if>