import React from "react";

export const Html = () => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>🌐</title>
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icon-180x180.png" />
      <meta name="theme-color" content="#203b53" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
    </head>
    <body>
      <div id="root">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            height: "100%",
            width: "100%",
            color: "#fff",
          }}
        >
          loading...
        </div>
      </div>
    </body>
  </html>
);
