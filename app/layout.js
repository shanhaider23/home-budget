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
import { useState, useEffect } from 'react';

const geistSans = Outfit({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Outfit({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {


  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('sidebarExpanded');
      setIsSidebarExpanded(saved !== 'false');
    }
  }, []);

  return (
    <ClerkProvider>
      <Provider store={store}>
        <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <Toaster />
            <div className="flex h-screen">
              {/* Sidebar: Fixed on the left */}
              <aside className="w-64 h-full text-white fixed left-0 top-0 bottom-0">
                <SideNav isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} />
              </aside>

              {/* Main Content: Includes Header, Footer & Page Content */}
              <main className={`transition-all duration-300 flex flex-col w-full h-screen overflow-hidden`}
                style={{
                  marginLeft: isSidebarExpanded ? '255px' : '68px',
                }}>
                {/* Header */}
                <Header />

                {/* Content Section with Page Transitions */}
                <div className=" overflow-auto">
                  <div className="w-full flex justify-center mx-auto h-full relative">
                    <div className="w-full  page-transition-container">
                      {children}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <Footer />
              </main>
            </div>
          </body>
        </html>
      </Provider>
    </ClerkProvider>
  );
}
