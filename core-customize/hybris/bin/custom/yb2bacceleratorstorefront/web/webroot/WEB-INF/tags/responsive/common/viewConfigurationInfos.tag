<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>

<%@ attribute name="orderEntry" required="true" type="de.hybris.platform.commercefacades.order.data.OrderEntryData" %>
<%@ attribute name="baseUrl" required="true" type="java.lang.String" %>
<%@ attribute name="itemCode" required="true" type="java.lang.String" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring"  uri="http://www.springframework.org/tags"%>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:if test="${not empty orderEntry.configurationInfos}">                     
	<spring:url value="${baseUrl}/{/orderCode}/{/orderEntryNumber}/configurationDisplay/{/configuratorType}" var="entryConfigUrl" htmlEscape="false">
		<spring:param name="orderCode" value="${itemCode}"/>
		<spring:param name="orderEntryNumber" value="${orderEntry.entryNumber}"/>
		<spring:param name="configuratorType" value="${orderEntry.configurationInfos[0].configuratorType}"/>
	</spring:url>
    <div class="item__configurations--display">
    	<a class="btn" href="${entryConfigUrl}"><spring:theme code="text.account.configuration.display"/></a>
    </div>
</c:if>