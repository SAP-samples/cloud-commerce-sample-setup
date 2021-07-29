<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="theme" tagdir="/WEB-INF/tags/shared/theme" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<spring:url value="/cart/addQuickOrder" var="quickOrderAddToCartUrl" htmlEscape="false"/>
<spring:theme code="text.quickOrder.product.quantity.max" var="maxProductQtyMsgHtml"/>
<spring:theme code="text.quickOrder.form.product.exists" var="productExistsInFormMsgHtml"/>

<div class="js-quick-order-container" data-quick-order-min-rows="${quickOrderMinRows}"
	 data-quick-order-max-rows="${quickOrderMaxRows}" data-quick-order-add-to-cart-url="${quickOrderAddToCartUrl}"
	 data-product-exists-in-form-msg="${productExistsInFormMsgHtml}">

	<ul class="item__list item__list__cart quick-order__list js-ul-container">
		<li class="hidden-xs hidden-sm">
			<ul class="item__list--header">
				<li class="item__sku__input"><spring:theme code="text.quickOrder.page.product"/></li>
				<li class="item__image"></li>
				<li class="item__info"></li>
				<li class="item__price"><spring:theme code="text.quickOrder.page.price"/></li>
				<li class="item__quantity"><spring:theme code="text.quickOrder.page.qty"/></li>
				<li class="item__total--column"><spring:theme code="text.quickOrder.page.total"/></li>
				<li class="item__remove"></li>
			</ul>
		</li>

        <c:forEach begin="1" end="${quickOrderMinRows}">
            <li class="item__list--item js-li-container">
                <div class="item__sku__input js-sku-container">
                    <input type="text" placeholder="Enter SKU" class="js-sku-input-field form-control"/>
                    <input type="hidden" class="js-hidden-sku-field"/>
					<div class="js-sku-validation-container help-block quick-order__help-block"></div>
                </div>
                <div class="item__remove">
                    <button class="btn js-remove-quick-order-row" tabindex="-1">
                        <span class="glyphicon glyphicon-remove"></span>
                    </button>
                </div>
            </li>
        </c:forEach>
	</ul>
</div>
<script id="quickOrderRowTemplate" type="text/x-jquery-tmpl">

	<div class="item__image js-product-info">
		<a href="${request.contextPath}{{= url}}" tabindex="-1">
			{{if images != null && images.length > 0}}
				<img src="{{= images[0].url}}"/>
			{{else}}
				<theme:image code="img.missingProductImage.responsive.thumbnail"/>
			{{/if}}

		</a>
	</div>
	<div class="item__info js-product-info">
		<a href="${request.contextPath}{{= url}}" tabindex="-1">
			<span class="item__name">{{= name}}</span>
		</a>

	   <div class="item__stock">
			<div>
				{{if stock.stockLevelStatus.code && stock.stockLevelStatus.code != 'outOfStock'}}
					<span class="stock">
						<spring:theme code="product.variants.in.stock"/>
					</span>
				{{else}}
					<span class="out-of-stock">
						<spring:theme code="product.variants.out.of.stock"/>
					</span>
				{{/if}}
			</div>
		</div>
	</div>

	<div class="item__price js-product-price js-product-info" data-product-price="{{= price.value}}">
		<span class="visible-xs visible-sm">
			<spring:theme code="basket.page.itemPrice"/>:
		</span>
		{{= price.formattedValue}}
	</div>

	<div class="item__quantity js-product-info">
		<input type="text" class="js-quick-order-qty form-control" value="1" maxlength="3" size="1"
			data-max-product-qty="{{= stock.stockLevel}}" data-stock-level-status="{{= stock.stockLevelStatus.code}}"/>
		<div class="js-product-info js-qty-validation-container help-block quick-order__help-block" data-max-product-qty-msg="${maxProductQtyMsgHtml}"></div>
	</div>


	<div class="item__total js-product-info js-quick-order-item-total">
		{{if stock.stockLevelStatus.code && stock.stockLevelStatus.code != 'outOfStock'}}
			{{= price.formattedValue}}
		{{/if}}
	</div>
</script>