import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Footer from "@/components/common/footer/index";

import "./globals.scss";
import "./customs.scss";

const notoSansKr = Noto_Sans_KR({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "We Sync | 위싱",
  description: "메인 페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 푸터를 포함한 레이아웃
  return (
    <html lang="en">
      <body className={notoSansKr.className}>
        <div className="page-container">
          <main>
            <AntdRegistry>{children}</AntdRegistry>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
