<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="nav" tagdir="/WEB-INF/tags/responsive/nav" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags" %>

<spring:htmlEscape defaultHtmlEscape="true"/>
<c:set var="searchUrl" value="/my-account/my-quotes?sort=${ycommerce:encodeUrl(searchPageData.pagination.sort)}"/>

<div class="account-section-header">
    <spring:theme code="text.account.quote.myquotes"/>
</div>

<c:if test="${empty searchPageData.results}">
    <div class="row">
        <div class="col-md-6 col-md-push-3">
            <div class="account-section-content	content-empty">
                <ycommerce:testId code="quoteHistory_noQuotes_label">
                    <spring:theme code="text.account.quotes.noQuotes"/>
                </ycommerce:testId>
            </div>
        </div>
    </div>
</c:if>

<c:if test="${not empty searchPageData.results}">
    <div class="account-section-content	">
        <div class="account-orderhistory">
            <div class="account-orderhistory-pagination">
                <nav:pagination top="true" msgKey="text.account.quote.page" showCurrentPageInfo="true"
                                hideRefineButton="true" supportShowPaged="${isShowPageAllowed}"
                                supportShowAll="${isShowAllAllowed}" searchPageData="${searchPageData}"
                                searchUrl="${searchUrl}" numberPagesShown="${numberPagesShown}"/>
            </div>
            
           

            <div class="account-overview-table">
                <table class="orderhistory-list-table responsive-table">
                	<thead>
	                    <tr class="account-orderhistory-table-head responsive-table-head hidden-xs">
	                        <th id="header1"><spring:theme code='text.account.quote.name'/></th>
	                        <th id="header2"><spring:theme code='text.account.quote.code'/></th>
	                        <th id="header3"><spring:theme code='text.account.quote.status'/></th>
	                        <th id="header4"><spring:theme code='text.account.quote.date.updated'/></th>
	                    </tr>
                    </thead>
                    <tbody>
	                    <c:forEach items="${searchPageData.results}" var="quote">
	                        <tr class="responsive-table-item">
	                        	<ycommerce:testId code="orderHistoryItem_orderDetails_link">
		                            <td headers="header1" class="hidden-sm hidden-md hidden-lg">
		                            	<spring:theme code="text.account.quote.name" />
		                            </td>
		                            <td class="responsive-table-cell">
		                            	<spring:url value="/my-account/my-quotes/{/quotecode}/" var="quoteDetailLink" htmlEscape="false">
		                            		<spring:param name="quotecode"  value="${quote.code}"/>
		                            	</spring:url>
										<a href="${fn:escapeXml(quoteDetailLink)}" class="responsive-table-link">${fn:escapeXml(quote.name)}</a>
									</td>
									<td class="hidden-sm hidden-md hidden-lg">
										<spring:theme code="text.account.quote.code"/>
									</td>
									<td class="responsive-table-cell">
										${fn:escapeXml(quote.code)}
									</td>
									<td class="hidden-sm hidden-md hidden-lg">
										<spring:theme code="text.account.quote.status"/>
									</td>																
									<td class="status">
										<spring:theme code="text.account.quote.status.display.${quote.state}"/>
									</td>
									<td class="hidden-sm hidden-md hidden-lg">
										<spring:theme code="text.account.quote.date.updated"/>
									</td>
									<td class="responsive-table-cell">
										<fmt:formatDate value="${quote.updatedTime}" dateStyle="medium" timeStyle="short" type="both"/>
									</td>							
								</ycommerce:testId>
	                        </tr>
	                    </c:forEach>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="account-orderhistory-pagination">
            <nav:pagination top="false" msgKey="text.account.quote.page" showCurrentPageInfo="true"
                            hideRefineButton="true" supportShowPaged="${isShowPageAllowed}"
                            supportShowAll="${isShowAllAllowed}" searchPageData="${searchPageData}"
                            searchUrl="${searchUrl}" numberPagesShown="${numberPagesShown}"/>
        </div>
    </div>
</c:if>
