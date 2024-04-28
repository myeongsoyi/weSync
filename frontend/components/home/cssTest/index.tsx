import styles from './index.module.scss';

export default function cssTest() {
  return (
    <div
      style={{
        // background: colorBgContainer,
        minHeight: 200,
        padding: 12,
        // borderRadius: borderRadiusLG,
      }}
    >
      <h1 className={styles.title}>Hello world</h1>
      <p>css 테스트</p>
      <hr />
      <span>Content : 스크롤이 있는 경우</span>
    </div>
  );
}
