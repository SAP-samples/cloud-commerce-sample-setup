<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<div id="consent-management-alert" data-consent-management-url="">

    <ul class="consent-management-list" role="tablist" aria-live="polite" data-behavior="accordion">

        <c:forEach var="consentTemplate" items="${consentTemplatesToDisplay}" varStatus="loop">

                <li class="consentmanagement-bar alert alert-info consent-management-list__item"  data-code="${fn:escapeXml(consentTemplate.id)}" data-binding="expand-accordion-item">


                        <span tabindex="0"
                              class="consent-management-list__title"
                              role="tab"
                              aria-selected="false"
                              aria-expanded="false"
                              data-binding="expand-accordion-trigger">

                            <div class="consent-management-list__label"> <c:out value="${consentTemplate.name}"/>  </div>

                        </span>

                        <div class="consent-management-list__content" role="tabpanel" aria-hidden="true" data-binding="expand-accordion-container">
                            <div class="consent-management-list__content-inner">
                                <p> ${ycommerce:sanitizeHTML(consentTemplate.description)} </p>
                            </div>
                        </div>


                        <div class="consent-buttons-group">
                            <button class="consent-reject btn btn-small btn-default" data-index="${fn:escapeXml(loop.index)}">
                                <spring:theme code="text.consent.button.decline" />
                            </button>
                            <button class="consent-accept btn btn-small btn-primary" data-index="${fn:escapeXml(loop.index)}">
                                <spring:theme code="text.consent.button.accept" />
                            </button>
                        </div>


                </li>

        </c:forEach>

    </ul>
</div>