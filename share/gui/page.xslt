<?xml version="1.0" encoding="utf-8"?>
<xsl:transform version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template name="page.html">
        <xsl:param name="type" />
        <xsl:param name="title" />
        <xsl:param name="content" />
        <html lang="zh-CN">
            <xsl:attribute name="class">
                <xsl:text>page-</xsl:text>
                <xsl:value-of select="$type" />
            </xsl:attribute>
            <head>
                <meta charset="utf-8" />
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                <title>
                    <xsl:value-of select="$title" />
                    <xsl:text><![CDATA[ | CCNR/3]]></xsl:text>
                </title>
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
                />
            </head>
            <body>
                <div />
                <xsl:copy-of select="$content" />
                <script src="/n/app.js"></script>
            </body>
        </html>
    </xsl:template>
</xsl:transform>
