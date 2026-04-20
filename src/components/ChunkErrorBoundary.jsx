import React from "react";

function isChunkLoadError(error) {
  const message = String(error?.message ?? "");
  return (
    error?.name === "ChunkLoadError" ||
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Importing a module script failed") ||
    message.includes("dynamically imported module")
  );
}

export default class ChunkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      isChunkError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      isChunkError: isChunkLoadError(error),
    };
  }

  componentDidCatch(error) {
    if (this.state.isChunkError) {
      console.warn("Detected stale chunk load, asking user to refresh.", error);
      return;
    }

    console.error(error);
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.hasError &&
      prevProps.resetKey !== this.props.resetKey
    ) {
      this.setState({
        hasError: false,
        isChunkError: false,
      });
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.state.isChunkError) {
      return (
        <div className="section-card flex min-h-[240px] flex-col items-center justify-center text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            页面已更新
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
            检测到新版本资源
          </h2>
          <p className="mt-3 max-w-[260px] text-sm leading-6 text-[var(--muted)]">
            当前页面还拿着旧版本的分包文件，所以这一页没有成功加载。刷新一次就能进入最新版本。
          </p>
          <button
            type="button"
            className="primary-button mt-6"
            onClick={() => window.location.reload()}
          >
            立即刷新
          </button>
        </div>
      );
    }

    return (
      <div className="section-card flex min-h-[240px] flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold text-[var(--ink)]">这一页没有顺利打开</h2>
        <p className="mt-3 max-w-[260px] text-sm leading-6 text-[var(--muted)]">
          先刷新一下页面试试；如果问题持续存在，再告诉我，我们继续把它修掉。
        </p>
        <button
          type="button"
          className="secondary-button mt-6"
          onClick={() => window.location.reload()}
        >
          刷新页面
        </button>
      </div>
    );
  }
}
