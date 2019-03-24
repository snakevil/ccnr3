<?xml version="1.0" encoding="utf-8"?>
<xsl:transform version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="utf-8" omit-xml-declaration="yes" indent="no" />
    <xsl:strip-space elements="*" />
    <xsl:include href="page.xslt" />

    <xsl:template match="/Novel">
        <xsl:call-template name="page.html">
            <xsl:with-param name="type">
                <xsl:text>toc</xsl:text>
            </xsl:with-param>
            <xsl:with-param name="title" select="Title" />
            <xsl:with-param name="content">
                <ol id="data" style="display:none">
                    <xsl:attribute name="data-title">
                        <xsl:value-of select="Title" />
                    </xsl:attribute>
                    <xsl:attribute name="data-author">
                        <xsl:value-of select="Author" />
                    </xsl:attribute>
                    <xsl:apply-templates select="Chapters" />
                </ol>
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="/Novel/Chapters/Chapter">
        <li>
            <xsl:value-of select="." />
        </li>
    </xsl:template>
</xsl:transform>
