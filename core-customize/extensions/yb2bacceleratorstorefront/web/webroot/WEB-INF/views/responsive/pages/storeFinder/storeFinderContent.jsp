<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="store" tagdir="/WEB-INF/tags/responsive/store" %>

<store:storeSearch errorNoResults="${errorNoResults}"/>
<store:storeListForm searchPageData="${searchPageData}" locationQuery="${locationQuery}" numberPagesShown="${numberPagesShown}" geoPoint="${geoPoint}"/>