# SDGs 互動式數位策展

以 SDGs 為主題、以 Awwwards 等級的設計與體驗為目標的互動式靜態網站。專案需求與協作規則見 [AGENTS.md](./AGENTS.md)。

響應式展覽網站，包含 GSAP／ScrollTrigger 敘事、四種生活情境、兩組互動資料圖表、來源說明及 CSV 下載。回饋串接暫緩，目前準備首次 GitHub Pages 發布。

已確認展覽聚焦台灣、面向一般大眾，以「現在的家庭帳單」為入口，探究家庭經濟條件與教育資源的關係。資料以政府資料開放平臺為入口，必要時延伸至政府機關官方原始報表。

資料定義、官方原始報告與適用限制見 [展覽引用資料](./docs/data-sources.md)。完整網站尚未做外部觀眾測試，也未證實差距擴大或因果關係。本 Repo 保留可公開的數值快照與來源；個別試讀及本機規劃紀錄不隨網站發布。

## 網站連結

本機開發預覽：執行 `pnpm dev` 後，開啟終端顯示的 Local 網址；預設為 [http://127.0.0.1:5173/](http://127.0.0.1:5173/)。

GitHub Pages：尚未部署。完成部署並驗證後，將以實際公開網址更新此處，提交並推送至 Repo。

## 技術基礎

- Node.js 24、pnpm 11.25.0、Vite。
- GSAP 與套件內含的 ScrollTrigger。
- Prettier、EditorConfig 與 Git。
- 後續規劃：Google 試算表與 Google Apps Script Web App 儲存觀展回饋。
- GitHub CLI 管理 Repo，GitHub Actions 建置並部署至 GitHub Pages。

目前已驗證的本機版本為 Node.js 24.19.0、pnpm 11.25.0、Vite 8.3.4、GSAP 3.15.0、Prettier 3.9.10 與 GitHub CLI 2.102.0。套件固定版本記錄於 package.json 與 pnpm-lock.yaml。

## 本機工具

本機 Node.js 與 pnpm 透過 `.tools/bin/` 連結至 Codex 隨附執行環境；GitHub CLI 亦放置於 `.tools/`。該目錄與快取皆不提交至 Repo。

在專案根目錄執行以下指令，讓目前終端使用這些工具：

```sh
export PATH="$PWD/.tools/bin:$PATH"
node --version
pnpm --version
gh --version
```

若 Codex 更新後執行環境路徑失效，請重新連結本機工具，或自行安裝 Node.js 24、pnpm 11.25.0 與 GitHub CLI。其他電腦也需自行安裝，`.tools/` 不隨 Git 複製。

## 套件與指令

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm format:check
```

開發、正式建置與正式產物預覽：

```sh
pnpm dev
pnpm build
pnpm preview
```

建置輸出目錄為 `dist/`，build 指令使用相對 base，支援 GitHub Pages 的 Repo 子路徑。原始碼及瀏覽器檢查記錄見 [網站實作說明](./docs/website.md)。

## Google 回饋串接

本輪依指示暫緩，網站沒有回饋表單、提交請求或 Google 串接。下列設定保留給後續階段。不安裝 Clasp；Google Apps Script 將直接在瀏覽器中的官方編輯器編輯與部署。

後續需確認試算表、回饋欄位、資料用途，以及 Web App 的存取設定。在 Apps Script 正式部署後，複製 `.env.example` 為 `.env.local`，將 `VITE_FEEDBACK_ENDPOINT` 設為正式 `/exec` 網址。

`VITE_` 環境變數會公開於前端，不能用於儲存憑證。跨來源請求及寫入結果須實測，不得把 `no-cors` 回應視為寫入成功。

## GitHub 與部署

使用 `main` 分支。部署工作流程見 [pages.yml](./.github/workflows/pages.yml)：在 Node.js 24 下使用固定版本的 pnpm 安裝鎖定相依、執行資料及格式檢查、建置並發布 `dist/`。建置工作僅讀取原始碼與 Pages 設定；部署工作使用 Pages 與 OIDC 權限。

```sh
gh auth status
```

如果尚未登入，可在自己的終端執行 `gh auth login --web --git-protocol https` 並完成 GitHub 驗證。不要把 Token 寫入專案檔案。

GitHub Pages 的發布來源須設為 GitHub Actions。`main` 的程式變更會自動部署，也可在 Actions 中手動執行。僅修改 Markdown 不重新部署網站。Google 回饋串接獨立留待後續。

## 已完成的驗證

- 已初始化本機 Git，分支為 `main`。
- 已安裝相依套件，並通過 `pnpm install --offline --frozen-lockfile`。
- 已通過 `pnpm format:check`，確認 ScrollTrigger 模組可解析。
- 已核對 GitHub CLI 官方 SHA-256，確認 CLI 可執行，並檢查登入狀態。
- 已確認本機工具、快取、相依套件與私人環境檔受到 Git 忽略規則保護。
- 網站已通過正式建置及 3 項資料測試；互動、鍵盤、來源視窗與 CSV 下載已在瀏覽器驗證。
- 檢查 320、390、768、1024、1440px 寬度，沒有整頁水平溢出；減少動態後可閱讀所有內容。
- GitHub Pages 公開部署、外部觀眾理解與 Google 回饋尚未驗證。

## 參考文件

- [Vite 入門](https://vite.dev/guide/)
- [Vite 部署至 GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)
- [GSAP 安裝與插件](https://gsap.com/docs/v3/Installation/)
- [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Google Apps Script Web Apps](https://developers.google.com/apps-script/guides/web)
- [GitHub CLI](https://github.com/cli/cli)
