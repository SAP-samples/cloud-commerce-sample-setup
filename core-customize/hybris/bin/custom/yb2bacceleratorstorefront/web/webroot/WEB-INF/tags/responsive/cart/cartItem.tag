<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="cartData" required="true" type="de.hybris.platform.commercefacades.order.data.CartData" %>
<%@ attribute name="entry" required="true" type="de.hybris.platform.commercefacades.order.data.OrderEntryData" %>
<%@ attribute name="index" required="false" type="java.lang.Integer"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product" %>
<%@ taglib prefix="grid" tagdir="/WEB-INF/tags/responsive/grid" %>
<%@ taglib prefix="format" tagdir="/WEB-INF/tags/shared/format" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="order" tagdir="/WEB-INF/tags/responsive/order" %>


<%--
    Represents single cart item on cart page
 --%>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:set var="errorStatus" value="<%= de.hybris.platform.catalog.enums.ProductInfoStatus.valueOf(\"ERROR\") %>" />
<c:set var="entryNumberHtml" value="${fn:escapeXml(entry.entryNumber)}"/>
<c:set var="productCodeHtml" value="${fn:escapeXml(entry.product.code)}"/>
<c:set var="quantityHtml" value="${fn:escapeXml(entry.quantity)}"/>

<c:if test="${empty index}">
    <c:set property="index" value="${entryNumber}"/>
</c:if>

