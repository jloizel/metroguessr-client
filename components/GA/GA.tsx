import Script from "next/script";

export const GA = () => {
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}/>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', '${googleAnalyticsId}');
        `}
      </Script>
    </>
 );
}

