<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<spring:htmlEscape defaultHtmlEscape="true" />

<c:if test="${!isCookieNotificationAccepted}">
	<div id="js-cookie-notification" class="alert alert-info alert-dismissable cookie-alert--top">
        <button class="js-cookie-notification-accept close" aria-hidden="true" data-dismiss="alert" type="button">
            <spring:theme code="text.cookie.notification.accept" />
        </button>
	    <spring:theme code="text.cookie.notification" />
	</div>
</c:if>