<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="resetBtnId" required="false" type="java.lang.String"%>
<%@ attribute name="resetBtnClass" required="false" type="java.lang.String"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<button id="${(empty resetBtnId) ? 'resetBtn' : fn:escapeXml(resetBtnId)}" type="button" class="${(empty resetBtnClass) ? 'reset-btn' : fn:escapeXml(resetBtnClass)}">
    <spring:theme code="text.quick.order.reset.form" />
</button>