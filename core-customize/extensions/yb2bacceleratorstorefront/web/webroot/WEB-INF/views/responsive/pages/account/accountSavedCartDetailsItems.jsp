<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="order" tagdir="/WEB-INF/tags/responsive/order" %>

<spring:htmlEscape defaultHtmlEscape="true" />
		
<ul class="item__list">
    <li class="hidden-xs hidden-sm">
        <ul class="item__list--header">
            <li class="item__toggle"></li>
            <li class="item__image"></li>
            <li class="item__info"><spring:theme code="basket.page.item"/></li>
            <li class="item__price"><spring:theme code="basket.page.price"/></li>
            <li class="item__quantity"><spring:theme code="basket.page.qty"/></li>
            <li class="item__total--column"><spring:theme code="basket.page.total"/></li>
        </ul>
    </li>
	<ycommerce:testId code="savedCartDetails_itemBody_section">
		<c:forEach items="${savedCartData.entries}" var="entry" varStatus="loop">
			<spring:url value="/my-account/saved-carts/{/cartCode}/getReadOnlyProductVariantMatrix" var="targetUrl" htmlEscape="false">
				<spring:param name="cartCode" value="${savedCartData.code}"/>
			</spring:url>
			<order:orderEntryDetails orderEntry="${entry}" order="${savedCartData}" itemIndex="${loop.index}" targetUrl="${targetUrl}"
				showStock="false" viewConfigurationInfosBaseUrl="/my-account/saved-carts"/>
		</c:forEach>
	</ycommerce:testId>
</ul>

<div class="cartpotproline">
    <span class="info"><spring:theme code="text.account.savedCart.message"/></span>
</div>