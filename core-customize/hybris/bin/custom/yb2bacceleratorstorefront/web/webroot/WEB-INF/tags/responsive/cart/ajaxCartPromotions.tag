<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<script id="cartPromotionSectionTemplate" type="text/x-jquery-tmpl">
    {{if appliedOrderPromotions.length > 0}}
        <div class="cartproline">
             <spring:theme code="basket.received.promotions" />
             <ycommerce:testId code="cart_recievedPromotions_labels">
             {{each(index, appliedOrderPromotion) appliedOrderPromotions}}
                 <div class="promotion">{{= appliedOrderPromotion.description}}</div>
             {{/each}}
             </ycommerce:testId>
         </div>
    {{/if}}
</script>

<div id="ajaxCartPromotionSection">
</div>


