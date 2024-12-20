import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 500 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 500 900",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen w-screen`}
      >
        <div className="flex flex-col w-screen h-screen p-7 bg-primary bg-opacity-50 transition-colors">
          <NextTopLoader color="#a9cfc5" />
          {children}
          <Toaster richColors closeButton position='bottom-left' duration={1000} />
        </div>
      </body>
    </html>
  );
}
