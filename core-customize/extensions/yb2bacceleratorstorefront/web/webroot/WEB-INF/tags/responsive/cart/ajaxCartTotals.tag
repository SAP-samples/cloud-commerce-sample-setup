<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="theme" tagdir="/WEB-INF/tags/shared/theme" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="quote" tagdir="/WEB-INF/tags/responsive/quote" %>
<%@ taglib prefix="format" tagdir="/WEB-INF/tags/shared/format" %>
<%@ attribute name="showTax" required="false" type="java.lang.Boolean" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<script id="cartTotalsTemplate" type="text/x-jquery-tmpl">
    <div class="row">
        <div class="col-xs-6 cart-totals-left"><spring:theme code="basket.page.totals.subtotal"/></div>
        <div class="col-xs-6 cart-totals-right text-right">
             <ycommerce:testId code="Order_Totals_Subtotal">{{= subTotal.formattedValue}}</ycommerce:testId>
        </div>


        {{if deliveryCost}}
            <div class="col-xs-6 cart-totals-left"><spring:theme code="basket.page.totals.delivery"/></div>
            <div class="col-xs-6 cart-totals-right text-right">
                {{if deliveryCost.value > 0}}
                    {{= deliveryCost.formattedValue}}
                {{else}}
                    <spring:theme code="basket.page.free"/>
                {{/if}}
            </div>
         {{/if}}


        {{if net && totalTax.value > 0}}
            <div class="col-xs-6 cart-totals-left"><spring:theme code="basket.page.totals.netTax"/></div>
            <div class="col-xs-6 cart-totals-right text-right">{{= totalTax.formattedValue}}</div>
        {{/if}}

		{{if quoteData }}
			<quote:quoteDiscounts cartData="${cartData}"/>
		{{/if}}

		{{if quoteDiscounts.value > 0}}
			<div class="col-xs-6 cart-totals-left discount">
				<spring:theme code="basket.page.quote.discounts"/>
			</div>
			<div class="col-xs-6 cart-totals-right text-right discount">
				<ycommerce:testId code="Quote_Totals_Savings">
					<format:price priceData="${quoteDiscounts}" displayNegationForDiscount="true" />
				</ycommerce:testId>
			</div>
		{{/if}}

		{{if totalDiscounts.value > 0}}
			<div class="col-xs-6 cart-totals-left discount">
				<spring:theme code="basket.page.totals.discounts"/>
			</div>
			<div class="col-xs-6 cart-totals-right text-right discount">
				<ycommerce:testId code="Order_Totals_Savings">
					<format:price priceData="${totalDiscounts}" displayNegationForDiscount="true" />
				</ycommerce:testId>
			</div>
		{{/if}}

        <div class="col-xs-6 cart-totals-left grand-total"><spring:theme code="basket.page.totals.total"/></div>
        <div class="col-xs-6 cart-totals-right text-right grand-total">
            <ycommerce:testId code="cart_totalPrice_label">
            {{if net}}
                {{= totalPriceWithTax.formattedValue}}
            {{else}}
                {{= totalPrice.formattedValue}}
            {{/if}}
            </ycommerce:testId>
        </div>


       {{if !net}}
            <div class="cart-totals-taxes text-right">
                <ycommerce:testId code="cart_taxes_label"><spring:theme code="basket.page.totals.grossTax" arguments="{{= totalTax.formattedValue}}" argumentSeparator="!!!!" /></ycommerce:testId>
             </div>
        {{/if}}


       {{if net && totalTax.value <= 0}}
            <div class="cart-totals-taxes text-right">
                <ycommerce:testId code="cart_taxes_label"><spring:theme code="basket.page.totals.noNetTax"/></ycommerce:testId>
            </div>
        {{/if}}
    </div>
</script>

<div id="ajaxCart">
</div>
