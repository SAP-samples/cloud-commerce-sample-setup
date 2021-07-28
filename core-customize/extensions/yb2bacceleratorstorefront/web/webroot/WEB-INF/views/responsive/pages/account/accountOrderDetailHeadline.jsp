<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="common" tagdir="/WEB-INF/tags/responsive/common" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<spring:url value="/my-account/orders" var="orderHistoryUrl" htmlEscape="false"/>
<common:headline url="${orderHistoryUrl}" labelKey="text.account.order.title.details" />
