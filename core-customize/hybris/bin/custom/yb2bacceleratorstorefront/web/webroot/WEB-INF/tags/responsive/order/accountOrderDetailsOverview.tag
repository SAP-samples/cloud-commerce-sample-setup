<%@ tag body-content="empty" trimDirectiveWhitespaces="true" %>
<%@ attribute name="order" required="true" type="de.hybris.platform.commercefacades.order.data.OrderData" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="format" tagdir="/WEB-INF/tags/shared/format" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:htmlEscape defaultHtmlEscape="true" />

<div class="order-detail-overview">
    <div class="row">
        <div class="col-sm-3">
            <div class="item-group">
                <ycommerce:testId code="orderDetail_overviewOrderID_label">
                    <span class="item-label"><spring:theme code="text.account.orderHistory.orderNumber"/></span>
                    <span class="item-value">${fn:escapeXml(orderData.code)}</span>
                </ycommerce:testId>
            </div>
        </div>
        <c:if test="${not empty orderData.statusDisplay}">
            <div class="col-sm-3">
                <div class="item-group">
                    <ycommerce:testId code="orderDetail_overviewOrderStatus_label">
                        <span class="item-label"><spring:theme code="text.account.orderHistory.orderStatus"/></span>
                        <span class="item-value"><spring:theme code="text.account.order.status.display.${orderData.statusDisplay}"/></span>
                    </ycommerce:testId>
                </div>
            </div>
        </c:if>
        <div class="col-sm-3">
            <div class="item-group">
                <ycommerce:testId code="orderDetail_overviewStatusDate_label">
                    <span class="item-label"><spring:theme code="text.account.orderHistory.datePlaced"/></span>
                    <span class="item-value"><fmt:formatDate value="${order.created}" dateStyle="medium" timeStyle="short" type="both"/></span>
                </ycommerce:testId>
            </div>
        </div>
        <div class="col-sm-3">
            <div class="item-group">
                <ycommerce:testId code="orderDetail_overviewOrderTotal_label">
                    <span class="item-label"><spring:theme code="text.account.order.total"/></span>
                    <span class="item-value"><format:price priceData="${order.totalPriceWithTax}"/></span>
                </ycommerce:testId>
            </div>
        </div>
        <c:if test="${orderData.quoteCode ne null}">
			  <div class="col-sm-3">
			  	  <div class="item-group">
					  <spring:url htmlEscape="false" value="/my-account/my-quotes/{/quoteCode}" var="quoteDetailUrl">
					  <spring:param name="quoteCode"  value="${orderData.quoteCode}"/>
					  </spring:url>
		              <ycommerce:testId code="orderDetail_overviewQuoteId_label">
							  <span class="item-label"><spring:theme code="text.account.quote.code"/></span>
							  <span class="item-value">
								  <a href="${fn:escapeXml(quoteDetailUrl)}" >
								  	  ${fn:escapeXml(orderData.quoteCode)}
								  </a>
							  </span>
		              </ycommerce:testId>
					</div>
				</div>
			</c:if>
    </div>
</div>