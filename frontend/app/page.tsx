import React from "react";
import Navigation from "@/components/common/navigations/navMain";

export default function HomePage() {

  return (
    <div>
      <Navigation/>
      <div className="content">
        <div
          style={{
            // background: colorBgContainer,
            minHeight: 300,
            height: "85vh",
            padding: 12,
            // borderRadius: borderRadiusLG,
          }}
        >
          <h1>Hello world</h1>
          <span>Content : 스크롤이 있는 경우</span>
        </div>
      </div>
    </div>
  );
}
