<%@ tag body-content="empty" trimDirectiveWhitespaces="true"%>
<%@ attribute name="hideHeaderLinks" required="false"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags"%>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags"%>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags"%>
<%@ taglib prefix="nav" tagdir="/WEB-INF/tags/responsive/nav"%>

<spring:htmlEscape defaultHtmlEscape="true" />

<cms:pageSlot position="TopHeaderSlot" var="component" element="div" >
	<cms:component component="${component}" />
</cms:pageSlot>

<header class="js-mainHeader">
	<nav class="navigation navigation--top hidden-xs hidden-sm">
		<div class="row">
			<div class="col-sm-12 col-md-4">
				<div class="nav__left js-site-logo">
					<cms:pageSlot position="SiteLogo" var="logo" limit="1">
						<cms:component component="${logo}" element="div" class="yComponentWrapper"/>
					</cms:pageSlot>
				</div>
			</div>
			<div class="col-sm-12 col-md-8">
				<div class="nav__right">
					<ul class="nav__links nav__links--account">
						<c:if test="${empty hideHeaderLinks}">
							<c:if test="${uiExperienceOverride}">
								<li class="backToMobileLink">
									<c:url value="/_s/ui-experience?level=" var="backToMobileStoreUrl" />
									<form:form action="${backToMobileStoreUrl}" class="url-holder">
										<button type="submit" class="navbar-default navbar-link btn-link">
											<spring:theme code="text.backToMobileStore" />
										</button>
									</form:form>
								</li>
							</c:if>

							<sec:authorize access="!hasAnyRole('ROLE_ANONYMOUS')">
								<c:set var="maxNumberChars" value="25" />
								<c:if test="${fn:length(user.firstName) gt maxNumberChars}">
									<c:set target="${user}" property="firstName"
										value="${fn:substring(user.firstName, 0, maxNumberChars)}..." />
								</c:if>

								<li class="logged_in js-logged_in">
									<ycommerce:testId code="header_LoggedUser">
										<spring:theme code="header.welcome" arguments="${user.firstName},${user.lastName}" />
									</ycommerce:testId>
								</li>
							</sec:authorize>

							 <cms:pageSlot position="HeaderLinks" var="link">
								 <cms:component component="${link}" element="li" />
							 </cms:pageSlot>

							<sec:authorize access="hasAnyRole('ROLE_ANONYMOUS')" >
								<li class="liOffcanvas">
									<ycommerce:testId code="header_Login_link">
										<c:url value="/login" var="loginUrl" />
										<a href="${fn:escapeXml(loginUrl)}">
											<spring:theme code="header.link.login" />
										</a>
									</ycommerce:testId>
								</li>
							</sec:authorize>

							<sec:authorize access="!hasAnyRole('ROLE_ANONYMOUS')" >
								<li class="liOffcanvas">
									<ycommerce:testId code="header_signOut">
										<c:url value="/logout" var="logoutUrl"/>
										<a href="${fn:escapeXml(logoutUrl)}">
											<spring:theme code="header.link.logout" />
										</a>
									</ycommerce:testId>
								</li>
							</sec:authorize>

						</c:if>
					</ul>
				</div>
			</div>
		</div>
	</nav>
	<%-- a hook for the my account links in desktop/wide desktop--%>
	<div class="hidden-xs hidden-sm js-secondaryNavAccount collapse" id="accNavComponentDesktopOne">
		<ul class="nav__links">

		</ul>
	</div>
	<div class="hidden-xs hidden-sm js-secondaryNavCompany collapse" id="accNavComponentDesktopTwo">
		<ul class="nav__links js-nav__links">

		</ul>
	</div>
	<nav class="navigation navigation--middle js-navigation--middle">
		<div class="container-fluid">
			<div class="row">
				<div class="mobile__nav__row mobile__nav__row--table">
					<div class="mobile__nav__row--table-group">
						<div class="mobile__nav__row--table-row">
							<div class="mobile__nav__row--table-cell visible-xs hidden-sm">
								<button class="mobile__nav__row--btn btn mobile__nav__row--btn-menu js-toggle-sm-navigation"
										type="button">
									<span class="glyphicon glyphicon-align-justify"></span>
								</button>
							</div>

							<div class="mobile__nav__row--table-cell visible-xs mobile__nav__row--seperator">
								<ycommerce:testId code="header_search_activation_button">
									<button	class="mobile__nav__row--btn btn mobile__nav__row--btn-search js-toggle-xs-search hidden-sm hidden-md hidden-lg" type="button">
										<span class="glyphicon glyphicon-search"></span>
									</button>
								</ycommerce:testId>
							</div>

							<c:if test="${empty hideHeaderLinks}">
								<ycommerce:testId code="header_StoreFinder_link">
									<div class="mobile__nav__row--table-cell hidden-sm hidden-md hidden-lg mobile__nav__row--seperator">
										<c:url value="/store-finder" var="storeFinderUrl"/>
										<a href="${fn:escapeXml(storeFinderUrl)}" class="mobile__nav__row--btn mobile__nav__row--btn-location btn">
											<span class="glyphicon glyphicon-map-marker"></span>
										</a>
									</div>
								</ycommerce:testId>
							</c:if>

							<cms:pageSlot position="MiniCart" var="cart" element="div" class="miniCartSlot componentContainer mobile__nav__row--table hidden-sm hidden-md hidden-lg">
								<cms:component component="${cart}" element="div" class="mobile__nav__row--table-cell" />
							</cms:pageSlot>

						</div>
					</div>
				</div>
			</div>
			<div class="row desktop__nav">
				<div class="nav__left col-xs-12 col-sm-6">
					<div class="row">
						<div class="col-sm-2 hidden-xs visible-sm mobile-menu">
							<button class="btn js-toggle-sm-navigation" type="button">
								<span class="glyphicon glyphicon-align-justify"></span>
							</button>
						</div>
						<div class="col-sm-10">
							<div class="site-search">
								<cms:pageSlot position="SearchBox" var="component">
									<cms:component component="${component}" element="div"/>
								</cms:pageSlot>
							</div>
						</div>
					</div>
				</div>
				<div class="nav__right col-xs-6 col-xs-6 hidden-xs">
					<ul class="nav__links nav__links--shop_info">
						<li>
							<c:if test="${empty hideHeaderLinks}">
								<ycommerce:testId code="header_StoreFinder_link">
									<div class="nav-location hidden-xs">
										<c:url value="/store-finder" var="storeFinderUrl"/>
										<a href="${fn:escapeXml(storeFinderUrl)}" class="btn">
											<span class="glyphicon glyphicon-map-marker"></span>
										</a>
									</div>
								</ycommerce:testId>
							</c:if>
						</li>
						<li>
							<cms:pageSlot position="MiniCart" var="cart" element="div" class="componentContainer">
								<cms:component component="${cart}" element="div"/>
							</cms:pageSlot>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</nav>
	<a id="skiptonavigation"></a>
	<nav:topNavigation />
</header>

<cms:pageSlot position="BottomHeaderSlot" var="component" element="div"	class="container-fluid">
	<cms:component component="${component}" />
</cms:pageSlot>
