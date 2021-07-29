<%@ tag body-content="empty" trimDirectiveWhitespaces="true"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:url value="/cart" var="cartUrl" />

<c:set var="textPos" value="left" scope="request"/>
<c:if test="${not showModifications}">
	<c:set var="textPos" value="center" scope="request"/>
</c:if>

<c:if test="${not empty restorationErrorMsg}">
	<div class="alert negative">
		<spring:theme code="basket.restoration.${restorationErrorMsg}" />
	</div>
</c:if>
<c:if
	test="${not empty restorationData and not empty restorationData.modifications}">
	 	<div class="cart-restoration-bar">
			<div class="text-${textPos}">
				<spring:theme code="basket.restoration" arguments="${user.firstName}"/>
				<c:choose>
					<c:when test="${not showModifications}">
						<div class="row">
							<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xs-offset-3 col-sm-offset-4 col-md-offset-4 col-lg-offset-5">
								<br />
								<button class="btn btn-default btn-block cartRestoration" data-cart-url="${cartUrl}"><spring:theme text="View Cart" code="basket.restoration.view.cart.btn"/></button>
							</div>
						</div>
					</c:when>
					<c:otherwise>
						<br /><br />
						<spring:theme code="basket.restoration.items.msg"/>
						<br />
						<c:forEach items="${restorationData.modifications}"
							var="modification">
							<br />
							<c:url value="${modification.entry.product.url}" var="entryUrl" /><c:choose>
								<c:when test="${modification.deliveryModeChanged}">
									<spring:theme code="basket.restoration.delivery.changed"
										arguments="${modification.entry.product.name}" />
								</c:when>
								<c:when test="${not modification.deliveryModeChanged and not empty modification.entry}">
									<spring:theme htmlEscape="false"
										code="basket.restoration.${modification.statusCode}"
										arguments="${fn:escapeXml(modification.entry.product.name)},${entryUrl},${modification.entry.quantity},${modification.quantityAdded}" />
								</c:when>
								<c:when test="${not modification.deliveryModeChanged and empty modification.entry}">
									<spring:theme htmlEscape="false"
										code="basket.restoration.${modification.statusCode}"
										arguments="${fn:escapeXml(modification.entry.product.name)},${entryUrl},${modification.quantity},${modification.quantityAdded}" />
								</c:when>
							</c:choose>
						</c:forEach>
					</c:otherwise>
				</c:choose>
			</div>
		</div>
</c:if>
