<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<spring:url value="${continueUrl}" var="continueShoppingUrl" scope="session" htmlEscape="false"/>

<div class="row">
    <div class="pull-right col-xs-12 col-sm-6 col-md-5 col-lg-4">
        <div class="continue__shopping">
            <button class="btn btn-primary btn-block btn--continue-shopping js-continue-shopping-button" data-continue-shopping-url="${fn:escapeXml(continueShoppingUrl)}">
                <spring:theme code="checkout.orderConfirmation.continueShopping" />
            </button>
        </div>
    </div>
</div>
