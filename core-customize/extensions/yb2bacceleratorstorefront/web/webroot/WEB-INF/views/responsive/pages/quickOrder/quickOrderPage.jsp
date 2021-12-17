<%@ page trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template"%>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags"%>
<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product" %>
<%@ taglib prefix="quickorder" tagdir="/WEB-INF/tags/responsive/quickorder" %>

<spring:htmlEscape defaultHtmlEscape="true" />
<spring:theme code="product.grid.confirmQtys.message" var="gridConfirmMessage"/>

<template:page pageTitle="${pageTitle}">
	<div id="quickOrder" class="account-section" data-grid-confirm-message="${gridConfirmMessage}">
        <div class="account-section-content">
            <div class="quick-order-section-header account-section-header">
                <spring:theme code="text.quickOrder.header" />
            </div>

            <div class="row">
                <div class="col-xs-12 col-md-7 col-lg-6">
                    <div class="quick-order__introduction">
                        <cms:pageSlot position="TopContent" var="feature">
                            <cms:component component="${feature}" element="div" class="yComponentWrapper"/>
                        </cms:pageSlot>
                    </div>
                </div>

                <product:addToCartTitle/>
                <div class="col-xs-12 col-md-5 col-lg-6 pull-rightt">
                    <div class="row quick-order__actions">
                        <div class="pull-right col-sm-3 col-md-6 col-lg-5 quick-order__add-to-cart-btn">
                            <product:productFormAddToCartButton addToCartBtnId="js-add-to-cart-quick-order-btn-top" />
                        </div>
                        <div class="pull-right col-sm-4 col-md-6 col-lg-5 text-right">
                            <quickorder:quickorderResetButton resetBtnId="js-reset-quick-order-form-btn-top" resetBtnClass="quick-order__reset-link"/>
                        </div>
                    </div>
                </div>
            </div>
			
			<quickorder:quickorderListRows/>

            <div class="row">
                <div class="col-xs-12 col-md-5 col-lg-6 pull-right">
                    <div class="row quick-order__actions">
                        <div class="pull-right col-sm-3 col-md-6 col-lg-5 quick-order__add-to-cart-btn">
                            <product:productFormAddToCartButton addToCartBtnId="js-add-to-cart-quick-order-btn-bottom" />
                        </div>
                        <div class="pull-right col-sm-4 col-md-6 col-lg-5 text-right">
                            <quickorder:quickorderResetButton resetBtnId="js-reset-quick-order-form-btn-bottom" resetBtnClass="quick-order__reset-link"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template:page>