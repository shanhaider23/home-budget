'use client';
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from "@/components/ui/sonner";
import Header from "./_component/Header";
import SideNav from "./(routes)/dashboard/_component/SideNav";
import { store } from '../redux/store';
import { Provider } from 'react-redux';
import Footer from "./_component/Footer";

const geistSans = Outfit({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Outfit({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <Provider store={store}>
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <Toaster />
            <Header />
            <div className="flex">
              <SideNav />
              {/* Content Section with Page Transitions */}
              <div className="w-full overflow-x-auto">
                <div className="sm:h-[calc(93.2vh-60px)] overflow-auto">
                  <div className="w-full flex justify-center mx-auto overflow-auto h-[calc(100vh - 120px)] overflow-y-auto relative">
                    <div className="w-full md:max-w-6xl page-transition-container">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </body>
        </html>
      </Provider>
    </ClerkProvider>
  );
}
