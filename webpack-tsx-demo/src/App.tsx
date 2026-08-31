export function App() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: 32, lineHeight: 1.6 }}>
      <p style={{ color: "#888", letterSpacing: "0.2em", fontSize: 12 }}>WEBPACK + TSX</p>
      <h1>这份页面是 Webpack 打出来的</h1>
      <p>
        入口是 <code>src/main.tsx</code>。Webpack 用 <code>ts-loader</code> 把 TSX 编成
        JS，再交给浏览器执行。
      </p>
    </main>
  );
}
