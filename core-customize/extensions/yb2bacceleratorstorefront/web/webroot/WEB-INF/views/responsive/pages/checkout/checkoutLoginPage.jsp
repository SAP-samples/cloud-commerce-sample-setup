<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template"%>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags"%>

<template:page pageTitle="${pageTitle}">
	<div class="checkout-login">
		<div class="row">
			<div class="col-md-6">
				<cms:pageSlot position="LeftContentSlot" var="feature" element="div" class="checkout-login-left-content-slot">
					<cms:component component="${feature}" element="div"  class="checkout-login-left-content-component"/>
				</cms:pageSlot>
			</div>
			
			<div class="col-md-6">
				<cms:pageSlot position="RightContentSlot" var="feature" element="div" class="checkout-login-right-content-slot">
					<cms:component component="${feature}" element="div" class="checkout-login-right-content-component"/>
				</cms:pageSlot>
			</div>
		</div>
		
			
		<cms:pageSlot position="CenterContentSlot" var="feature" class="checkoutLoginPageCenter" element="div">
			<cms:component component="${feature}" class="checkoutLoginPageCenter-component"/>
		</cms:pageSlot>
	</div>
</template:page>
