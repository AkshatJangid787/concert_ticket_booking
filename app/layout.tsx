import Script from "next/script";

export default function RootLayout({ children }: any) {
  return (
    <html>
      <body>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
