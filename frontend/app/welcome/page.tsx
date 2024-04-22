import Link from "next/link";
import Navigation from "@/components/common/navigations/navMain";

export default function welcome() {
  return (
    <div>
      <Navigation />
      <div className="content">
        <div
          style={{
            minHeight: 300,
            // height: "85vh",
            padding: 12,
          }}
        >
            <Link href={"/"}>
          <h1>Welcome</h1>
          <span>Content : 스크롤이 없는 경우</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
