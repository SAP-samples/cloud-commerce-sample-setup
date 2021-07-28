<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="formElement" tagdir="/WEB-INF/tags/responsive/formElement" %>
<%@ taglib prefix="quote" tagdir="/WEB-INF/tags/responsive/quote" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="format" tagdir="/WEB-INF/tags/shared/format" %>

<spring:htmlEscape defaultHtmlEscape="true" />
<c:url value="${continueUrl}" var="continueShoppingUrl" scope="session"/>
<spring:url value="/quote/{/quoteCode}/expiration/" var="expirationTimeUrl" htmlEscape="false">
    <spring:param name="quoteCode" value="${cartData.quoteData.code}"/>
</spring:url>
<spring:url value="/quote/{/quoteCode}/metadata/" var="metadataUrl" htmlEscape="false">
    <spring:param name="quoteCode" value="${cartData.quoteData.code}"/>
</spring:url>

<spring:theme code="text.quote.dateformat.datepicker.selection" var="dateFormatForDatePickerHtml" />
<spring:theme code="text.quote.dateformat.datepicker.selection.hint" var="dateFormatHintHtml" />

<form:form method="post" modelAttribute="quoteForm" id="quoteForm" action="#">
    <c:if test="${cartData.totalPrice.value lt 0}">
        <div class="alert alert-danger getAccAlert" role="alert">
            <button type="button" class="close closeAccAlert" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <spring:theme code="text.quote.not.submitable"/>
        </div>
    </c:if>
    <input type="hidden" id="editMode" name="editMode" value="true"/>
    <div class="form__actions">
        <div class="row">
            <c:if test="${allowedActions['EDIT']}">
                <div class="col-sm-4 col-md-3 ">
                    <button type="button"
                        class="btn btn-default btn-block btn--continue-shopping js-continue-shopping-button"
                        data-continue-shopping-url="${fn:escapeXml(continueShoppingUrl)}">
                        <spring:theme code="cart.page.continue" />
                    </button>
                </div>
            </c:if>
            
            <c:if test="${allowedActions['CANCEL']}">
                <div class="col-sm-4 col-md-3 col-md-offset-3">
                    <button type="button" class="btn btn-default btn-block js-quote-cancel-btn form__actions--cancel">
                        <spring:theme code="quote.cancel" />
                    </button>
                </div>
            </c:if>

            <c:if test="${ycommerce:isQuoteUserSalesRep()}">
                <div class="col-xs-12 col-sm-4 col-md-offset-2">
                    <div class="form-element-icon datepicker quote__expiration" id="js-quote-expiration-time"
                         data-date-format-for-date-picker="${dateFormatForDatePickerHtml}"
                         data-expiration-time-url="${fn:escapeXml(expirationTimeUrl)}"
                         data-min-offer-validity-period-days="${fn:escapeXml(minOfferValidityPeriodDays)}">
                        <formElement:formInputBox idKey="expirationTime"
                                                  labelKey="text.quote.expiration.time.label" labelCSS="quote__expiration--label" path="expirationTime"
                                                  inputCSS="text quote__expiration--input" mandatory="true" placeholder="${dateFormatHintHtml}"/>
                        <i class="glyphicon glyphicon-calendar js-open-datepicker-quote-expiration-time"></i>
                    </div>
                </div>
            </c:if>

            <c:if test="${allowedActions['SUBMIT']}">
                <div class="col-sm-4 col-md-3">
                    <c:choose>
                        <c:when test="${cartData.totalPrice.value lt 0}">
                            <button type="button" class="btn btn-primary btn-block col-md-4 pull-right js-quote-submit-btn form__actions--submit"
                                    disabled="disabled" >
                                <spring:theme code="quote.submit" />
                            </button>
                        </c:when>
                        <c:otherwise>
                            <button type="button" class="btn btn-primary btn-block col-md-4 pull-right js-quote-submit-btn form__actions--submit">
                                <spring:theme code="quote.submit" />
                            </button>
                        </c:otherwise>
                    </c:choose>
                </div>
            </c:if>
        </div>
    </div>

    <div class="cart__quote__edit">
        <div class="quote__head">
            <div class="row">
                <div class="col-xs-10 col-sm-5">
                    <span class="glyphicon glyphicon-flag" aria-hidden="true"></span>
                    <span class="quote__head--title"><spring:theme code="quote.cart.title" /></span>
                </div>
                <div class="col-xs-2 text-right hidden-sm hidden-md hidden-lg">
                    <button class="quote__form--toggle js-quote-toggle-btn" type="button" data-toggle="collapse" data-target="#quote__form--collapse" aria-expanded="false" aria-controls="quote__form--collapse"></button>
                </div>
                <div class="col-xs-7 col-sm-3">
                    <label class="quote__head--label">
                        <spring:theme code="text.quote.state.label"/>:
                    </label>
                    <span class="label__value">
                        <spring:theme code="text.account.quote.status.display.${fn:escapeXml(cartData.quoteData.state)}"/>
                    </span>
                </div>
                <div class="col-xs-7 col-sm-3">
                    <label class="quote__head--label">
                        <spring:theme code="text.quote.code"/>
                    </label>
                    <span class="cart__id">${fn:escapeXml(cartData.quoteData.code)}</span>
                </div>
                <div class="col-sm-1 text-right hidden-xs">
                    <button class="quote__form--toggle js-quote-toggle-btn" type="button" data-toggle="collapse" data-target="#quote__form--collapse" aria-expanded="false" aria-controls="quote__form--collapse"></button>
                </div>
            </div>
        </div>
    </div>
    <div id="quote__form--collapse" class="collapse in">
        <div id="quoteFormDiv" class="js-quote-form" data-metadata-url="${fn:escapeXml(metadataUrl)}">
            <div class="quote__form--section">
                <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4" id="js-quote-name-wrapper">
                        <c:choose>
                            <c:when test="${ycommerce:isQuoteUserSalesRep()}">
                                <formElement:formInputBox idKey="js-quote-name"
                                                          labelKey="text.quote.name.label" path="name"
                                                          inputCSS="text" mandatory="true" disabled="true" maxlength="255"/>
                            </c:when>
                            <c:otherwise>
                                <formElement:formInputBox idKey="js-quote-name"
                                                          labelKey="text.quote.name.label" path="name"
                                                          inputCSS="text" mandatory="true" maxlength="255"/>
                            </c:otherwise>
                        </c:choose>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-7 col-md-offset-1">
                        <c:choose>
                            <c:when test="${ycommerce:isQuoteUserSalesRep()}">
                                <formElement:formInputBox idKey="js-quote-description"
                                                          labelKey="text.quote.description.label" path="description"
                                                          inputCSS="text" mandatory="false" disabled="true" maxlength="255"/>
                            </c:when>
                            <c:otherwise>
                                <formElement:formInputBox idKey="js-quote-description"
                                                          labelKey="text.quote.description.label" path="description"
                                                          inputCSS="text" mandatory="false" maxlength="255"/>
                            </c:otherwise>
                        </c:choose>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-7 col-md-offset-5 col-sm-offset-6">
                        <div class="quote__estimate">
                            <label class="quote__estimate--label">
                                <spring:theme code="text.quote.previous.estimated.total.display"/>
                            </label>
                            <span class="quote__estimate--amount">
                                <format:price priceData="${cartData.quoteData.previousEstimatedTotal}"/>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-xs-12">
                    <div class="quote__comments__header">
                        <button class="quote__comments--toggle collapsed js-quote-comments-btn" type="button" data-toggle="collapse" data-target="#comments__collapse" aria-expanded="false" aria-controls="comments__collapse">
                        </button>
                        <span><spring:theme code="quote.cart.comments"/></span>
                    </div>
                    <div class="quote__comments">
                        <div class="collapse quote__comments--wrapper" id="comments__collapse">
                            <quote:quoteComments comments="${cartData.comments}"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
	
</form:form>

<quote:quoteCancelConfirmation quoteData="${cartData.quoteData}"/>
<quote:quoteSubmitConfirmation quoteData="${cartData.quoteData}"/>
