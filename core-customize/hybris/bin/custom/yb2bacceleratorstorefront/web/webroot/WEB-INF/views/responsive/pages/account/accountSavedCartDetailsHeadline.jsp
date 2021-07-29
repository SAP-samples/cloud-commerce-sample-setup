<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="common" tagdir="/WEB-INF/tags/responsive/common" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<spring:url value="/my-account/saved-carts" var="savedCartsUrl" htmlEscape="false"/>
<common:headline url="${savedCartsUrl}" labelKey="text.account.savedCart.title.details" />
