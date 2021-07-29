<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<script id="cartPotentialPromotionSectionTemplate" type="text/x-jquery-tmpl">
    {{if potentialOrderPromotions.length > 0}}
        <div class="cartpotproline">
             <spring:theme code="basket.potential.promotions"/>
             <ycommerce:testId code="potentialPromotions_promotions_labels">
             {{each(index, potentialOrderPromotion) potentialOrderPromotions}}
                 <div class="promotion">{{= potentialOrderPromotion.description}}</div>
             {{/each}}
             </ycommerce:testId>
        </div>
    {{/if}}
</script>

<div id="ajaxCartPotentialPromotionSection">
</div>


