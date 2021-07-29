<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="cartData" required="true" type="de.hybris.platform.commercefacades.order.data.AbstractOrderData" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags"%>
<%@ taglib prefix="format" tagdir="/WEB-INF/tags/shared/format" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:set var="quoteData" value="${cartData.quoteData}"/>
<spring:url value="/quote/{/quoteCode}/discount/apply" var="quoteDiscountApplyAction" htmlEscape="false">
    <spring:param name="quoteCode"  value="${fn:escapeXml(quoteData.code)}"/>
</spring:url>

<c:if test="${not empty quoteData}">
	<c:if test="${ycommerce:isQuoteUserSalesRep() && !disableUpdate}">
		<div class="col-xs-12 cart-totals-right text-right">
			<%--Get quote discount link. START --%>
			<c:choose>
			  <c:when test="${cartData.quoteDiscounts.value > 0 && cartData.quoteDiscountsType == 'PERCENT'}">
			     <fmt:formatNumber var="formattedQuoteDiscountsRate" value="${cartData.quoteDiscountsRate}" maxFractionDigits="2" minFractionDigits="2"/>
			  	 <spring:theme var="quotePercentDiscountLinkHtml" code="basket.page.quote.discounts.link.percent.off" argumentSeparator=";" arguments="${formattedQuoteDiscountsRate}"/>
			    <c:set var="quoteDiscountLinkHtml" value="${quotePercentDiscountLinkHtml}"/>
			  </c:when>
			  <c:when test="${cartData.quoteDiscounts.value > 0 && (cartData.quoteDiscountsType == 'ABSOLUTE' || cartData.quoteDiscountsType == 'TARGET')}">
			  	 <spring:theme var="quoteAbsoluteDiscountLinkHtml" code="basket.page.quote.discounts.link.absolute.off" argumentSeparator=";" arguments="${cartData.quoteDiscounts.formattedValue}"/>
			    <c:set var="quoteDiscountLinkHtml" value="${quoteAbsoluteDiscountLinkHtml}"/>
			  </c:when>
			  <c:otherwise>
			  	 <spring:theme var="quoteDiscountTextLinkHtml" code="basket.page.quote.discounts.link" />
			    <c:set var="quoteDiscountLinkHtml" value="${quoteDiscountTextLinkHtml}"/>
			  </c:otherwise>
			</c:choose>
			<%--Get quote discount link. END --%>
			<a href="#" class="js-quote-discount-link <c:if test="${cartData.quoteDiscounts.value > 0}">quote-discount-link</c:if>">${quoteDiscountLinkHtml}</a>
			<div style="display: none">
				<spring:theme code="text.quote.discount.modal.title" arguments="${quoteData.code}" var="discountModalTitleHtml" />
				<div id="js-quote-discount-modal"
					data-quote-modal-title="${discountModalTitleHtml}"
					data-quote-modal-total="${fn:escapeXml(cartData.subTotalWithoutQuoteDiscounts.value)}"
					data-quote-modal-quote-discount="${fn:escapeXml(cartData.quoteDiscounts.value)}"
					data-quote-modal-currency="${fn:escapeXml(currentCurrency.symbol)}">
					<div class="quote-discount__modal">
						<form:form id="quoteDiscountForm"
							action="${quoteDiscountApplyAction}" method="post"
							modelAttribute="quoteDiscountForm">
							<div class="row">
								<div class="col-xs-6 col-sm-7">
									<label class="quote-discount__modal--label text-left"> <spring:theme code="text.quote.discount.by.percentage" /></label>
								</div>
								<div class="col-xs-6 col-sm-5">
									<div class="input-group quote-discount__modal--input">
										<span class="quote-discount__modal--input__label">%</span> 
										<input type="text" min="0" max="100" step="any" class="form-control input-sm pull-right text-right" name="quote-discount-by-percentage" id="js-quote-discount-by-percentage" maxlength="10" />
									</div>
								</div>
							</div>

							<div class="row">
								<div class="col-xs-6 col-sm-7">
									<label class="quote-discount__modal--label text-left"> <spring:theme code="text.quote.discount.by.amount" /></label>
								</div>
								<div class="col-xs-6 col-sm-5">
									<div class="input-group quote-discount__modal--input">
										<span class="quote-discount__modal--input__label">$</span> 
										<input type="text" step="any" class="form-control input-sm pull-right text-right" name="quote-discount-by-amount" id="js-quote-discount-by-amount" maxlength="10" />
									</div>
								</div>
							</div>

							<div class="row">
								<div class="col-xs-6 col-sm-7">
									<label class="quote-discount__modal--label text-left"> <spring:theme code="text.quote.discount.adjust.total" /></label>
								</div>
								<div class="col-xs-6 col-sm-5">
									<div class="input-group quote-discount__modal--input">
										<span class="quote-discount__modal--input__label">$</span> 
										<input type="text" step="any" class="form-control input-sm pull-right text-right" name="quote-discount-adjust-total" id="js-quote-discount-adjust-total" maxlength="10" />
									</div>
								</div>
							</div>

							<div class="quote-discount__modal--original__total">
								<div class="row">
									<div class="col-xs-6 text-left">
										<spring:theme code="basket.page.totals.quote.total.original" />
									</div>

									<div class="col-xs-6 text-right">
										<format:price priceData="${cartData.subTotalWithoutQuoteDiscounts}" />
									</div>
								</div>
							</div>
							<div class="quote-discount__modal--new__total">
								<div class="row">
									<div class="col-xs-6 text-left">
										<spring:theme code="basket.page.totals.quote.total.after.discount" />
									</div>
									<div class="col-xs-6 text-right" id="js-quote-discount-new-total">
										<format:price priceData="${cartData.subTotal}" />
									</div>
								</div>
							</div>

							<form:input type="hidden" name="quote-discount-rate" id="js-quote-discount-rate" value="${cartData.quoteDiscountsRate}" maxlength="10" path="discountRate" />
							<form:input type="hidden" name="quote-discount-type" id="js-quote-discount-type" value="${cartData.quoteDiscountsType}" maxlength="10" path="discountType" />

                            <button type="submit" class="btn btn-primary btn-block" id="submitButton">
                                <spring:theme code="text.quote.done.button.label" />
                            </button>
							<button type="button" class="btn btn-default btn-block" id="cancelButton">
								<spring:theme code="text.quote.cancel.button.label" />
							</button>
						</form:form>
					</div>
				</div>
			</div>
		</div>
	</c:if>
</c:if>
