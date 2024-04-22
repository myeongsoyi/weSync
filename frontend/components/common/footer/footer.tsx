"use client";

import Image from "next/image";
import React from "react";
import styles from "./index.module.scss";

export default function Footer() {
  return (
    <footer className="flex justify-center p-6 bg-sky-700 text-white overflow-x-hidden">
      <div className={`flex bg-white p-2 rounded-xl ${styles.logo}`}>
        <Image
          src={"/svgs/logo.svg"}
          alt="로고"
          width={150}
          height={100}
          className="m-auto"
          onClick={() => alert("자율 프로젝트 A310")}
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className="flex">
        <p className={`m-auto w-fit ${styles.center}`}>
          weSync ©{new Date().getFullYear()} Created by A310
        </p>
      </div>
      <div className={styles.icon}>
        <Image
          src={"/images/wesync_icon.png"}
          alt="아이콘"
          height={70}
          width={70}
          className="p-1 rounded-full"
        />
      </div>
    </footer>
  );
}
