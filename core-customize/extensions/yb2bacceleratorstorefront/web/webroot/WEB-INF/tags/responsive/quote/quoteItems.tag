<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="quoteData" required="true" type="de.hybris.platform.commercefacades.order.data.AbstractOrderData" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product" %>
<%@ taglib prefix="grid" tagdir="/WEB-INF/tags/responsive/grid" %>
<%@ taglib prefix="format" tagdir="/WEB-INF/tags/shared/format" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="order" tagdir="/WEB-INF/tags/responsive/order" %>
<%@ taglib prefix="common" tagdir="/WEB-INF/tags/responsive/common" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<ul class="item__list item__list__cart">
    <li class="hidden-xs hidden-sm">
        <ul class="item__list--header">
            <li class="item__toggle"></li>
            <li class="item__image"></li>
            <li class="item__info"><spring:theme code="basket.page.item"/></li>
            <li class="item__price"><spring:theme code="basket.page.price"/></li>
            <li class="item__quantity"><spring:theme code="basket.page.qty"/></li>
            <li class="item__delivery"><spring:theme code="basket.page.delivery"/></li>
            <li class="item__total--column"><spring:theme code="basket.page.total"/></li>
        </ul>
    </li>

    <c:forEach items="${quoteData.entries}" var="orderEntry" varStatus="loop">

        <c:url value="${orderEntry.product.url}" var="productUrl"/>

        <li class="item__list--item">

            <%-- chevron for multi-d products --%>
            <div class="hidden-xs hidden-sm item__toggle">
                <c:if test="${orderEntry.product.multidimensional}" >
                    <div class="js-show-multiD-grid-in-order" data-index="${fn:escapeXml(loop.index)}">
                        <span class="glyphicon glyphicon-chevron-down"></span>
                    </div>
                </c:if>
            </div>

            <%-- product image --%>
            <div class="item__image">
                <a href="${fn:escapeXml(productUrl)}">
                    <product:productPrimaryImage product="${orderEntry.product}" format="thumbnail"/>
                </a>
            </div>

            <%-- product name, code, promotions --%>
            <div class="item__info">
                <a href="${orderEntry.product.purchasable ? fn:escapeXml(productUrl) : ''}"><span class="item__name">${fn:escapeXml(orderEntry.product.name)}</span></a>

                <div class="item__code">
                    ${fn:escapeXml(orderEntry.product.code)}
                </div>

                <%-- availability --%>
                <div class="item__stock">
                    <c:set var="entryStock" value="${fn:escapeXml(orderEntry.product.stock.stockLevelStatus.code)}"/>
                    <c:choose>
                    	<c:when test="${orderEntry.product.multidimensional}">
                        	<span class="stock"><spring:theme code="product.variants.in.stock"/></span>
                    	</c:when>
                    	<c:when test="${not empty entryStock and entryStock ne 'outOfStock'}">
                        	<span class="stock"><spring:theme code="product.variants.in.stock"/></span>
                    	</c:when>
                    	<c:when test="${orderEntry.deliveryPointOfService eq null}">
                        	<span class="out-of-stock"><spring:theme code="product.variants.out.of.stock"/></span>
                    	</c:when>
                	</c:choose>
                </div>

                <c:if test="${not empty quoteData.appliedProductPromotions}">
                    <div class="promo">
                        <ul>
                            <c:forEach items="${quoteData.appliedProductPromotions}" var="promotion">
                                <c:set var="displayed" value="false"/>
                                <c:forEach items="${promotion.consumedEntries}" var="consumedEntry">
                                    <c:if test="${not displayed && consumedEntry.orderEntryNumber == orderEntry.entryNumber}">
                                        <c:set var="displayed" value="true"/>
                                        <li>
                                            ${ycommerce:sanitizeHTML(promotion.description)}
                                        </li>
                                    </c:if>
                                </c:forEach>
                            </c:forEach>
                        </ul>
                    </div>
                </c:if>
 
                <common:configurationInfos entry="${orderEntry}"/>
                <common:viewConfigurationInfos baseUrl="/my-account/my-quotes" orderEntry="${orderEntry}" itemCode="${quoteData.code}"/>           
            </div>

            <%-- price --%>
            <div class="item__price">
                <span class="visible-xs visible-sm"><spring:theme code="basket.page.itemPrice"/>:</span>
                <order:orderEntryPrice orderEntry="${orderEntry}"/>
            </div>

            <%-- quantity --%>
            <div class="item__quantity hidden-xs hidden-sm">
                <c:forEach items="${orderEntry.product.baseOptions}" var="option">
                    <c:if test="${not empty option.selected and option.selected.url eq orderEntry.product.url}">
                        <c:forEach items="${option.selected.variantOptionQualifiers}" var="selectedOption">
                            <div>
                                <ycommerce:testId code="orderDetail_variantOption_label">
                                    <span>${fn:escapeXml(selectedOption.name)}:</span>
                                    <span>${fn:escapeXml(selectedOption.value)}</span>
                                </ycommerce:testId>
                            </div>
                            <c:set var="entryStock" value="${fn:escapeXml(option.selected.stock.stockLevelStatus.code)}"/>
                        </c:forEach>
                    </c:if>
                </c:forEach>

                <ycommerce:testId code="orderDetails_productQuantity_label">
                    <label class="visible-xs visible-sm"><spring:theme code="basket.page.qty"/>:</label>
                    <span class="qtyValue">${fn:escapeXml(orderEntry.quantity)}</span>
                </ycommerce:testId>
            </div>

            <%-- delivery --%>
            <div class="item__delivery">
                <c:if test="${orderEntry.product.purchasable}">
                    <c:if test="${not empty entryStock and entryStock ne 'outOfStock'}">
                        <c:if test="${orderEntry.deliveryPointOfService eq null or not orderEntry.product.availableForPickup}">
                            <span class="item__delivery--label"><spring:theme code="basket.page.shipping.ship"/></span>
                        </c:if>
                    </c:if>
                    <c:if test="${not empty orderEntry.deliveryPointOfService.name}">
                        <span class="item__delivery--label"><spring:theme code="basket.page.shipping.pickup"/></span>
                    </c:if>

                    <c:if test="${orderEntry.product.availableForPickup and not empty orderEntry.deliveryPointOfService.name}">
                        <div class="item__delivery--store">${fn:escapeXml(orderEntry.deliveryPointOfService.name)}</div>
                    </c:if>
                </c:if>
            </div>

            <%-- total --%>
            <div class="item__total hidden-xs hidden-sm">
                <format:price priceData="${orderEntry.totalPrice}" displayFreeForZero="true"/>
            </div>

            <div class="item__quantity__total visible-xs visible-sm">
                <c:set var="showMultiDGridClass" value="" />
                <c:if test="${orderEntry.product.multidimensional}">
                    <c:set var="showMultiDGridClass" value="js-show-multiD-grid-in-order" />
                </c:if>

                <div class="details ${fn:escapeXml(showMultiDGridClass)}" data-index="${fn:escapeXml(loop.index)}">
                    <div class="qty">
                        <label><spring:theme code="basket.page.qty"/>:</label>
                        <span class="qtyValue">${fn:escapeXml(orderEntry.quantity)}</span>
                        <c:if test="${orderEntry.product.multidimensional}">
                            <span class="glyphicon glyphicon-chevron-right"></span>
                        </c:if>
                        <div class="item__total">
                            <format:price priceData="${orderEntry.totalPrice}" displayFreeForZero="true"/>
                        </div>
                    </div>
                </div>
            </div>
        </li>

        <li class="item__list--comment">
            <div class="item__comment quote__comments">
                <c:choose>
                    <c:when test="${not orderEntry.product.multidimensional}">
                        <order:orderEntryComments entryComments="${orderEntry.comments}" entryNumber="${orderEntry.entryNumber}"/>
                    </c:when>
                    <c:otherwise>
                        <order:orderEntryComments entryComments="${orderEntry.entries.get(0).comments}" entryNumber="${orderEntry.entries.get(0).entryNumber}"/>
                    </c:otherwise>
                </c:choose>
            </div>
        </li>

        <li>
            <spring:url value="/my-account/my-quotes/{/quoteCode}/getReadOnlyProductVariantMatrix" var="targetUrl" htmlEscape="false">
                <spring:param name="quoteCode"  value="${fn:escapeXml(quoteData.code)}"/>
            </spring:url>
            <grid:gridWrapper entry="${orderEntry}" index="${loop.index}" styleClass="add-to-cart-order-form-wrap display-none" targetUrl="${targetUrl}"/>
        </li>
    </c:forEach>
</ul>
