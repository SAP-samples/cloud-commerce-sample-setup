<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<template:page pageTitle="${pageTitle}" hideHeaderLinks="true">

	<input type="hidden" id="hopDebugMode" data-hop-debug-mode="${fn:escapeXml(hopDebugMode)}" />

	<div id="item_container_holder">

		<div class="item_container">
			<div>
				<h3>
					<spring:theme code="checkout.multi.hostedOrderPostPage.header.wait"/>
					<img src="${fn:escapeXml(commonResourcePath)}/images/spinner.gif" />
				</h3>
				<hr/>
			</div>
		</div>

		<c:if test="${hopDebugMode}">
			<div class="item_container">
				<div id="debugWelcome">
					<h3>
						<spring:theme code="checkout.multi.hostedOrderPostPage.header.debug"/>
					</h3>
					<hr/>
				</div>
			</div>
		</c:if>

		<div class="item_container">
			<form:form id="hostedOrderPagePostForm" name="hostedOrderPagePostForm" action="${hostedOrderPageData.postUrl}" method="POST">
				<div id="postFormItems">
					<dl>
						<c:forEach items="${hostedOrderPageData.parameters}" var="entry" varStatus="status">
							<c:choose>
								<c:when test="${hopDebugMode}">
									<dt><label for="${fn:escapeXml(entry.key)}" class="required"><c:out value="${entry.key}"/></label></dt>
									<dd><input type="text" id="${fn:escapeXml(entry.key)}" name="${fn:escapeXml(entry.key)}" value="${fn:escapeXml(entry.value)}" tabindex="${status.count + 1}"/></dd>
								</c:when>
								<c:otherwise>
									<input type="hidden" id="${fn:escapeXml(entry.key)}" name="${fn:escapeXml(entry.key)}" value="${fn:escapeXml(entry.value)}" />
								</c:otherwise>
							</c:choose>
						</c:forEach>
					</dl>
				</div>
				<c:if test="${hopDebugMode}">
					<div class="rightcol">
						<spring:theme code="checkout.multi.hostedOrderPostPage.button.submit" var="submitButtonLabelHtml"/>
						<input id="button.submit" class="submitButtonText" type="submit" title="${submitButtonLabelHtml}" value="${submitButtonLabelHtml}"/>
					</div>
				</c:if>
			</form:form>
		</div>
	</div>
</template:page>
