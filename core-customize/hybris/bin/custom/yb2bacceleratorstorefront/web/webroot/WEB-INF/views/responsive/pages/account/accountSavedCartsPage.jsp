<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="nav" tagdir="/WEB-INF/tags/responsive/nav" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>
<%@ taglib prefix="cart" tagdir="/WEB-INF/tags/responsive/cart" %>

<spring:htmlEscape defaultHtmlEscape="true"/>

<spring:url value="/my-account/saved-carts/" var="savedCartsLink" htmlEscape="false"/>
<c:set var="searchUrl" value="/my-account/saved-carts?sort=${ycommerce:encodeUrl(searchPageData.pagination.sort)}"/>

<div class="account-section-header">
    <spring:theme code="text.account.savedCarts"/>
</div>

<c:if test="${empty searchPageData.results}">
    <div class="account-section-content content-empty">
        <ycommerce:testId code="savedCarts_noOrders_label">
            <spring:theme code="text.account.savedCarts.noSavedCarts"/>
        </ycommerce:testId>
    </div>
</c:if>

<c:if test="${not empty searchPageData.results}">
    <div class="account-section-content">
        <div class="account-orderhistory-pagination">
            <nav:pagination top="true" msgKey="text.account.savedCarts.page" showCurrentPageInfo="true"
                            hideRefineButton="true"
                            supportShowPaged="${isShowPageAllowed}" supportShowAll="${isShowAllAllowed}"
                            searchPageData="${searchPageData}" searchUrl="${searchUrl}"
                            numberPagesShown="${numberPagesShown}"/>
        </div>

        <div class="account-overview-table saved__carts__overview--table">
			<c:set var="cartIdRowMapping" value=''/>
            <table class="responsive-table">
                <thead>
                    <tr class="responsive-table-head hidden-xs">
                        <th><spring:theme code="text.account.savedCart.name" /></th>
                        <th><spring:theme code="text.account.savedCart.id" /></th>
                        <th><spring:theme code="text.account.savedCart.dateSaved" /></th>
                        <th><spring:theme code="text.account.savedCart.description" /></th>
                        <th><spring:theme code="text.account.savedCart.qty" /></th>
                        <th><spring:theme code="text.account.savedCart.total" /></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <c:forEach items="${searchPageData.results}" var="savedCart" varStatus="loop">
                	<c:choose>
                		<c:when test="${savedCart.importStatus eq 'PROCESSING' }">
                			<c:set var="importCartIsProcessing" value="true"/>
                			<c:set var="cartIdRowMapping" value="${cartIdRowMapping}${savedCart.code}:${loop.index},"/>
                		</c:when>
                		<c:otherwise>
                			<c:set var="importCartIsProcessing" value="false"/>
                		</c:otherwise>
                	</c:choose>
                    <tr id="row-${loop.index}" class="responsive-table-item">
          				<td class="hidden-sm hidden-md hidden-lg">
          					<spring:theme code='text.account.savedCart.name'/>
          				</td>
                  		<td class="responsive-table-cell saved-cart-name">
                      		<ycommerce:testId code="savedCarts_name_link">
                          		<a href="${fn:escapeXml(savedCartsLink)}${ycommerce:encodeUrl(savedCart.code)}"
									class="responsive-table-link js-saved-cart-name ${importCartIsProcessing ? 'not-active' : '' }">
                          			${fn:escapeXml(savedCart.name)}
                          		</a>
                      		</ycommerce:testId>
                  		</td>
                 		<td class="hidden-sm hidden-md hidden-lg">
                 			<spring:theme code='text.account.savedCart.id'/>
                 		</td>
						<td class="responsive-table-cell">
							<ycommerce:testId code="savedCarts_id_label">
								${fn:escapeXml(savedCart.code)}
							</ycommerce:testId>
						</td>
                   		<td class="hidden-sm hidden-md hidden-lg">
                   			<spring:theme code='text.account.savedCart.dateSaved'/>
                   		</td>
						<td class="responsive-table-cell">
							<div class="js-saved-cart-date ${importCartIsProcessing ? 'hidden' : '' }">
								<ycommerce:testId code="savedCarts_created_label">
									<fmt:formatDate value="${savedCart.saveTime}" dateStyle="medium" timeStyle="short" type="both" />
								</ycommerce:testId>
							</div>
						</td>
						<td class="hidden-sm hidden-md hidden-lg">
							<spring:theme code='text.account.savedCart.description'/>
						</td>
						<td class="responsive-table-cell saved-cart-description">
							<ycommerce:testId code="savedCarts_description_label">
								<span class="js-saved-cart-description">
									<c:choose>
										<c:when test="${importCartIsProcessing}">
											<span class="file-importing js-file-importing">
												<img src="${fn:escapeXml(commonResourcePath)}/images/3dots.gif" width="25" height="25" />
											</span>
										</c:when>
										<c:otherwise>
												${fn:escapeXml(savedCart.description)}
										</c:otherwise>
									</c:choose>
								</span>
							</ycommerce:testId>
						</td>
						<td class="hidden-sm hidden-md hidden-lg">
							<spring:theme code='text.account.savedCart.qty'/>
						</td>
						<td class="responsive-table-cell">
							<ycommerce:testId code="savedCarts_noOfItems_label">
								<span class="js-saved-cart-number-of-items">
									<c:if test="${importCartIsProcessing eq false}">
										${fn:length(savedCart.entries)}
									</c:if>
								</span>
							</ycommerce:testId>
						</td>
						<td class="hidden-sm hidden-md hidden-lg">
							<spring:theme code='text.account.savedCart.total'/>
						</td>
						<td class="responsive-table-cell">
							<strong>
								<ycommerce:testId code="savedCarts_totalProductPrice_label">
									<span class="js-saved-cart-total">
										<c:if test="${importCartIsProcessing eq false}">
											${fn:escapeXml(savedCart.totalPrice.formattedValue)}
										</c:if>
									</span>
								</ycommerce:testId>
							</strong>
						</td>
						 <td class="responsive-table-cell restore-item-column text-center">
							<ycommerce:testId code="savedCarts_restore_link">
								<a href="#" class="js-restore-saved-cart restore-item-link ${importCartIsProcessing || fn:length(savedCart.entries) < 1 ? 'hidden' : '' }"
									data-savedcart-id="${fn:escapeXml(savedCart.code)}"
									data-restore-popup-title="<spring:theme code='text.account.savedcart.restore.popuptitle'/>">
									<span class="hidden-xs"><spring:theme code='text.account.savedCart.restore'/></span>
									<span class="glyphicon glyphicon-share-alt visible-xs"></span>
								</a>
							</ycommerce:testId>
						</td>
						<td class="responsive-table-cell remove-item-column">
							<ycommerce:testId code="savedCarts_delete_link">
								<a href="#" class="js-delete-saved-cart remove-item-link ${importCartIsProcessing ? 'hidden' : '' }"
									data-savedcart-id="${fn:escapeXml(savedCart.code)}"
									data-delete-popup-title="<spring:theme code='text.account.savedcart.delete.popuptitle'/>">
									<span class="glyphicon glyphicon-remove"></span>
								</a>
							</ycommerce:testId>
						</td>
                		<cart:savedCartDeleteModal savedCart="${savedCart}"/>
                    </tr>
                </c:forEach>
            </table>
			<div class="js-uploading-saved-carts-update" data-id-row-mapping="${fn:escapeXml(cartIdRowMapping)}"
				 data-refresh-cart="${fn:escapeXml(refreshSavedCart)}"
				 data-refresh-interval="${fn:escapeXml(refreshSavedCartInterval)}"></div>
        </div>

        <div class="account-orderhistory-pagination">
            <nav:pagination top="false" msgKey="text.account.savedCarts.page" showCurrentPageInfo="true"
                            hideRefineButton="true"
                            supportShowPaged="${isShowPageAllowed}" supportShowAll="${isShowAllAllowed}"
                            searchPageData="${searchPageData}" searchUrl="${searchUrl}"
                            numberPagesShown="${numberPagesShown}"/>
        </div>
    </div>
</c:if>
