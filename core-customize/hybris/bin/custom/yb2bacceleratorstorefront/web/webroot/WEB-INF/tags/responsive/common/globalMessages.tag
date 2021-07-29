<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring"  uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:if test="${(not empty accConfMsgs) || (not empty accInfoMsgs) || (not empty accErrorMsgs)}">
	<div class="global-alerts">
		
		<%-- Information (confirmation) messages --%>
		<c:if test="${not empty accConfMsgs}">
			<c:forEach items="${accConfMsgs}" var="msg">
				<div class="alert alert-info alert-dismissable getAccAlert">
					<button class="close closeAccAlert" aria-hidden="true" data-dismiss="alert" type="button">&times;</button>
					<spring:theme code="${msg.code}" arguments="${msg.attributes}" htmlEscape="false" var="informationMessages"/>
					${ycommerce:sanitizeHTML(informationMessages)}
				</div>
			</c:forEach>
		</c:if>

		<%-- Warning messages --%>
		<c:if test="${not empty accInfoMsgs}">
			<c:forEach items="${accInfoMsgs}" var="msg">
				<div class="alert alert-warning alert-dismissable getAccAlert">
					<button class="close closeAccAlert" aria-hidden="true" data-dismiss="alert" type="button">&times;</button>
					<spring:theme code="${msg.code}" arguments="${msg.attributes}" htmlEscape="false" var="warningMessages"/>
					${ycommerce:sanitizeHTML(warningMessages)}
				</div>
			</c:forEach>
		</c:if>

		<%-- Error messages (includes spring validation messages)--%>
		<c:if test="${not empty accErrorMsgs}">
			<c:forEach items="${accErrorMsgs}" var="msg">
				<div class="alert alert-danger alert-dismissable getAccAlert">
					<button class="close closeAccAlert" aria-hidden="true" data-dismiss="alert" type="button">&times;</button>
					<spring:theme code="${msg.code}" arguments="${msg.attributes}" htmlEscape="false" var="errorMessages"/>
					${ycommerce:sanitizeHTML(errorMessages)}
				</div>
			</c:forEach>
		</c:if>

	</div>
</c:if>