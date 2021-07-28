<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template" %>
<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="common" tagdir="/WEB-INF/tags/responsive/common" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:url value="${product.url}" var="productUrl"/>

<template:page pageTitle="${pageTitle}">

    <jsp:body>
        <%--Feed the addtocart popup color box--%>
        <product:addToCartTitle/>

        <c:if test="${not empty message}">
            <spring:theme code="${message}"/>
        </c:if>

        <div class="back-link border product-details">
            <a href="${fn:escapeXml(productUrl)}">
                <span class="glyphicon glyphicon-chevron-left"></span>
                <span class="label"><spring:theme code="order.form"/></span>
            </a>
        </div>

        <div id="globalMessages">
            <common:globalMessages/>
        </div>

        <div class="product-details page-title">
            <ycommerce:testId code="productDetails_productNamePrice_label_${product.code}">
                <div class="name product-details-toggle">${fn:escapeXml(product.name)}<span class="sku">ID</span><span
                        class="code">${fn:escapeXml(product.code)}</span><span class="glyphicon glyphicon-chevron-right"></span></div>
            </ycommerce:testId>
        </div>

        <div class="product-details-toggle-wrap">
            <div class="row">
                <div class="col-sm-8">
                    <product:productPrimaryImage product="${product}" format="product"/>
                    <product:productPromotionSection product="${product}"/>
                </div>
                <div class="col-sm-4">
                    <div class="product-details">
                        <ycommerce:testId code="productDetails_productNamePrice_label_${fn:escapeXml(product.code)}">
                            <product:productPricePanel product="${product}" isOrderForm="${true}"/>
                        </ycommerce:testId>
                    </div>
                </div>
            </div>
        </div>

        <div class="product-action">
            <div class="hidden-xs">
                <spring:theme code="product.grid.items.selected"/>&nbsp;
                <span class="js-total-items-count">0</span>
            </div>
            <div class="hidden-sm hidden-md hidden-lg">
                <spring:theme code="product.grid.formDescription"/>
            </div>
            <ol>
                <product:productFormAddToCartPanel product="${product}"/>
            </ol>
        </div>

        <div class="add-to-cart-order-form-wrap">
            <c:url value="/cart/addGrid" var="addToCartGridUrl"/>
            <spring:theme code="product.grid.confirmQtys.message" var="gridConfirmMessage" htmlEscape="false"/>

            <form:form name="AddToCartOrderForm" id="AddToCartOrderForm" class="add_to_cart_order_form scrollContent visible"
                       action="${addToCartGridUrl}" method="post"
                       data-grid-confirm-message="${gridConfirmMessage}">
                <product:productOrderFormGrid product="${product}"/>
            </form:form>

            <div class="order-form-scroll right hidden-xs"><span class="glyphicon glyphicon-chevron-right"></span></div>
            <div class="order-form-scroll left hidden-xs"><span class="glyphicon glyphicon-chevron-left"></span></div>
            <div class="order-form-scroll up hidden-xs"><span class="glyphicon glyphicon-chevron-up"></span></div>
            <div class="order-form-scroll down hidden-xs"><span class="glyphicon glyphicon-chevron-down"></span></div>
        </div>

        <product:productOrderFormJQueryTemplates/>

    </jsp:body>

</template:page>
