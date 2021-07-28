<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:url value="${redirectUrl}" var="continueUrl"/>
<template:page pageTitle="${pageTitle}" hideHeaderLinks="true">

	<h2><spring:theme code="checkout.multi.hostedOrderPageError.header"/></h2>
	

	<div class="error-details-section">
		
			<spring:theme code="checkout.multi.hostedOrderPageError.${decision}.${reasonCode}"/>
		
		<div class="action">
			<a class="btn btn-primary" href="${fn:escapeXml(continueUrl)}"><spring:theme code="checkout.multi.hostedOrderPageError.continue"/></a>
		</div>
	</div>
	

	
	<cms:pageSlot position="SideContent" var="feature" element="div" class="side-content-slot cms_disp-img_slot">
		<cms:component component="${feature}"/>
	</cms:pageSlot>
</template:page>
