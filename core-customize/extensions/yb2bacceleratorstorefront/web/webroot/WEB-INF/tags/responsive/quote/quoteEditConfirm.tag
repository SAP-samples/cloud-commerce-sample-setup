<%@ tag language="java" pageEncoding="ISO-8859-1"%>
<%@ tag body-content="empty" trimDirectiveWhitespaces="true"%>
<%@ attribute name="quoteData" required="true" type="de.hybris.platform.commercefacades.quote.data.QuoteData"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<spring:htmlEscape defaultHtmlEscape="true" />
<spring:url value="/quote/{/quoteCode}/edit/" var="editQuoteUrl" htmlEscape="false">
    <spring:param name="quoteCode" value="${quoteData.code}"/>
</spring:url>
<div style="display:none">
  <spring:theme code="text.quote.edit.confirmation.modal.title" arguments="${quoteData.code}" var="editConfirmationModalTitleHtml"/>
    <div id="js-quote-edit-modal" data-edit-confirmation-modal-title="${editConfirmationModalTitleHtml}">
        <div><spring:theme code="text.quote.edit.confirmation.message"/></div> 
        <br/>
         <div><b><spring:theme code="text.quote.edit.warning.message"/></b></div>
        <c:if test="${not empty quoteData.expirationTime}">
            <div>
                <fmt:formatDate value="${quoteData.expirationTime}" dateStyle="medium" timeStyle="short" type="both"
                                var="formattedExpirationTime"/>
                <spring:theme code="text.quote.validity.message"
                              arguments="${formattedExpirationTime}" argumentSeparator="$$"/>
            </div>
        </c:if>
         <br/>
      
        <form:form action="${editQuoteUrl}" method="get">
            <button type="button"class="btn btn-primary btn-block" id="cancelEditYesButton">
                <spring:theme code="text.quote.yes.button.label"/>
            </button>
            <button type="button" class="btn btn-default btn-block" id="cancelEditNoButton">
                <spring:theme code="text.quote.no.button.label"/>
            </button>
        </form:form>
    </div>
</div>
