<%@ tag body-content="empty" trimDirectiveWhitespaces="true"%>
<%@ attribute name="comments" required="true" type="java.util.List"%>
<%@ attribute name="disabled" required="false" type="java.lang.Boolean"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<spring:htmlEscape defaultHtmlEscape="true" />
<spring:url value="/quote/" var="quoteBaseLink" htmlEscape="false"/>

<div id="js-quote-comments" data-quote-base-link="${quoteBaseLink}"
	 data-current-comments-shown="${fn:escapeXml(commentsShown)}"
	 data-show-all-comments="false">

    <c:if test="${disabled && not empty comments}">
        <div class="quote__comments--header">
            <spring:theme code="text.quote.comments.label" />
        </div>
    </c:if>

	<div id="commentListDiv">
	    <c:forEach items="${comments}" var="quoteComment" varStatus="loop">
	        <div id="comment_${loop.index}_${fn:escapeXml(quoteComment.code)}">
                <div class="row">
                    <div class="col-sm-5">
                        <div class="quote__comments--time">
                            <fmt:formatDate value="${quoteComment.creationDate}" dateStyle="medium" timeStyle="short" type="both"/>
                        </div>
                    </div>
                    <div class="col-sm-7">
                        <span class="quote__comments--role">
                            ${fn:escapeXml(quoteComment.author.name)}
                        </span>
                        <p class="quote__comments--comment">${fn:escapeXml(quoteComment.text)}</p>
                    </div>
                </div>
	        </div>
	    </c:forEach>
	    <c:if test="${fn:length(comments) gt commentsShown}">
	    	<a href="#" id="moreCommentsAnchor"><spring:theme code="quote.more.comments"/></a>
	    	<a href="#" id="lessCommentsAnchor"><spring:theme code="quote.less.comments"/></a>
	    </c:if>
    </div>

    <c:if test="${not disabled}">
        <div class="row">
            <div class="col-sm-7 col-sm-offset-5">
                <label for="comment">
                    <spring:theme code="text.quote.comments.label"/>&nbsp;<spring:theme code="login.optional" htmlEscape="false" />
                </label>
                <textarea class="form-control quote__comments--textarea" id="comment" placeholder='<spring:theme code="quote.enter.comment"/>'></textarea>
            </div>
        </div>
    </c:if>

</div>
