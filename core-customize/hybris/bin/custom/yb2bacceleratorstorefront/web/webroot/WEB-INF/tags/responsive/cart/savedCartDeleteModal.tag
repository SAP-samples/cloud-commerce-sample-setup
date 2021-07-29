<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags"%>
<%@ attribute name="savedCart" required="true" type="de.hybris.platform.commercefacades.order.data.CartData" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<div class="hidden">
	<c:set var="savedCartInfo">
		{
			"name" : "${ycommerce:encodeJSON(savedCart.name)}",
			"id" : "${ycommerce:encodeJSON(savedCart.code)}",
			"numberOfProducts" : "${ycommerce:encodeJSON(savedCart.totalItems)}"
		}
	</c:set>

	<div id="popup_confirm_savedcart_delete_${fn:escapeXml(savedCart.code)}"
		class="js-savedcart_delete_confirm_modal"
		data-savedCartInfo="${fn:escapeXml(savedCartInfo)}">
		<p>
			<spring:theme code="text.account.savedcart.delete.msg"/>
		</p>
		<div class="modal-details row">
			<span class="col-xs-6"><spring:theme code="text.account.savedcart.cart.name"/>:</span>
			<span class="col-xs-6"><b>${fn:escapeXml(savedCart.name)}</b></span>
			<span class="col-xs-6"><spring:theme code="text.account.savedcart.cart.id"/>:</span>
			<span class="col-xs-6"><b>${fn:escapeXml(savedCart.code)}</b></span>
			<span class="col-xs-6"><spring:theme code="text.account.savedcart.numberofproducts"/>:</span>
			<span class="col-xs-6"><b>${fn:escapeXml(savedCart.totalItems)}</b></span>
		</div>
		<div class="modal-actions">
			<div class="row">
				<div class="col-xs-12 col-sm-6 col-sm-push-6">
					<button type="button" class="js-savedcart_delete_confirm btn btn-primary btn-block"
						data-savedcart-id="${fn:escapeXml(savedCart.code)}"><spring:theme code="general.delete.button"/>
					</button>
				</div>
				<div class="col-xs-12 col-sm-6 col-sm-pull-6">
					<button type="button" class="js-savedcart_delete_confirm_cancel btn btn-default btn-block">
						<spring:theme code="text.button.cancel"/>
					</button>
				</div>
			</div>
		</div>
	</div>
</div>