	<%@ page trimDirectiveWhitespaces="true" %>
		<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
		<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
		<%@ taglib prefix="cms" uri="http://hybris.com/tld/cmstags" %>

		<c:set value="${component.styleClass} ${dropDownLayout}" var="bannerClasses"/>

		<li class="${fn:escapeXml(bannerClasses)} nav__links--primary <c:if test="${not empty component.navigationNode.children}">nav__links--primary-has__sub js-enquire-has-sub</c:if>">

			<cms:component component="${component.link}" evaluateRestriction="true" element="span" class="nav__link js_nav__link"/>
			<c:if test="${not empty component.navigationNode.children}">

				<c:set var="totalSubNavigationColumns" value="${0}"/>

				<c:forEach items="${component.navigationNode.children}" var="subSection" varStatus="loop">
					<c:set value="${fn:length(subSection.links)/component.wrapAfter}" var="subSectionColumns"/>
					<c:choose>
						<c:when test="${subSectionColumns > 1}">
							<c:set var="totalSubNavigationColumns" value="${totalSubNavigationColumns + subSectionColumns}" />
						</c:when>

						<c:when test="${subSectionColumns < 1}">
							<c:set var="totalSubNavigationColumns" value="${totalSubNavigationColumns + 1}" />
						</c:when>
					</c:choose>

					<c:if test="${not empty subSection.title}">
						<c:set var="hasTitleClass" value="has-title"/>
					</c:if>
				</c:forEach>

				<c:choose>
					<c:when test="${totalSubNavigationColumns > 0 && totalSubNavigationColumns <= 1}">
						<c:set value="col-md-3 col-lg-2" var="subNavigationClass"/>
						<c:set value="col-md-12" var="subNavigationItemClass"/>
					</c:when>

					<c:when test="${totalSubNavigationColumns == 2}">
						<c:set value="col-md-6 col-lg-4" var="subNavigationClass"/>
						<c:set value="col-md-6" var="subNavigationItemClass"/>
					</c:when>

					<c:when test="${totalSubNavigationColumns == 3}">
						<c:set value="col-md-9 col-lg-6" var="subNavigationClass"/>
						<c:set value="col-md-4" var="subNavigationItemClass"/>
					</c:when>

					<c:when test="${totalSubNavigationColumns == 4}">
						<c:set value="col-md-12 col-lg-8" var="subNavigationClass"/>
						<c:set value="col-md-3" var="subNavigationItemClass"/>
					</c:when>

					<c:when test="${totalSubNavigationColumns == 5}">
						<c:set value="col-md-12" var="subNavigationClass"/>
						<%--custom grid class required because 1/5th columns aren't supported by bootstrap--%>
						<c:set value="column-20-percent" var="subNavigationItemClass"/>
					</c:when>

					<c:when test="${totalSubNavigationColumns > 5}">
						<c:set value="col-md-12" var="subNavigationClass"/>
						<c:set value="col-md-2" var="subNavigationItemClass"/>
					</c:when>
				</c:choose>
				<c:if test="${not empty component.navigationNode.children}"><span class="glyphicon  glyphicon-chevron-right hidden-md hidden-lg nav__link--drill__down js_nav__link--drill__down"></span></c:if>
				<div class="sub__navigation js_sub__navigation ${subNavigationClass}">
					<a class="sm-back js-enquire-sub-close hidden-md hidden-lg" href="#">Back</a>
					<div class="row">
					<c:forEach items="${component.navigationNode.children}" var="child">
						<c:if test="${child.visible}">
							<c:forEach items="${child.links}" step="${component.wrapAfter}" var="childlink" varStatus="i">
								<%-- for a large amount of links (depending on what wrapAfter is set to) that would exceed 6 columns, insert a clearfix div to have the next row properly aligned --%>
								<c:if test="${i.index != 0 && i.index % (6*component.wrapAfter) == 0}">
									<div class="clearfix hidden-sm-down"></div>
								</c:if>

								<div class="sub-navigation-section ${subNavigationItemClass}">
									<%--only add title on first loop for each sub-section--%>
									<c:if test="${i.index == 0 && not empty child.title}">
										<div class="title">${fn:escapeXml(child.title)}</div>
									</c:if>

									<ul class="sub-navigation-list ${hasTitleClass}">
										<c:forEach items="${child.links}" var="childlink" begin="${i.index}" end="${i.index + component.wrapAfter - 1}">
											<c:if test="${fn:contains(childlink.uid, 'BrowseAll')}">
												<span class="text-uppercase">
											</c:if>
											<cms:component component="${childlink}" evaluateRestriction="true" element="li" class="nav__link--secondary" />
											<c:if test="${fn:contains(childlink.uid, 'BrowseAll')}">
												</span>
											</c:if>
										</c:forEach>
									</ul>

								</div>
							</c:forEach>
						</c:if>
					</c:forEach>
				</div>
				</div>
			</c:if>
		</li>
