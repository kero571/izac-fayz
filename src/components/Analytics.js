"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";

export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_CLARITY_ID;
  const path = usePathname();
  if (!id || !/^[a-z0-9]{6,20}$/i.test(id) || path?.startsWith("/admin"))
    return null;
  return (
    <Script
      id="clarity"
      strategy="afterInteractive"
    >{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(id)});`}</Script>
  );
}
