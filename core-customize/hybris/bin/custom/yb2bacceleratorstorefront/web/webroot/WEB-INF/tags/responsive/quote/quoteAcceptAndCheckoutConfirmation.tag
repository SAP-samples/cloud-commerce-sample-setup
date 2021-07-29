<%@ tag body-content="empty" trimDirectiveWhitespaces="true"%>
<%@ attribute name="quoteData" required="true" type="de.hybris.platform.commercefacades.quote.data.QuoteData"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:htmlEscape defaultHtmlEscape="true" />
<spring:url value="/quote/{/quoteCode}/checkout/" var="checkoutQuoteUrl" htmlEscape="false">
    <spring:param name="quoteCode"  value="${quoteData.code}"/>
</spring:url>


<div style="display:none">
    <spring:theme code="text.quote.checkout.confirmation.modal.title"  arguments="${quoteData.code}"
                  var="submitConfirmationModalTitleHtml"/>
    <div id="js-quote-checkout-modal" data-submit-confirmation-modal-title="${submitConfirmationModalTitleHtml}">
        <div class="modal__top">
            <label class="modal__top--label">
                <spring:theme code="text.quote.name.label"/>
            </label>
            <p class="modal__top--text">${fn:escapeXml(quoteData.name)}</p>
            <label class="modal__top--label">
                <spring:theme code="text.quote.description.label"/>
            </label>
            <p class="modal__top--text">${fn:escapeXml(quoteData.description)}</p>
        </div>
        <c:if test="${not empty quoteData.expirationTime}">
            <p class="modal__bottom--text">
                <fmt:formatDate value="${quoteData.expirationTime}" dateStyle="medium" timeStyle="short" type="both"
                                var="formattedExpirationTime"/>
                <spring:theme code="text.quote.validity.message"
                              arguments="${formattedExpirationTime}" argumentSeparator="$$"/>
            </p>
        </c:if>

        <div class="modal__bottom">
            <p class="modal__bottom--text modal__text--bold"><spring:theme code="text.quote.checkout.warning.message"/></p>
        </div>

        <form:form action="${checkoutQuoteUrl}">
            <button type="submit" class="btn btn-primary btn-block" id="submitYesButton">
                <spring:theme code="text.quote.yes.button.label"/>
            </button>
            <button type="button" class="btn btn-default btn-block" id="submitNoButton">
                <spring:theme code="text.quote.no.button.label"/>
            </button>
        </form:form>
    </div>
</div>
