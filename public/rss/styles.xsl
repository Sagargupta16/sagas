<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
  <xsl:template match="/rss/channel">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>
          <xsl:value-of select="title" /> feed
        </title>
        <style>
          :root {
            color-scheme: dark light;
            --surface: light-dark(oklch(0.96 0.012 80), oklch(0.17 0.012 80));
            --raised: light-dark(oklch(0.99 0.01 80), oklch(0.21 0.016 80));
            --ink: light-dark(oklch(0.24 0.02 80), oklch(0.88 0.02 80));
            --soft: light-dark(oklch(0.45 0.02 78), oklch(0.68 0.018 78));
            --line: light-dark(oklch(0.85 0.02 80), oklch(0.3 0.018 80));
            --flame: light-dark(oklch(0.55 0.13 65), oklch(0.78 0.13 75));
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            background: var(--surface);
            color: var(--ink);
            font-family: Georgia, 'Times New Roman', serif;
            line-height: 1.6;
          }
          .wrap {
            width: min(100% - 3rem, 44rem);
            margin: 0 auto;
            padding-block: 3rem 4rem;
          }
          .eyebrow {
            font-size: 0.8rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--flame);
            margin: 0 0 0.5rem;
          }
          h1 { font-size: 2rem; margin: 0 0 0.5rem; }
          .lede { color: var(--soft); margin: 0 0 1rem; max-width: 40ch; }
          .note {
            font-size: 0.9rem;
            color: var(--soft);
            padding: 0.75rem 1rem;
            border: 1px solid var(--line);
            border-radius: 10px;
            margin-bottom: 2.5rem;
          }
          .note a { color: var(--flame); }
          ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 1rem; }
          li {
            background: var(--raised);
            border: 1px solid var(--line);
            border-radius: 12px;
            padding: 1rem 1.25rem;
          }
          li a {
            font-size: 1.15rem;
            font-weight: 600;
            color: var(--ink);
            text-decoration: none;
          }
          li a:hover { color: var(--flame); }
          .date { display: block; margin-top: 0.35rem; font-size: 0.85rem; color: var(--soft); }
          .home { display: inline-block; margin-top: 2.5rem; color: var(--flame); }
        </style>
      </head>
      <body>
        <div class="wrap">
          <p class="eyebrow">RSS feed</p>
          <h1><xsl:value-of select="title" /></h1>
          <p class="lede"><xsl:value-of select="description" /></p>
          <p class="note">
            This is a web feed, meant for a feed reader. Copy the page URL into
            an app like NetNewsWire, Feedly, or Reeder to get new chapters as
            they land. Or just
            <a href="{link}">read in the browser</a>.
          </p>
          <ul>
            <xsl:for-each select="item">
              <li>
                <a href="{link}"><xsl:value-of select="title" /></a>
                <span class="date"><xsl:value-of select="pubDate" /></span>
              </li>
            </xsl:for-each>
          </ul>
          <a class="home" href="{link}">Back to the library</a>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
