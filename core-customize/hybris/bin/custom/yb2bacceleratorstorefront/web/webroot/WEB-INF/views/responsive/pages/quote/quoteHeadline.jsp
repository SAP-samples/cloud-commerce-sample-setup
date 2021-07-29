<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true"/>
<spring:url value="/quote/{/quotecode}/newcart/" var="newCartUrl" htmlEscape="false">
	<spring:param name="quotecode"  value="${cartData.quoteData.code}"/>
</spring:url>

<div class="cart-header border">
    <div class="row">
        <div class="col-xs-12 col-sm-5">
            <h1 class="cart-headline">
                <spring:theme code="text.cart"/>
                <c:if test="${not empty cartData.code}">
                    <span class="cart__id--label">
                        <spring:theme code="basket.page.cartIdShort"/><span class="cart__id">${fn:escapeXml(cartData.code)}</span>
                    </span>
                </c:if>
            </h1>
        </div>
        <div class="col-xs-12 col-sm-7">
            <c:if test="${not empty savedCartCount and savedCartCount ne 0}">
                <spring:url value="/my-account/saved-carts" var="listSavedCartUrl" htmlEscape="false"/>
                <a href="${fnLescapeXml(listSavedCartUrl)}" class="save__cart--link cart__head--link">
                    <spring:theme code="saved.cart.total.number" arguments="${savedCartCount}"/>
                </a>
            </c:if>
            <c:if test="${not empty quoteCount and quoteCount ne 0}">
                <spring:url value="/my-account/my-quotes" var="listQuotesUrl" htmlEscape="false"/>
                    <a href="${fn:escapeXml(listQuotesUrl)}" class="cart__quotes--link cart__head--link">
                        <spring:theme code="saved.quote.total.number" arguments="${quoteCount}"/>
                    </a>
            </c:if>
            <a href="${fn:escapeXml(newCartUrl)}" class="new__cart--link cart__head--link">
                <spring:theme code="quote.edit.done" />
            </a>
        </div>
    </div>
</div>
