import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactGA from 'react-ga4';
import { GoogleAnalytics } from '@next/third-parties/google'
import { GA } from "../../components/GA/GA";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "metroguessr",
  description: "Test your memory to guess as many metro stations as possible.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <title>metroguessr</title>
      <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
      <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico"/>
      <link rel="icon" href="https://www.metroguessr.com/favicon.ico" type="image/x-icon"/>
      <link rel="shortcut icon" href="https://www.metroguessr.com/favicon.ico" type="image/x-icon"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      <meta name="keywords" content="game, tube, metro, lyon, paris, london, memory, guesser, metroguessr, tubeguesser, metroguesser"/>
      <meta name="description" content="&#128081; Test your memory to guess as many metro stations as possible. &#128081;"/>
      <meta name="author" content="Jack"/>

      {/* <!-- Open Graph tags --> */}
      <meta property="og:title" content="metroguessr"/>
      <meta property="og:description" content="Test your memory to guess as many metro stations as possible."/>
      <meta property="og:url" content="https://www.metroguessr.com/?"/>
      <meta property="og:type" content="website"/>
      <meta property="og:image" content="https://www.metroguessr.com/share.jpg"/>
      <meta property="og:image:secure_url" content="https://www.metroguessr.com/share.jpg"/>
      <meta property="og:image:alt" content="metroguessr"/>
      <meta property="og:image:width" content="1200"/>
      <meta property="og:image:height" content="630"/>

      {/* <!-- Twitter Card tags --> */}
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:title" content="metroguessr"/>
      <meta name="twitter:description" content="Test your memory to guess as many metro stations as possible."/>
      <meta name="twitter:site" content="https://www.metroguessr.com/?"/>
      <meta name="twitter:image" content="https://www.metroguessr.com/share.jpg"/>
      <meta name="twitter:image:alt" content="metroguessr"/>      

      <GA />

      <body className={inter.className}>{children}</body>
    </html>
  );
  // return (<div>Under maintenance, we will be returning ASAP!</div>)
}
