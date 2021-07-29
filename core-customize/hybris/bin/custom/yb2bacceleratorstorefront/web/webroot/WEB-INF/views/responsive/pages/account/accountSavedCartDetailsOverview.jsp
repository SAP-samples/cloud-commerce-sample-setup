<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="cart" tagdir="/WEB-INF/tags/responsive/cart" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<div class="well well-tertiary well-lg">
	<div class="row">
		<div class="col-sm-9 col-no-padding">
			<div class="row">
				<div class="col-sm-3 item-wrapper">
					<div class="item-group">
						<ycommerce:testId code="savedCartDetails_overviewName_label">
							<span class="item-label"><spring:theme code="text.account.savedCart.name" /></span>
							<span class="item-value">${fn:escapeXml(savedCartData.name)}</span>
						</ycommerce:testId>
					</div>
				</div>
				<div class="col-sm-3 item-wrapper">
					<div class="item-group">
						<ycommerce:testId code="savedCartDetails_overviewId_label">
							<span class="item-label"><spring:theme code="text.account.savedCart.id" /></span>
							<span class="item-value">${fn:escapeXml(savedCartData.code)}</span>
						</ycommerce:testId>
					</div>
				</div>
				<div class="col-sm-3 item-wrapper">
					<div class="item-group">
						<ycommerce:testId code="savedCartDetails_overviewSaveDate_label">
							<span class="item-label"><spring:theme code="text.account.savedCart.dateSaved" /></span>
							<span class="item-value"><fmt:formatDate value="${savedCartData.saveTime}" dateStyle="medium" timeStyle="short" type="both" /></span>
						</ycommerce:testId>
					</div>
				</div>
				<div class="col-sm-3 item-wrapper">
					<div class="item-group">			
						<ycommerce:testId code="savedCartDetails_overviewNumItems_label">
							<span class="item-label"><spring:theme code="text.account.savedCart.qty" /></span>
							<span class="item-value">${fn:length(savedCartData.entries)}</span>
						</ycommerce:testId>
					</div>
				</div>
		        <div class="col-sm-12">
		            <ycommerce:testId code="savedCartDetails_overviewDescription_label">
		                <span class="item-label"><spring:theme code="text.account.savedCart.description" /></span>
		                <span class="item-value">${fn:escapeXml(savedCartData.description)}</span>
		            </ycommerce:testId>
		        </div>
			</div>
		</div>

	    <div class="col-sm-3 item-action">
			<ycommerce:testId code="savedCartDetails_restore_link">
				<c:if test="${fn:length(savedCartData.entries) > 0}">
					<a href="#" class="js-restore-saved-cart restore-item-link"					
						data-savedcart-id="${fn:escapeXml(savedCartData.code)}"
						data-restore-popup-title="<spring:theme code='text.account.savedcart.restore.popuptitle'/>">
						<button id="restoreButton" class="btn btn-primary btn-block">
							<spring:theme code="text.account.savedCart.restore"/>
						</button>
					</a>
				</c:if>
			</ycommerce:testId>
	        <a href="#" class="js-update-saved-cart edit edit-item-link">
	            <button class="btn btn-default btn-block">
	                <spring:theme code="text.account.savedCart.edit"/>
	            </button>
	        </a>
	
			<spring:url value="/my-account/saved-carts/{/cartId}/edit" var="actionUrl" htmlEscape="false">
				<spring:param name="cartId" value="${savedCartData.code}"/>
			</spring:url>
	        <cart:saveCartModal actionUrl="${actionUrl}" titleKey="text.account.savedCart.edit.title"/>
	    </div>
	</div>
	
</div>

<div class="accountActions-link">
    <div class="col-sm-12 disable-link">
		<ycommerce:testId code="savedCartDetails_delete_link">
			<a href="#" class="js-delete-saved-cart remove-item-link"
				data-savedcart-id="${fn:escapeXml(savedCartData.code)}"
				data-delete-popup-title="<spring:theme code='text.account.savedcart.delete.popuptitle'/>">
				<spring:theme code="text.account.savedCart.delete"/>                    
			</a>
			<cart:savedCartDeleteModal savedCart="${savedCartData}"/>
		</ycommerce:testId>
    </div>
</div>