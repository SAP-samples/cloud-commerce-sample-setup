<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="cartData" required="true" type="de.hybris.platform.commercefacades.order.data.CartData" %>
<%@ attribute name="groupData" required="true" type="de.hybris.platform.commercefacades.order.data.OrderEntryGroupData" %>
<%@ attribute name="showPotentialPromotions" required="false" type="java.lang.Boolean" %>
<%@ attribute name="showHead" required="false" type="java.lang.Boolean" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="format" tagdir="/WEB-INF/tags/shared/format" %>
<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="common" tagdir="/WEB-INF/tags/responsive/common" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<ul class="checkout-order-summary-list">
<c:if test="${showHead}">
	<li class="checkout-order-summary-list-heading">
		<div class="title"><spring:theme code="checkout.multi.items.to.pickup"/></div>
		<div class="address">
			${fn:escapeXml(groupData.deliveryPointOfService.name)}
			<br>
			<c:if test="${ not empty groupData.deliveryPointOfService.address.line1 }">
						${fn:escapeXml(groupData.deliveryPointOfService.address.line1)},&nbsp;
			</c:if>
			<c:if test="${ not empty groupData.deliveryPointOfService.address.line2 }">
				${fn:escapeXml(groupData.deliveryPointOfService.address.line2)},&nbsp;
			</c:if>
			<c:if test="${not empty groupData.deliveryPointOfService.address.town }">
				${fn:escapeXml(groupData.deliveryPointOfService.address.town)},&nbsp;
			</c:if>
			<c:if test="${ not empty groupData.deliveryPointOfService.address.region.name }">
				${fn:escapeXml(groupData.deliveryPointOfService.address.region.name)},&nbsp;
			</c:if>
			<c:if test="${ not empty groupData.deliveryPointOfService.address.postalCode }">
				${fn:escapeXml(groupData.deliveryPointOfService.address.postalCode)},&nbsp;
			</c:if>
			<c:if test="${ not empty groupData.deliveryPointOfService.address.country.name }">
				${fn:escapeXml(groupData.deliveryPointOfService.address.country.name)}
			</c:if>
            <br/>
			<c:if test="${ not empty groupData.deliveryPointOfService.address.phone }">
				${fn:escapeXml(groupData.deliveryPointOfService.address.phone)}
			</c:if>
		</div>
	</li>
</c:if>
<c:forEach items="${groupData.entries}" var="entry">		
		<c:url value="${entry.product.url}" var="productUrl"/>
		<li class="checkout-order-summary-list-items">
			<div class="thumb">
				<a href="${fn:escapeXml(productUrl)}">
					<product:productPrimaryImage product="${entry.product}" format="thumbnail"/>
				</a>
			</div>
			<div class="price"><format:price priceData="${entry.basePrice}" displayFreeForZero="true"/></div>
			<div class="details">
				<div class="name"><a href="${fn:escapeXml(productUrl)}">${fn:escapeXml(entry.product.name)}</a></div>
				<div class="qty"> <span> <spring:theme code="basket.page.qty"/>&nbsp;${fn:escapeXml(entry.quantity)} </span> </div>
				<div class="variants">
					<c:forEach items="${entry.product.baseOptions}" var="option">
						<c:if test="${not empty option.selected and option.selected.url eq entry.product.url}">
							<c:forEach items="${option.selected.variantOptionQualifiers}" var="selectedOption">
								<div>${fn:escapeXml(selectedOption.name)}: ${fn:escapeXml(selectedOption.value)}</div>
							</c:forEach>
						</c:if>
					</c:forEach>
				</div>
				<c:if test="${ycommerce:doesPotentialPromotionExistForOrderEntryOrOrderEntryGroup(cartData, entry) && showPotentialPromotions}">
					<div>
						<c:forEach items="${cartData.potentialProductPromotions}" var="promotion">
							<c:set var="displayed" value="false"/>
							<c:forEach items="${promotion.consumedEntries}" var="consumedEntry">
								<c:if test="${not displayed && ycommerce:isConsumedByEntry(consumedEntry,entry)}">
									<c:set var="displayed" value="true"/>
									<span class="promotion">${ycommerce:sanitizeHTML(promotion.description)}</span>
								</c:if>
							</c:forEach>
						</c:forEach>
					</div>
				</c:if>
				<c:if test="${ycommerce:doesAppliedPromotionExistForOrderEntryOrOrderEntryGroup(cartData, entry)}">
					<div>
						<c:forEach items="${cartData.appliedProductPromotions}" var="promotion">
							<c:set var="displayed" value="false"/>
							<c:forEach items="${promotion.consumedEntries}" var="consumedEntry">
								<c:if test="${not displayed && ycommerce:isConsumedByEntry(consumedEntry,entry)}">
									<c:set var="displayed" value="true"/>
									<span class="promotion">${ycommerce:sanitizeHTML(promotion.description)}</span>
								</c:if>
							</c:forEach>
						</c:forEach>
					</div>
				</c:if>
				<common:configurationInfos entry="${entry}"/>
			</div>
		
		
		</li>
</c:forEach>

</ul>
