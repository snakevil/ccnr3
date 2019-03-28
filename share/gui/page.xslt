<?xml version="1.0" encoding="utf-8"?>
<xsl:transform version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template name="page.html">
        <xsl:param name="title" />
        <xsl:param name="content" />
        <html lang="zh-CN">
            <head>
                <meta charset="utf-8" />
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>
                    <xsl:text><![CDATA[Loading... | CCNR/3]]></xsl:text>
                </title>
                <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
                />
                <link rel="stylesheet" href="/n/app.css" />
            </head>
            <body>
                <div />
                <xsl:copy-of select="$content" />
                <script src="https://cdn.bootcss.com/react/16.8.4/umd/react.%REACT_PROFILE%.js"></script>
                <script src="https://cdn.bootcss.com/react-dom/16.8.4/umd/react-dom.%REACT_PROFILE%.js"></script>
                <script src="/n/app.js" />
            </body>
        </html>
    </xsl:template>
</xsl:transform>
