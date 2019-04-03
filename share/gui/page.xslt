<?xml version="1.0" encoding="utf-8"?>
<xsl:transform version="1.0" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template name="page.html">
        <xsl:param name="title" />
        <xsl:param name="content" />
        <html lang="zh-CN">
            <head>
                <meta charset="utf-8" />
                <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
                />
                <title>
                    <xsl:text><![CDATA[Loading... | CCNR/3]]></xsl:text>
                </title>
                <meta name="theme-color" content="lime" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-title" content="CCNR/3" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <link rel="stylesheet" href="/n/app.css" />
                <link rel="icon" href="/n/icon-32.png" sizes="32x32" />
                <link rel="icon" href="/n/icon-192.png" sizes="192x192" />
                <link rel="apple-touch-icon" href="/n/icon-192.png" sizes="192x192" />
                <link rel="manifest" href="/n/manifest.webmanifest" />
            </head>
            <body>
                <div class="ccnr3" />
                <xsl:copy-of select="$content" />
                <script src="https://cdn.bootcss.com/react/16.8.4/umd/react.%REACT_PROFILE%.js"></script>
                <script src="https://cdn.bootcss.com/react-dom/16.8.4/umd/react-dom.%REACT_PROFILE%.js"></script>
                <script src="/n/app.js" async="true" />
            </body>
        </html>
    </xsl:template>
</xsl:transform>
