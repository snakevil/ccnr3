<?xml version="1.0" encoding="utf-8"?>
<xsl:transform version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="utf-8" omit-xml-declaration="yes" indent="no" />
    <xsl:strip-space elements="*" />
    <xsl:include href="page.xslt" />

    <xsl:template match="/Chapter">
        <xsl:call-template name="page.html">
            <xsl:with-param name="type">
                <xsl:text>chapter</xsl:text>
            </xsl:with-param>
            <xsl:with-param name="title" select="Title" />
            <xsl:with-param name="content">
                <ol id="data">
                    <xsl:attribute name="data-title">
                        <xsl:value-of select="Title" />
                    </xsl:attribute>
                    <xsl:attribute name="data-toc">
                        <xsl:value-of select="@toc" />
                    </xsl:attribute>
                    <xsl:apply-templates select="Paragraphs" />
                </ol>
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="/Chapter/Paragraphs/Paragraph">
        <li>
            <xsl:value-of select="." />
        </li>
    </xsl:template>
</xsl:transform>
