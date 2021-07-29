<%@ tag body-content="empty" trimDirectiveWhitespaces="true"%>
<%@ attribute name="entryNumber" required="true" type="java.lang.Integer" %>
<%@ attribute name="entryComments" required="true" type="java.util.List" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<spring:htmlEscape defaultHtmlEscape="true" />
<c:if test="${not empty entryComments}">
    <div id="entryCommentListDiv_${fn:escapeXml(entryNumber)}" data-show-all-entry-comments="false">
        <c:forEach items="${entryComments}" var="entryComment" varStatus="commentLoop">
            <c:set var="entryCommentId" value="" />
            <c:choose>
                <c:when test="${commentLoop.index < 4}">
                    <c:set var="entryCommentId" value="entryComment_${fn:escapeXml(entryNumber)}_${commentLoop.index}_${entryComment.code}" />
                </c:when>
                <c:otherwise>
                    <c:set var="entryCommentId" value="entryComment_${fn:escapeXml(entryNumber)}_${fn:escapeXml(commentLoop.index)}_${fn:escapeXml(entryComment.code)}" />
                </c:otherwise>
            </c:choose>
            <div id="${entryCommentId}" class="${commentLoop.index < 4 ? '' : 'display-none'}">
                <div class="row">
                    <div class="col-sm-5">
                        <div class="quote__comments--time">
                            <fmt:formatDate value="${entryComment.creationDate}" dateStyle="medium" timeStyle="short" type="both"/>
                        </div>
                    </div>
                    <div class="col-sm-7">
                        <span class="quote__comments--role">
                            ${fn:escapeXml(entryComment.author.name)}
                        </span>
                        <p class="quote__comments--comment">${fn:escapeXml(entryComment.text)}</p>
                    </div>
                </div>
            </div>
        </c:forEach>

        <c:if test="${fn:length(entryComments) gt 4}">
            <a href="#" class="js-more-entry-comments-anchor"
               data-entry-number="${fn:escapeXml(entryNumber)}">
                <spring:theme code="quote.more.comments"/>
            </a>
            <a href="#" class="js-less-entry-comments-anchor display-none"
               data-entry-number="${fn:escapeXml(entryNumber)}">
                <spring:theme code="quote.less.comments"/>
            </a>
        </c:if>
    </div>
</c:if>
