<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="theme" tagdir="/WEB-INF/tags/shared/theme" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:url var="addToCartToPickupInStoreUrl" value="/store-pickup/cart/add"/>

<div class="display-details">
	<div class="store-tabs js-pickup-tabs">
		<div class="tabhead" aria-label="<spring:theme code="storeDetails.title"/>">
			<span class="glyphicon glyphicon-info-sign"></span>

		</div>
		<div class="tabbody">
			<div class="store-image">
				<div class="js-store-image"></div>
				<div class="distance js-store-formattedDistance"></div>
			</div>
			<div class="store-info">
				<div class="name js-store-displayName"></div>
				<div class="address">
					<div class="js-store-line1"></div>
					<div class="js-store-line2"></div>
					<div class="js-store-town"></div>
				</div>
			</div>
		</div>

		<div class="tabhead js-pickup-map-tab" aria-label="<spring:theme code="storeDetails.map.link"/>">
			<span class="glyphicon glyphicon-map-marker"></span>
		</div>
		<div class="tabbody">
			<div class="pickup-map js-map-canvas" ></div>
		</div>

		<div class="tabhead" aria-label="<spring:theme code="storeDetails.table.opening"/>" >
			<span class="glyphicon glyphicon-time"></span>
		</div>
		<div class="tabbody">
			<div class="store-openings">
				<div class="title"><spring:theme code="storeDetails.table.opening" /></div>
				<dl class="dl-horizontal js-store-openings"></dl>
			</div>
		</div>

	</div>

	<div class="pickup-product">
		<div class="variants js-pickup-product-variants"></div>
		<div class="thumb"></div>
		<div class="pickup-product-info">
			<div class="name js-pickup-product-info"></div>
			<div class="price">
				<div class="js-pickup-product-price"></div>
				<div class="stock js-store-stockPickup"></div>
			</div>
		</div>
		<div class="action">

			<form:form  data-id="add_to_cart_storepickup_form" data-class="add_to_cart_storepickup_form" action="${addToCartToPickupInStoreUrl}" method="post">
			<input type="hidden"  class="js-store-id" >
			<input type="hidden" class="js-store-productcode" name="productCodePost" value=""/>




			<div class="qty-selector js-qty-selector"> 
				<div class="input-group">
					<span class="input-group-btn">
						<button class="btn btn-primary js-qty-selector-minus" type="button"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></button>
					</span>
					<input type="text" class="form-control js-qty-selector-input" value="1" name="hiddenPickupQty">
					<span class="input-group-btn">
						<button class="btn btn-primary js-qty-selector-plus" type="button"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
					</span>
				</div>
			</div>
			<button class="btn btn-primary js-add-to-cart-for-pickup-popup" type="submit"><spring:theme code="text.addToCart"/></button>
			</form:form> 
		</div>
	</div>
</div>

