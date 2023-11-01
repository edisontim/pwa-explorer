import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fff" />
      </Head>
      <body
        style={{
          margin: "0px",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
