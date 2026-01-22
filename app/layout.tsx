import "./globals.css";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";
import Script from "next/script";
import SmoothScroll from "./components/SmoothScroll";

export const metadata = {
  title: "TicketHive | Book Concerts",
  description: "The premium destination for booking exclusive concert tickets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-gray-900 bg-gray-50">
        <SmoothScroll />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />

        <Navbar />
        <Toaster position="top-right" richColors />

        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
