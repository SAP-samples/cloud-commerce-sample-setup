<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="product" tagdir="/WEB-INF/tags/responsive/product" %>

<div id="cartOrderGridForm" class="scrollContent visible">
    <product:productOrderFormGrid product="${product}" showName="false" readOnly="${readOnly}" />
    <div class="order-form-scroll right hidden-xs"><span class="glyphicon glyphicon-chevron-right"></span></div>
    <div class="order-form-scroll left hidden-xs"><span class="glyphicon glyphicon-chevron-left"></span></div>
    <div class="order-form-scroll up hidden-xs"><span class="glyphicon glyphicon-chevron-up"></span></div>
    <div class="order-form-scroll down hidden-xs"><span class="glyphicon glyphicon-chevron-down"></span></div>
</div>