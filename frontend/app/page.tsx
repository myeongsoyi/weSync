import React from "react";
import Navigation from "@/components/common/navigations/navMain";
import AlertTest from "@/components/home/alertTest";
import styles from "@/components/home/index.module.scss";

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
          <h1 className={styles.title}>Hello world</h1>
          <p>css 테스트</p>
          <hr />
          <span>Content : 스크롤이 있는 경우</span>
          <AlertTest/>
        </div>
      </div>
    </div>
  );
}