<c:if test="${not empty entry}">

        <c:if test="${not empty entry.statusSummaryMap}" >
            <c:set var="errorCount" value="${entry.statusSummaryMap.get(errorStatus)}"/>
            <c:if test="${not empty errorCount && errorCount > 0}" >
                <div class="notification has-error">
                    <spring:url value="/cart/{/entryNumber}/configuration/{/configuratorType}" var="entryConfigUrl" htmlEscape="false">
                        <spring:param name="entryNumber"  value="${entry.entryNumber}"/>
                        <spring:param name="configuratorType"  value="${entry.configurationInfos[0].configuratorType}" />
                    </spring:url>
                    
                    <spring:theme code="basket.error.invalid.configuration" arguments="${errorCount}"/>
                    <a href="${fn:escapeXml(entryConfigUrl)}">
                        <spring:theme code="basket.error.invalid.configuration.edit"/>
                    </a>
                </div>
            </c:if>
        </c:if>
        <c:set var="showEditableGridClass" value=""/>
        <c:url value="${entry.product.url}" var="productUrl"/>

        <li class="item__list--item">
            <%-- chevron for multi-d products --%>
            <div class="hidden-xs hidden-sm item__toggle">
                <c:if test="${entry.product.multidimensional}" >
                    <div class="js-show-editable-grid" data-index="${fn:escapeXml(index)}" data-read-only-multid-grid="${not entry.updateable}">
                        <ycommerce:testId code="cart_product_updateQuantity">
                            <span class="glyphicon glyphicon-chevron-down"></span>
                        </ycommerce:testId>
                    </div>
                </c:if>
            </div>

            <%-- product image --%>
            <div class="item__image">
                <a href="${fn:escapeXml(productUrl)}"><product:productPrimaryImage product="${entry.product}" format="thumbnail"/></a>
            </div>

            <%-- product name, code, promotions --%>
            <div class="item__info">
                <ycommerce:testId code="cart_product_name">
                    <a href="${fn:escapeXml(productUrl)}"><span class="item__name">${fn:escapeXml(entry.product.name)}</span></a>
                </ycommerce:testId>

                <div class="item__code">${productCodeHtml}</div>

                <%-- availability --%>
                <div class="item__stock">
                    <c:set var="entryStock" value="${entry.product.stock.stockLevelStatus.code}"/>
                    <c:forEach items="${entry.product.baseOptions}" var="option">
                        <c:if test="${not empty option.selected and option.selected.url eq entry.product.url}">
                            <c:forEach items="${option.selected.variantOptionQualifiers}" var="selectedOption">
                                <div>
                                    <strong>${fn:escapeXml(selectedOption.name)}:</strong>
                                    <span>${fn:escapeXml(selectedOption.value)}</span>
                                </div>
                                <c:set var="entryStock" value="${option.selected.stock.stockLevelStatus.code}"/>
                            </c:forEach>
                        </c:if>
                    </c:forEach>

                    <div>
                        <c:choose>
                            <c:when test="${not empty entryStock and entryStock ne 'outOfStock' or entry.product.multidimensional}">
                                <span class="stock"><spring:theme code="product.variants.in.stock"/></span>
                            </c:when>
                            <c:otherwise>
                                <span class="out-of-stock"><spring:theme code="product.variants.out.of.stock"/></span>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>

                <c:if test="${ycommerce:doesPotentialPromotionExistForOrderEntryOrOrderEntryGroup(cartData, entry)}">
                    <c:forEach items="${cartData.potentialProductPromotions}" var="promotion">
                        <c:set var="displayed" value="false"/>
                        <c:forEach items="${promotion.consumedEntries}" var="consumedEntry">
                            <c:if test="${not displayed && ycommerce:isConsumedByEntry(consumedEntry,entry) && not empty promotion.description}">
                                <c:set var="displayed" value="true"/>

                                    <div class="promo">
                                         <ycommerce:testId code="cart_potentialPromotion_label">
                                             ${ycommerce:sanitizeHTML(promotion.description)}
                                         </ycommerce:testId>
                                    </div>
                            </c:if>
                        </c:forEach>
                    </c:forEach>
                </c:if>
                <c:if test="${ycommerce:doesAppliedPromotionExistForOrderEntryOrOrderEntryGroup(cartData, entry)}">
                    <c:forEach items="${cartData.appliedProductPromotions}" var="promotion">
                        <c:set var="displayed" value="false"/>
                        <c:forEach items="${promotion.consumedEntries}" var="consumedEntry">
                            <c:if test="${not displayed && ycommerce:isConsumedByEntry(consumedEntry,entry) }">
                                <c:set var="displayed" value="true"/>
                                <div class="promo">
                                    <ycommerce:testId code="cart_appliedPromotion_label">
                                        ${ycommerce:sanitizeHTML(promotion.description)}
                                    </ycommerce:testId>
                                </div>
                            </c:if>
                        </c:forEach>
                    </c:forEach>
                </c:if>

                <c:if test="${entry.product.configurable}">
                    <div class="hidden-xs hidden-sm">
                        <spring:url value="/cart/{/entryNumber}/configuration/{/configuratorType}" var="entryConfigUrl" htmlEscape="false">
                            <spring:param name="entryNumber"  value="${entry.entryNumber}"/>
                            <spring:param name="configuratorType"  value="${entry.configurationInfos[0].configuratorType}" />
                        </spring:url>
                        <div class="item__configurations">
                            <c:forEach var="config" items="${entry.configurationInfos}">
                                <c:set var="style" value=""/>
                                <c:if test="${config.status eq errorStatus}">
                                    <c:set var="style" value="color:red"/>
                                </c:if>
                                <div class="item__configuration--entry" style="${style}">
                                    <div class="row">
                                        <div class="item__configuration--name col-sm-4">
                                                ${fn:escapeXml(config.configurationLabel)}
                                                <c:if test="${not empty config.configurationLabel}">:</c:if>

                                        </div>
                                        <div class="item__configuration--value col-sm-8">
                                                ${fn:escapeXml(config.configurationValue)}
                                        </div>
                                    </div>
                                </div>
                            </c:forEach>
                        </div>
                        <c:if test="${not empty entry.configurationInfos}">
                            <div class="item__configurations--edit">
                                <a class="btn" href="${fn:escapeXml(entryConfigUrl)}"><spring:theme code="basket.page.change.configuration"/></a>
                            </div>
                        </c:if>
                    </div>
                </c:if>
            </div>

            <%-- price --%>
            <div class="item__price">
                <span class="visible-xs visible-sm"><spring:theme code="basket.page.itemPrice"/>: </span>
                <format:price priceData="${entry.basePrice}" displayFreeForZero="true"/>
            </div>

            <%-- quantity --%>
            <div class="item__quantity hidden-xs hidden-sm">
                <c:choose>
                    <c:when test="${not entry.product.multidimensional}" >
                        <c:url value="/cart/update" var="cartUpdateFormAction" />
                        <c:set var="cartDataJson" value='{"cartCode" : "${ycommerce:encodeJSON(cartData.code)}","productPostPrice":"${ycommerce:encodeJSON(entry.basePrice.value)}","productName":"${ycommerce:encodeJSON(entry.product.name)}"}'></c:set>
                        <form:form id="updateCartForm${entry.entryNumber}" action="${cartUpdateFormAction}" method="post" modelAttribute="updateQuantityForm${entry.entryNumber}"
                                   class="js-qty-form${entry.entryNumber}"
                                    data-cart="${fn:escapeXml(cartDataJson)}">
                            <input type="hidden" name="entryNumber" value="${entryNumberHtml}"/>
                            <input type="hidden" name="productCode" value="${productCodeHtml}"/>
                            <input type="hidden" name="initialQuantity" value="${quantityHtml}"/>
                            <ycommerce:testId code="cart_product_quantity">
                                <form:label cssClass="visible-xs visible-sm" path="quantity" for="quantity${entry.entryNumber}"></form:label>
                                <form:input cssClass="form-control js-update-entry-quantity-input" disabled="${not entry.updateable}" type="text" size="1" maxlength="10" id="quantity_${entry.entryNumber}" path="quantity" />
                            </ycommerce:testId>
                        </form:form>
                    </c:when>
                    <c:otherwise>
                        <c:url value="/cart/updateMultiD" var="cartUpdateMultiDFormAction" />
                        <form:form id="updateCartForm${entry.entryNumber}" action="${cartUpdateMultiDFormAction}" method="post" class="js-qty-form${entry.entryNumber}" modelAttribute="updateQuantityForm${entry.entryNumber}">
                            <input type="hidden" name="entryNumber" value="${entryNumberHtml}"/>
                            <input type="hidden" name="productCode" value="${productCodeHtml}"/>
                            <input type="hidden" name="initialQuantity" value="${quantityHtml}"/>
                            <label class="visible-xs visible-sm"><spring:theme code="basket.page.qty"/>:</label>
                            <span class="qtyValue">${quantityHtml}</span>
                            <input type="hidden" name="quantity" value="0"/>
                            <ycommerce:testId code="cart_product_updateQuantity">
                                <div id="QuantityProduct${entryNumberHtml}" class="updateQuantityProduct"></div>
                            </ycommerce:testId>
                        </form:form>
                    </c:otherwise>
                </c:choose>
            </div>

            <%-- delivery --%>
            <div class="item__delivery">
                <c:if test="${entry.product.purchasable}">
                    <c:if test="${not empty entryStock and entryStock ne 'outOfStock'}">
                        <c:if test="${entry.deliveryPointOfService eq null or not entry.product.availableForPickup}">
                            <span class="item__delivery--label"><spring:theme code="basket.page.shipping.ship"/></span>
                        </c:if>
                    </c:if>
                    <c:if test="${not empty entry.deliveryPointOfService.name}">
                        <span class="item__delivery--label"><spring:theme code="basket.page.shipping.pickup"/></span>
                    </c:if>

                    <c:if test="${entry.product.availableForPickup and not empty entry.deliveryPointOfService.name}">
                        <div class="item__delivery--store">${fn:escapeXml(entry.deliveryPointOfService.name)}</div>
                    </c:if>
                </c:if>
            </div>

            <%-- total --%>
            <ycommerce:testId code="cart_totalProductPrice_label">
                <div class="item__total js-item-total hidden-xs hidden-sm">
                    <format:price priceData="${entry.totalPrice}" displayFreeForZero="true"/>
                </div>
            </ycommerce:testId>

            <%-- menu icon --%>
            <div class="item__menu">
                <c:if test="${entry.updateable}" >
                    <div class="btn-group js-cartItemDetailGroup">
                        <button type="button" class="btn btn-default js-cartItemDetailBtn" aria-haspopup="true" aria-expanded="false" id="editEntry_${entryNumberHtml}">
                            <span class="glyphicon glyphicon-option-vertical"></span>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-right">
                            <c:if test="${not empty cartData.quoteData}">
                                <c:choose>
                                    <c:when test="${not entry.product.multidimensional}">
                                        <li>
                                            <a href="#entryCommentDiv_${fn:escapeXml(ycommerce:encodeUrl(entry.entryNumber))}" data-toggle="collapse" class="js-entry-comment-button">
                                                <spring:theme code="basket.page.comment.menu"/>
                                            </a>
                                        </li>
                                    </c:when>
                                    <c:otherwise>
                                        <li>
                                            <a href="#entryCommentDiv_${fn:escapeXml(ycommerce:encodeUrl(entry.entries.get(0).entryNumber))}" data-toggle="collapse" class="js-entry-comment-button">
                                                <spring:theme code="basket.page.comment.menu"/>
                                            </a>
                                        </li>
                                    </c:otherwise>
                                </c:choose>
                            </c:if>
                            <form:form id="cartEntryActionForm" action="" method="post" />
                             <%-- Build entry numbers string for execute action -- Start --%>
                            <c:choose>
					            <c:when test="${entryNumberHtml eq -1}"> <%-- for multid entry --%>
					                <c:forEach items="${entry.entries}" var="subEntry" varStatus="stat">
						    			<c:set var="actionFormEntryNumbers" value="${stat.first ? '' : actionFormEntryNumbers.concat(';')}${subEntry.entryNumber}" />
						    		</c:forEach>
					            </c:when>
					            <c:otherwise>
					                <c:set var="actionFormEntryNumbers" value="${entryNumberHtml}" />
					            </c:otherwise>
					        </c:choose>
					        <%-- Build entry numbers string for execute action -- End --%>
                            <c:forEach var="entryAction" items="${entry.supportedActions}">
                                <c:url value="/cart/entry/execute/${ycommerce:encodeUrl(entryAction)}" var="entryActionUrl"/>
                                <li class="js-execute-entry-action-button" id="actionEntry_${entryNumberHtml}"
                                    data-entry-action-url="${fn:escapeXml(entryActionUrl)}"
                                    data-entry-action="${fn:escapeXml(entryAction)}"
                                    data-entry-product-code="${productCodeHtml}"
                                    data-entry-initial-quantity="${quantityHtml}"
                                    data-action-entry-numbers="${fn:escapeXml(actionFormEntryNumbers)}">
                                    <a href="#"><spring:theme code="basket.page.entry.action.${entryAction}"/></a>
                                </li>
                            </c:forEach>
                        </ul>
                    </div>
                </c:if>
            </div>

            <div class="item__quantity__total visible-xs visible-sm">
                <c:if test="${entry.product.multidimensional}" >
                    <ycommerce:testId code="cart_product_updateQuantity">
                        <c:set var="showEditableGridClass" value="js-show-editable-grid"/>
                    </ycommerce:testId>
                </c:if>
                <div class="details ${fn:escapeXml(showEditableGridClass)}" data-index="${fn:escapeXml(index)}" data-read-only-multid-grid="${not entry.updateable}">
                    <div class="qty">
                        <c:choose>
                            <c:when test="${not entry.product.multidimensional}" >
                                <c:url value="/cart/update" var="cartUpdateFormAction" />
                                <c:set var="cartDataJson" value='{"cartCode" : "${ycommerce:encodeJSON(cartData.code)}","productPostPrice":"${ycommerce:encodeJSON(entry.basePrice.value)}","productName":"${ycommerce:encodeJSON(entry.product.name)}"}'/>
                                <form:form id="updateCartForm${entry.entryNumber}" action="${cartUpdateFormAction}" method="post" modelAttribute="updateQuantityForm${entry.entryNumber}"
                                           class="js-qty-form${entry.entryNumber}"
                                           data-cart="${fn:escapeXml(cartDataJson)}">
                                    <input type="hidden" name="entryNumber" value="${entryNumberHtml}"/>
                                    <input type="hidden" name="productCode" value="${productCodeHtml}"/>
                                    <input type="hidden" name="initialQuantity" value="${quantityHtml}"/>
                                    <ycommerce:testId code="cart_product_quantity">
                                        <form:label cssClass="" path="quantity" for="quantity${entry.entryNumber}"><spring:theme code="basket.page.qty"/>:</form:label>
                                        <form:input cssClass="form-control js-update-entry-quantity-input" disabled="${not entry.updateable}" type="text" size="1" id="quantity_${entry.entryNumber}" path="quantity" />
                                    </ycommerce:testId>
                                </form:form>
                            </c:when>
                            <c:otherwise>
                                <c:url value="/cart/updateMultiD" var="cartUpdateMultiDFormAction" />
                                <form:form id="updateCartForm${entry.entryNumber}" action="${cartUpdateMultiDFormAction}" method="post" class="js-qty-form${entry.entryNumber}" modelAttribute="updateQuantityForm${entry.entryNumber}">
                                    <input type="hidden" name="entryNumber" value="${entryNumberHtml}"/>
                                    <input type="hidden" name="productCode" value="${productCodeHtml}"/>
                                    <input type="hidden" name="initialQuantity" value="${quantityHtml}"/>
                                    <label><spring:theme code="basket.page.qty"/>:</label>
                                    <span class="qtyValue">${quantityHtml}</span>
                                    <input type="hidden" name="quantity" value="0"/>
                                    <ycommerce:testId code="cart_product_updateQuantity">
                                        <div id="QuantityProduct${entryNumberHtml}" class="updateQuantityProduct"></div>
                                    </ycommerce:testId>
                                </form:form>
                            </c:otherwise>
                        </c:choose>
                        <c:if test="${entry.product.multidimensional}" >
                            <ycommerce:testId code="cart_product_updateQuantity">
                                <span class="glyphicon glyphicon-chevron-right"></span>
                            </ycommerce:testId>
                        </c:if>
                        <ycommerce:testId code="cart_totalProductPrice_label">
                            <div class="item__total js-item-total">
                                <format:price priceData="${entry.totalPrice}" displayFreeForZero="true"/>
                            </div>
                        </ycommerce:testId>
                    </div>
                </div>

                <c:if test="${entry.product.configurable}">
                    <div class="hidden-md hidden-lg">
                        <spring:url value="/cart/{/entryNumber}/configuration/{/configuratorType}" var="entryConfigUrl" htmlEscape="false">
                            <spring:param name="entryNumber"  value="${entry.entryNumber}"/>
                            <spring:param name="configuratorType"  value="${entry.configurationInfos[0].configuratorType}" />
                        </spring:url>
                        <div class="item__configurations">
                            <c:forEach var="config" items="${entry.configurationInfos}">
                                <c:set var="style" value=""/>
                                <c:if test="${config.status eq errorStatus}">
                                    <c:set var="style" value="color:red"/>
                                </c:if>
                                <div class="item__configuration--entry" style="${style}">
                                    <div class="row">
                                        <div class="item__configuration--name col-sm-4">
                                                ${fn:escapeXml(config.configurationLabel)}
                                                <c:if test="${not empty config.configurationLabel}">:</c:if>
                                        </div>
                                        <div class="item__configuration--value col-sm-8">
                                                ${fn:escapeXml(config.configurationValue)}
                                        </div>
                                    </div>
                                </div>
                            </c:forEach>
                        </div>
                        <c:if test="${not empty entry.configurationInfos}">
                            <div class="item__configurations--edit">
                                <a class="btn" href="${fn:escapeXml(entryConfigUrl)}"><spring:theme code="basket.page.change.configuration"/></a>
                            </div>
                        </c:if>
                    </div>
                </c:if>
            </div>
        </li>

        <li class="item__list--comment">
            <div class="item__comment quote__comments">
                <c:if test="${not empty cartData.quoteData}">
                    <c:choose>
                        <c:when test="${not entry.product.multidimensional}">
                            <c:set var="entryNumber" value="${entry.entryNumber}"/>
                            <c:set var="entryComments" value="${entry.comments}"/>
                        </c:when>
                        <c:otherwise>
                            <c:set var="entryNumber" value="${entry.entries.get(0).entryNumber}"/>
                            <c:set var="entryComments" value="${entry.entries.get(0).comments}"/>
                        </c:otherwise>
                    </c:choose>
                    <c:choose>
                        <c:when test="${not empty entryComments}">
                            <order:orderEntryComments entryComments="${entryComments}" entryNumber="${entryNumber}"/>
                        </c:when>
                        <c:otherwise>
                            <div id="entryCommentListDiv_${fn:escapeXml(entryNumber)}" data-show-all-entry-comments="false"></div>
                        </c:otherwise>
                    </c:choose>
                    <c:if test="${entry.updateable}">
                        <div class="row">
                            <div class="col-sm-7 col-sm-offset-5">
                                <div id="entryCommentDiv_${fn:escapeXml(entryNumber)}" class="${not empty entryComments ?'collapse in':'collapse'}">
                                    <textarea class="form-control js-quote-entry-comments" id="entryComment_${fn:escapeXml(entryNumber)}"
                                              placeholder="<spring:theme code="quote.enter.comment"/>"
                                              data-entry-number="${fn:escapeXml(entryNumber)}" rows="3" maxlength="255"></textarea>
                                </div>
                            </div>
                        </div>
                    </c:if>
                </c:if>
            </div>
        </li>

        <li>
            <spring:url value="/cart/getProductVariantMatrix" var="targetUrl"/>
            <grid:gridWrapper entry="${entry}" index="${index}" styleClass="add-to-cart-order-form-wrap display-none"
                targetUrl="${targetUrl}"/>
        </li>
 </c:if>
