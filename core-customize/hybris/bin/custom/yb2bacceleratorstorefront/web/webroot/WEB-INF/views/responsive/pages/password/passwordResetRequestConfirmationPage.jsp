<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<spring:htmlEscape defaultHtmlEscape="true"/>

<template:page pageTitle="${pageTitle}">
	<div class="item_container_holder">
		<div class="title_holder">
			<h2>
				<spring:theme code="forgottenPwd.title"/>
			</h2>
		</div>
		<div class="item_container">
			<spring:theme code="account.confirmation.forgotten.password.link.sent"/>
		</div>
	</div>
</template:page>
