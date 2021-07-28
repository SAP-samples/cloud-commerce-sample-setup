<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="selectedAddressUrl" required="true" type="java.lang.String"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<spring:url value="${selectedAddressUrl}" var="selectSuggestedAddressUrl" htmlEscape="false" />
				  
<div style="display:none" id="popup_suggested_delivery_addresses_form">
    <div class="pad_left" id="popup_suggested_delivery_addresses">
        <div class="span-13 suggested_address_container">
            <h4 class="suggested_address_title"><spring:theme code="checkout.multi.deliveryAddress.selectSuggestedAddress" htmlEscape="false"/></h4>
            <c:forEach var="suggestedAddress" items="${suggestedAddresses}">
                <div class="span-8 suggested_address">
                    <ul>
                        <li>${fn:escapeXml(suggestedAddress.line1)}</li>
                        <li>${fn:escapeXml(suggestedAddress.line2)}</li>
                        <c:if test="${not empty suggestedAddress.region.name}">
                        <li>
                                ${fn:escapeXml(suggestedAddress.town)}, ${fn:escapeXml(suggestedAddress.postalCode)}
                        </li>
                        <li>
                                ${fn:escapeXml(suggestedAddress.country.name)}, ${fn:escapeXml(suggestedAddress.region.name)}
                            </li>
                            </c:if>
                            <c:if test="${empty suggestedAddress.region.name}">
                        <li>
                                ${fn:escapeXml(suggestedAddress.town)}, ${fn:escapeXml(suggestedAddress.postalCode)}
                        </li>
                        <li>
                                ${fn:escapeXml(suggestedAddress.country.name)}
                        </li>
                        </c:if>
                    </ul>
                </div>
                <div class="span-5 suggested_address_submit last">
                    <form:form method="post" modelAttribute="addressForm" action="${selectSuggestedAddressUrl}">
                        <form:hidden path="addressId" class="add_edit_delivery_address_id"/>
                        <form:hidden path="defaultAddress" value="${fn:escapeXml(inputAddress.defaultAddress)}"/>
                        <input id="titleCode" name="titleCode" type="hidden" value="${fn:escapeXml(suggestedAddress.titleCode)}"/>
                        <input id="firstName" name="firstName" type="hidden" value="${fn:escapeXml(suggestedAddress.firstName)}"/>
                        <input id="lastName" name="lastName" type="hidden" value="${fn:escapeXml(suggestedAddress.lastName)}"/>
                        <input id="line1" name="line1" type="hidden" value="${fn:escapeXml(suggestedAddress.line1)}"/>
                        <input id="line2" name="line2" type="hidden" value="${fn:escapeXml(suggestedAddress.line2)}"/>
                        <input id="townCity" name="townCity" type="hidden" value="${fn:escapeXml(suggestedAddress.town)}"/>
                        <input id="regionIso" name="regionIso" type="hidden" value="${fn:escapeXml(suggestedAddress.region.isocode)}"/>
                        <input id="postcode" name="postcode" type="hidden" value="${fn:escapeXml(suggestedAddress.postalCode)}"/>
                        <input id="countryIso" name="countryIso" type="hidden" value="${fn:escapeXml(suggestedAddress.country.isocode)}"/>
                        <input id="phone" name="phone" type="hidden" value="${fn:escapeXml(suggestedAddress.phone)}"/>
                        <input id="saveInAddressBook" name="saveInAddressBook" type="hidden" value="${fn:escapeXml(saveInAddressBook)}"/>
                        <button class="positive use_address" id="use_suggested_address_button">
                            <spring:theme code="checkout.summary.deliveryAddress.useThisAddress"/>
                        </button>
                        <c:choose>
                            <c:when test="${edit}">
                                <input id="editAddress" name="editAddress" type="hidden" value="true"/>
                            </c:when>
                            <c:otherwise>
                                <input id="editAddress" name="editAddress" type="hidden" value="false"/>
                            </c:otherwise>
                        </c:choose>
                    </form:form>
                </div>
            </c:forEach>
        </div>

        <div class="span-13 suggested_address_container users_address_container">
            <h4 class="suggested_address_title"><spring:theme code="checkout.multi.deliveryAddress.addressSuggestions.addressNotFound"/></h4>
            <div class="span-8 suggested_address">
                <ul>
                    <li>${fn:escapeXml(inputAddress.line1)}</li>
                    <li>${fn:escapeXml(inputAddress.line2)}</li>
                    <c:if test="${not empty inputAddress.region.name}">
                        <li>
                                ${fn:escapeXml(inputAddress.town)}, ${fn:escapeXml(inputAddress.postalCode)}
                        </li>
                        <li>
                                ${fn:escapeXml(inputAddress.country.name)}, ${fn:escapeXml(inputAddress.region.name)}
                        </li>
                    </c:if>
                    <c:if test="${empty inputAddress.region.name}">
                        <li>
                                ${fn:escapeXml(inputAddress.town)}, ${fn:escapeXml(inputAddress.postalCode)}
                        </li>
                        <li>
                                ${fn:escapeXml(inputAddress.country.name)}
                        </li>
                    </c:if>
                </ul>
            </div>
            <div class="span-5 suggested_address_submit last">
                <c:if test="${customerBypass}">
                    <form:form method="post" modelAttribute="addressForm" action="${selectSuggestedAddressUrl}">
                        <form:hidden path="addressId" class="add_edit_delivery_address_id"/>
                        <form:hidden path="defaultAddress" value="${fn:escapeXml(inputAddress.defaultAddress)}"/>
                        <input id="titleCode" name="titleCode" type="hidden" value="${fn:escapeXml(inputAddress.titleCode)}"/>
                        <input id="firstName" name="firstName" type="hidden" value="${fn:escapeXml(inputAddress.firstName)}"/>
                        <input id="lastName" name="lastName" type="hidden" value="${fn:escapeXml(inputAddress.lastName)}"/>
                        <input id="line1" name="line1" type="hidden" value="${fn:escapeXml(inputAddress.line1)}"/>
                        <input id="line2" name="line2" type="hidden" value="${fn:escapeXml(inputAddress.line2)}"/>
                        <input id="townCity" name="townCity" type="hidden" value="${fn:escapeXml(inputAddress.town)}"/>
                        <input id="regionIso" name="regionIso" type="hidden" value="${fn:escapeXml(inputAddress.region.isocode)}"/>
                        <input id="postcode" name="postcode" type="hidden" value="${fn:escapeXml(inputAddress.postalCode)}"/>
                        <input id="countryIso" name="countryIso" type="hidden" value="${fn:escapeXml(inputAddress.country.isocode)}"/>
                        <input id="phone" name="phone" type="hidden" value="${fn:escapeXml(inputAddress.phone)}"/>
                        <input id="saveInAddressBook" name="saveInAddressBook" type="hidden" value="${fn:escapeXml(saveInAddressBook)}"/>
                        <button class="form use_address" id="use_suggested_address_button" type="submit">
                            <spring:theme code="checkout.multi.deliveryAddress.selectSuggestedAddress.sumbitAsIs"/>
                        </button>
                        <c:choose>
                            <c:when test="${edit}">
                                <input id="editAddress" name="editAddress" type="hidden" value="true"/>
                            </c:when>
                            <c:otherwise>
                                <input id="editAddress" name="editAddress" type="hidden" value="false"/>
                            </c:otherwise>
                        </c:choose>
                    </form:form>
                </c:if>
            </div>
        </div>

    </div>
</div>