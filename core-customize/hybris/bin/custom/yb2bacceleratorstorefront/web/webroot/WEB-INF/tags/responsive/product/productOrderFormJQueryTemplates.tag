<%@ tag body-content="empty" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<script id="future-stock-template" type="text/x-jquery-tmpl">
	<span class="future_stock">
		<span class="future_stock_table">
			{{each(index, availability) availabilities}}
			<div class="future_stock_value">
                <div>\${formattedDate}</div>
			    <div>\${stock.stockLevel}</div>
            </div>
			{{/each}}
		</span>
	</span>
</script>
<script id="future-tooltip-error-template" type="text/x-jquery-tmpl">
	<span class='oms_message_holder' id='oms-message-holder'>$\{errorMessage}</span>
</script>

<script id="variant-summary" type="text/x-jquery-tmpl">
    <tr class="variant-summary hidden-sm hidden-md hidden-lg">
        <td colspan="2">
            <table class="variant-summary-items">
                <tr>
                    <td class="variant-property"></td>
                    <td><spring:theme code="product.grid.quantityText" /></td>
                    <td><spring:theme code="product.grid.subtotalText" /></td>
                </tr>
                {{each(index, availability) variants}}
                    <tr>
                        <td>\${size}</td>
                        <td>\${quantity}</td>
                        <td>\${total}</td>
                    </tr>
                {{/each}}
            </table>
        </td>
    </tr>
</script>