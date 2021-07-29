<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template" %>
<%@ taglib prefix="order" tagdir="/WEB-INF/tags/responsive/order" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="common" tagdir="/WEB-INF/tags/responsive/common" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:htmlEscape defaultHtmlEscape="true"/>

<template:page pageTitle="${pageTitle}">
	<div id="globalMessages">
		<common:globalMessages/>
	</div>
	<div class="span-20 last">
		<div class="span-20 last order_history_information">
			<div class="span-6">
				<div class="item_container_holder ">
					<div class="title_holder">
						<h2>Order Details</h2>
					</div>
					<div class="item_container">
						<spring:theme code="text.account.order.orderNumber" arguments="${orderData.code}"/><br />
						<spring:theme code="text.account.order.orderPlaced" arguments="${orderData.created}"/><br />
						<c:if test="${not empty orderData.statusDisplay}">
							<spring:theme code="text.account.order.status.display.${orderData.statusDisplay}" var="orderStatus"/>
							<spring:theme code="text.account.order.orderStatus" arguments="${orderStatus}"/><br />
						</c:if>
					</div>
				</div>
			</div>
			<div class="span-20 last">
				<c:if test="${not empty orderData.unconsignedEntries}" >
					<order:orderUnconsignedEntries order="${orderData}"/>				
				</c:if>
				<c:set var="headingWasShown" value="false"/>
				<c:forEach items="${orderData.consignments}" var="consignment">
					<c:if test="${consignment.status.code eq 'WAITING' or consignment.status.code eq 'PICKPACK' or consignment.status.code eq 'READY'}">
							<c:if test="${not headingWasShown}">
							<c:set var="headingWasShown" value="true"/>
							<h2><spring:theme code="text.account.order.title.inProgressItems"/></h2>
						</c:if>
						<div class="productItemListHolder">
							<order:accountOrderDetailsItem order="${orderData}" consignment="${consignment}" inProgress="true"/>
						</div>
					</c:if>
				</c:forEach>	
				<c:forEach items="${orderData.consignments}" var="consignment">
					<c:if test="${consignment.status.code ne 'WAITING' and consignment.status.code ne 'PICKPACK' and consignment.status.code ne 'READY'}">
						<br/>
						<div class="productItemListHolder">
							<order:accountOrderDetailsItem order="${orderData}" consignment="${consignment}" />
						</div>
					</c:if>
				</c:forEach>			
			</div>
			<div class="span-12">
				<order:receivedPromotions order="${orderData}"/>
			</div>
			<div class="span-8 last right">
				<order:orderTotalsItem order="${orderData}"/>
			</div>
		</div>
	</div>
</template:page>