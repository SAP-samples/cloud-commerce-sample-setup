<%@ page trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags/responsive/template" %>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags" %>
<%@ taglib prefix="storepickup" tagdir="/WEB-INF/tags/responsive/storepickup" %>

<template:page pageTitle="${pageTitle}">

	<div class="row">
		<div class="col-xs-3">
			<cms:pageSlot position="ProductLeftRefinements" var="feature" element="div" class="search-list-page-left-refinements-slot">
				<cms:component component="${feature}" element="div" class="search-list-page-left-refinements-component"/>
			</cms:pageSlot>
		</div>
		<div class="col-sm-12 col-md-9">
			<cms:pageSlot position="SearchResultsListSlot" var="feature" element="div" class="search-list-page-right-result-list-slot">
				<cms:component component="${feature}" element="div" class="search-list-page-right-result-list-component"/>
			</cms:pageSlot>
        </div>
	</div>

	<storepickup:pickupStorePopup />

</template:page>