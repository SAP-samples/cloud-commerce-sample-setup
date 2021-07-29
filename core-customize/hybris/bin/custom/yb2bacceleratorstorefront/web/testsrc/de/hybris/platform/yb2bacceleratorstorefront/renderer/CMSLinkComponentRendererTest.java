/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.renderer;

import com.sap.security.core.server.csi.XSSEncoder;
import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.cms2.enums.LinkTargets;
import de.hybris.platform.cms2.model.contents.components.CMSLinkComponentModel;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;
import org.springframework.mock.web.MockJspWriter;

import javax.servlet.ServletException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;

import static org.mockito.Mockito.doCallRealMethod;
import static org.mockito.Mockito.when;

/**
 * Created by dan on 19/04/2017.
 */
@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class CMSLinkComponentRendererTest {

    @Mock
    PageContext pageContext;

    @Mock
    CMSLinkComponentModel component;

    @Mock
    CMSLinkComponentRenderer componentRenderer;

    Writer stringWriter;

    JspWriter out;

    @Before
    public void setUp() {
        stringWriter = new StringWriter();
        out = new MockJspWriter(new PrintWriter(stringWriter));
    }

    @Test
    public void testRenderComponentHappyPath() throws Exception {
        final String componentUrl = "https://www.somesite.com/page/subpage";
        final String linkName = "Link Name";
        final String styleAttributes = "class=\"fsa-logo\" style=\"font-weight: bold\" download=\"download\" " +
                "rev=\"rev\" hreflang=\"hreflang\" type=\"type\" text=\"text\" accesskey=\"accesskey\" " +
                "contenteditable=\"contenteditable\" contextmenu=\"contextmenu\" dir=\"dir\" draggable=\"draggable\" " +
                "dropzone=\"dropzone\" hidden=\"hidden\" id=\"id\" lang=\"lang\" spellcheck=\"spellcheck\" " +
                "tabindex=\"tabindex\" translate=\"translate\"";
        final LinkTargets linkTarget = LinkTargets.NEWWINDOW;

        createMockExpectations(componentUrl, linkName, styleAttributes, linkTarget);

        componentRenderer.renderComponent(pageContext, component);
        String actual = stringWriter.toString();
        String expected = "<a href=\"https://www.somesite.com/page/subpage\" " +
                "class=\"fsa-logo\" style=\"font-weight: bold\" download=\"download\" " +
                "rev=\"rev\" hreflang=\"hreflang\" type=\"type\" text=\"text\" " +
                "accesskey=\"accesskey\" contenteditable=\"contenteditable\" contextmenu=\"contextmenu\" dir=\"dir\" " +
                "draggable=\"draggable\" dropzone=\"dropzone\" hidden=\"hidden\" id=\"id\" lang=\"lang\" " +
                "spellcheck=\"spellcheck\" tabindex=\"tabindex\" translate=\"translate\" " +
                "title=\"Link Name\" target=\"_blank\" rel=\"noopener noreferrer\">Link Name</a>";

        Assert.assertEquals(expected, actual);
    }

    @Test
    public void testRenderComponentStyleAttributesWithXSS() throws Exception {
        final String componentUrl = "https://www.somesite.com/page/subpage";
        final String linkName = "Link Name";
        final String styleAttributes = "class=\"fsa-logo\" style=\"font-weight: bold\" <script>alert('attacked')</script>";
        final LinkTargets linkTarget = null;

        createMockExpectations(componentUrl, linkName, styleAttributes, linkTarget);

        componentRenderer.renderComponent(pageContext, component);
        String actual = stringWriter.toString();
        String expected = "<a href=\"https://www.somesite.com/page/subpage\" " +
                "class=\"fsa-logo\" style=\"font-weight: bold\">" +
                "alert(&#39;attacked&#39;) title&#61;&#34;Link Name&#34; &gt;Link Name</a>";

        Assert.assertEquals(expected, actual);
    }

    @Test
    public void testRenderComponentLinkNameWithXSS() throws Exception {
        final String componentUrl = "https://www.somesite.com/page/subpage";
        final String linkName = "Link Name<script>alert('attacked')</script>";
        final String styleAttributes = null;
        final LinkTargets linkTarget = null;

        createMockExpectations(componentUrl, linkName, styleAttributes, linkTarget);

        componentRenderer.renderComponent(pageContext, component);
        String actual = stringWriter.toString();
        String expected = "<a href=\"https://www.somesite.com/page/subpage\" " +
                "title=\"Link Name&lt;script&gt;alert(&#39;attacked&#39;)&lt;/script&gt;\">" +
                "Link Name&lt;script&gt;alert(&#39;attacked&#39;)&lt;/script&gt;</a>";

        Assert.assertEquals(expected, actual);
    }

    @Test
    public void testRenderComponentLinkNameAndStyleAttributesWithXSS() throws Exception {
        final String componentUrl = "https://www.somesite.com/page/subpage";
        final String linkName = "Link Name<script>alert('attacked')</script>";
        final String styleAttributes = "class=\"fsa-logo\" style=\"font-weight: bold\" <script>alert('attacked')</script>";
        final LinkTargets linkTarget = null;

        createMockExpectations(componentUrl, linkName, styleAttributes, linkTarget);

        componentRenderer.renderComponent(pageContext, component);
        String actual = stringWriter.toString();
        String expected = "<a href=\"https://www.somesite.com/page/subpage\" class=\"fsa-logo\" " +
                "style=\"font-weight: bold\">" +
                "alert(&#39;attacked&#39;) title&#61;&#34;Link Name&lt;script&gt;alert(&#39;attacked&#39;)&lt;/script&gt;&#34; &gt;Link Name&lt;script&gt;alert(&#39;attacked&#39;)&lt;/script&gt;</a>";

        Assert.assertEquals(expected, actual);
    }

    @Test
    public void testRenderComponentBlankUrlHappyPath() throws Exception {
        final String componentUrl = "";
        final String linkName = "Link Name";
        final String styleAttributes = null;
        final LinkTargets linkTarget = null;

        createMockExpectations(componentUrl, linkName, styleAttributes, linkTarget);

        componentRenderer.renderComponent(pageContext, component);
        String actual = stringWriter.toString();
        String expected = "<span class=\"empty-nav-item\">" +
                "Link Name</span>";

        Assert.assertEquals(expected, actual);
    }

    @Test
    public void testRenderComponentBlankUrlWithXSS() throws Exception {
        final String componentUrl = "";
        final String linkName = "Link Name<script>alert('attacked')</script>";
        final String styleAttributes = null;
        final LinkTargets linkTarget = null;

        createMockExpectations(componentUrl, linkName, styleAttributes, linkTarget);

        componentRenderer.renderComponent(pageContext, component);
        String actual = stringWriter.toString();
        String expected = "<span class=\"empty-nav-item\">" +
                "Link Name&lt;script&gt;alert(&#39;attacked&#39;)&lt;/script&gt;</span>";

        Assert.assertEquals(expected, actual);
    }

    private void createMockExpectations(final String componentUrl, final String linkName, final String styleAttributes,
                                        final LinkTargets linkTarget) throws ServletException, IOException {
        doCallRealMethod().when(componentRenderer).renderComponent(pageContext, component);
        when(pageContext.getOut()).thenReturn(out);
        when(componentRenderer.getUrl(component)).thenReturn(componentUrl);
        when(component.getLinkName()).thenReturn(linkName);
        when(component.getStyleAttributes()).thenReturn(styleAttributes);
        when(component.getTarget()).thenReturn(linkTarget);
    }


}
