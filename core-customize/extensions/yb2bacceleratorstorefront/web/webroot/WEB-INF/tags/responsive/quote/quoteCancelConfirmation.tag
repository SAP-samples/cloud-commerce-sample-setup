<%@ tag body-content="empty" trimDirectiveWhitespaces="true"%>
<%@ attribute name="quoteData" required="true" type="de.hybris.platform.commercefacades.quote.data.QuoteData"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:htmlEscape defaultHtmlEscape="true" />
<spring:url value="/quote/{/quoteCode}/cancel/" var="cancelQuoteUrl" htmlEscape="false">
    <spring:param name="quoteCode"  value="${quoteData.code}"/>
</spring:url>

<div style="display:none">
	<spring:theme code="text.quote.cancel.confirmation.modal.title" arguments="${quoteData.code}"
				  var="cancelConfirmationModalTitleHtml"/>
	<div id="js-quote-cancel-modal" data-cancel-confirmation-modal-title="${cancelConfirmationModalTitleHtml}">
		<div class="modal__top">
            <label class="modal__top--label">
                <spring:theme code="text.quote.name.label"/>
            </label>
            <p class="modal__top--text js-modal-quote-name">${fn:escapeXml(quoteData.name)}</p>
            <label class="modal__top--label">
                <spring:theme code="text.quote.description.label"/>
            </label>
            <p class="modal__top--text js-modal-quote-description">${fn:escapeXml(quoteData.description)}</p>
        </div>
        <div class="modal__bottom">
            <c:if test="${(not empty quoteData.expirationTime) && allowedActions['CHECKOUT']}">
                <p class="modal__bottom--text">
                    <fmt:formatDate value="${quoteData.expirationTime}" dateStyle="medium" timeStyle="short" type="both"
                                    var="formattedExpirationTime"/>
                    <spring:theme code="text.quote.validity.message"
                                  arguments="${formattedExpirationTime}" argumentSeparator="$$"/>
                </p>
            </c:if>
            <p class="modal__bottom--text modal__text--bold"><spring:theme code="text.quote.cancel.confirmation.message"/></p>
        </div>
		<form:form action="${cancelQuoteUrl}">
            <button type="submit" class="btn btn-primary btn-block" id="cancelYesButton">
                <spring:theme code="text.quote.yes.button.label"/>
            </button>
			<button type="button" class="btn btn-default btn-block" id="cancelNoButton">
				<spring:theme code="text.quote.no.button.label"/>
			</button>
		</form:form>
	</div>
</div>
