<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ attribute name="cartData" required="true" type="de.hybris.platform.commercefacades.order.data.AbstractOrderData" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true"/>

<spring:url value="/cart/voucher/apply" var="applyVoucherAction" htmlEscape="false"/>
<spring:url value="/cart/voucher/remove" var="removeVoucherAction" htmlEscape="false"/>

<c:set var="containerClass">
    <c:choose>
        <c:when test="${not empty errorMsg}">has-error</c:when>
        <c:when test="${not empty successMsg}">has-success</c:when>
        <c:otherwise></c:otherwise>
    </c:choose>
</c:set>
<c:if test="${empty cartData.quoteData}">
<div class="form-group js-voucher-respond ${containerClass}">
    <spring:theme code="text.voucher.apply.input.placeholder" var="voucherInputPlaceholder" htmlEscape="false"/>
    <label class="control-label cart-voucher__label" for="voucher-code"><spring:theme
            code="text.voucher.apply.input.label"/></label>
    <form:form id="applyVoucherForm" action="${applyVoucherAction}" method="post" modelAttribute="voucherForm">
        <form:input cssClass="js-voucher-code cart-voucher__input form-control input-sm" name="voucher-code"
                    id="js-voucher-code-text" maxlength="100" placeholder="${voucherInputPlaceholder}"
                    path="voucherCode" disabled="${disableUpdate}"/>
		<c:if test="${not disableUpdate}">
	        <button type="button" id="js-voucher-apply-btn" class="btn btn-primary btn-small cart-voucher__btn">
	            <spring:theme code="text.voucher.apply.button.label"/></button>
		</c:if>
    </form:form>

    <div class="js-voucher-validation-container help-block cart-voucher__help-block">
        ${fn:escapeXml(errorMsg)}
        ${fn:escapeXml(successMsg)}
    </div>
</div>


<ul id="js-applied-vouchers" class="selected_product_ids clearfix voucher-list">
    <c:forEach items="${cartData.appliedVouchers}" var="voucher" varStatus="loop">
        <li class="voucher-list__item">
            <form:form id="removeVoucherForm${loop.index}" action="${removeVoucherAction}" method="post"
                       modelAttribute="voucherForm">
                <span class="js-release-voucher voucher-list__item-box" id="voucher-code-${fn:escapeXml(voucher)}">
                     ${fn:escapeXml(voucher)}
                     <form:input hidden="hidden" value="${fn:escapeXml(voucher)}" path="voucherCode"/>
                    <span class="glyphicon glyphicon-remove js-release-voucher-remove-btn voucher-list__item-remove"></span>
                </span>
            </form:form>
        </li>
    </c:forEach>
</ul>
</c:if>