<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<spring:htmlEscape defaultHtmlEscape="true"/>

<div class="account-section-header consent-section-header">
    <div class="row">
        <div class="container-lg col-md-6">
            <spring:theme code="text.account.consent.consentManagement"/>
        </div>
    </div>
</div>
<div class="row">
    <div class="container-lg col-md-6">
        <div class="account-section-content">
            <div class="account-section-form consent-section-form">
                <div id="consent-management-form" data-consent-management-url="${fn:escapeXml(consentManagementUrl)}">
                    <c:if test="${not empty consentTemplateDataList}">
                    	<div class="consent-management-intro">
							<p> <spring:theme code="text.account.consent.consentManagement.general.text"/> </p>
						</div>

                        <ul class="consent-management-list" role="tablist" aria-live="polite" data-behavior="accordion">

                            <c:forEach items="${consentTemplateDataList}" var="consentTemplateData" varStatus="loop">

                                <li class="consent-management-list__item" data-binding="expand-accordion-item">

                                    <c:set var="consentTemplateId" value="${fn:escapeXml(consentTemplateData.id)}"/>

                                     <span tabindex="0"
                                       class="consent-management-list__title"
                                       aria-controls="panel1"
                                       role="tab"
                                       aria-selected="false"
                                       aria-expanded="false"
                                       data-binding="expand-accordion-trigger">

                                            <label for="${consentTemplateId}" class="consent-management-list__label"> ${fn:escapeXml(consentTemplateData.name)} </label>

                                     </span>


                                      <div id="consent-template-description-${loop.index}" class="consent-management-list__content" role="tabpanel" aria-hidden="true" aria-labelledby="tab1" data-binding="expand-accordion-container">
                                            <div class="consent-management-list__content-inner">
                                                <p> ${fn:escapeXml(consentTemplateData.description)} </p>
                                            </div>
                                      </div>


                                        <div class="toggle-button">

                                            <c:choose>
                                                <c:when test="${not empty consentTemplateData.consentData && empty consentTemplateData.consentData.consentWithdrawnDate}">
                                                    <input tabindex="0" id="${consentTemplateId}" type="checkbox" class="toggle-button__input" disabled="disabled" checked>
                                                    <label for="${consentTemplateId}">
                                                        <div class="toggle-button__switch is-checked"></div>
                                                    </label>
                                                </c:when>
                                                <c:otherwise>
                                                    <input tabindex="0" id="${consentTemplateId}" type="checkbox" class="toggle-button__input" disabled="disabled">
                                                    <label for="${consentTemplateId}">
                                                        <div class="toggle-button__switch"></div>
                                                    </label>
                                                </c:otherwise>
                                            </c:choose>

                                        </div>


                                    <spring:url value="/my-account/consents/give/{/consentTemplateId}/{/version}"
                                                var="giveConsentUrl" htmlEscape="false">
                                        <spring:param name="consentTemplateId" value="${consentTemplateData.id}"/>
                                        <spring:param name="version" value="${consentTemplateData.version}"/>
                                    </spring:url>
                                    <form:form action="${giveConsentUrl}" method="POST">
                                        <button hidden type="submit" id="give-consent-button-${consentTemplateId}"></button>
                                    </form:form>

                                    <spring:url value="/my-account/consents/withdraw/{/consentCode}" var="withdrawConsentUrl"
                                                htmlEscape="false">
                                        <spring:param name="consentCode" value="${consentTemplateData.consentData.code}"/>
                                    </spring:url>
                                    <form:form action="${withdrawConsentUrl}" method="POST">
                                        <button hidden type="submit" id="withdraw-consent-button-${consentTemplateId}"></button>
                                    </form:form>
                                </li>
                            </c:forEach>
                        </ul>
                    </c:if>
                </div>
            </div>
        </div>
    </div>
</div>
