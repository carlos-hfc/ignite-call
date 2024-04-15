import { getCssText } from "@carlos-hfc-ignite-ui/react"
import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="shortcut icon"
          href="/favicon.ico"
          type="image/x-icon"
          sizes="48x48"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          type="image/png"
          sizes="180x180"
        />

        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />

        <link
          rel="manifest"
          href="/site.webmanifest"
        />
        <meta
          name="keywords"
          content="Ignite Call,Typescript,React,Next.js,Google Calendar"
        />
        <meta
          name="author"
          content="Carlos Faustino"
        />
        <meta
          name="creator"
          content="Carlos Faustino"
        />
        <link
          rel="author"
          content="https://github.com/carlos-hfc"
        />
        <meta
          name="category"
          content="technology"
        />

        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
