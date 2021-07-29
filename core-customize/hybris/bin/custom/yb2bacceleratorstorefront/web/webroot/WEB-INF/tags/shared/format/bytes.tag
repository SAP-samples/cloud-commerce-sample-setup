<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="bytes" required="true" type="java.lang.Long" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<%--
 Tag to render bytes formatted as KB/MB/GB.
--%>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:choose>
	<c:when test="${bytes le 0}">
		<spring:theme code="file.size.bytes" arguments="0"/>
	</c:when>
	<c:when test="${bytes ge ycommerce:pow(2, 30)}">
		<fmt:formatNumber value="${bytes/ycommerce:pow(2, 30)}" minFractionDigits="2" maxFractionDigits="2" var="formattedValue"/>
		<spring:theme code="file.size.gigabytes" arguments="${formattedValue}"/>
	</c:when>
	<c:when test="${bytes ge ycommerce:pow(2, 20)}">
		<fmt:formatNumber value="${bytes/ycommerce:pow(2, 20)}" minFractionDigits="2" maxFractionDigits="2" var="formattedValue"/>
		<spring:theme code="file.size.megabytes" arguments="${formattedValue}"/>
	</c:when>
	<c:when test="${bytes ge ycommerce:pow(2, 10)}">
		<fmt:formatNumber value="${bytes/ycommerce:pow(2, 10)}" minFractionDigits="2" maxFractionDigits="2" var="formattedValue"/>
		<spring:theme code="file.size.kilobytes" arguments="${formattedValue}"/>
	</c:when>
	<c:otherwise>
		<spring:theme code="file.size.bytes" arguments="${bytes}"/>
	</c:otherwise>
</c:choose>
