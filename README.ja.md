<div align="center">

# 🕐 Tableclock

**ディスプレイ・TVウォール・オフィス画面向けのカスタマイズ時計。**

[![ライブデモ](https://img.shields.io/badge/Live%20Demo-tableclock.io-000?style=for-the-badge&logo=vercel)](https://tableclock.io)
&nbsp;
[![Vercelでデプロイ](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ZIERA-io/Tableclock)

![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=white)

</div>

---

時計をデザインして、リンクでシェアするだけ。アプリもアカウントも不要 — すべての設定はURLに含まれています。

Supabaseを接続すると `tableclock.io/studio` のような短縮リンクとサーバーへのロゴアップロードが使えます。

---

## 機能

### 🕰️ 時計
| | |
|---|---|
| **モード** | アナログ / デジタル |
| **アナログスタイル** | クラシック · ミニマル · モダン · レトロ · スポーツ |
| **サイズ調整** | 40–130% |
| **時間オプション** | タイムゾーン、24時間表示、秒針、日付 |

### 🎨 外観
| | |
|---|---|
| **テーマ** | 12種のプリセット |
| **カラー** | 背景・文字盤・目盛り・針・アクセント・テキスト 6色個別調整 |
| **ロゴ** | テキスト/絵文字、画像URL、ファイルアップロード |
| **デジタルフォント** | 9種選択 |

### 🔗 シェア
- すべての設定をURLハッシュにエンコード — バックエンド不要
- Supabase接続で `tableclock.io/名前` の短縮リンク
- アップロード画像はSupabase Storageに保存されURLで配信

### 🌐 UI & 言語
- 韓国語・英語・日本語・中国語対応
- 3秒操作なしでコントロールが自動フェード

### 📺 ディスプレイ・TV向け
- **Wake Lock API** — スクリーンオフを防止、スクリーンセーバー不要
- **ネイティブFullscreen API** — ボタン一つでフルスクリーン
- アイドル時はコントロールが消える — ロビーや会議室にそのまま設置可能

---

## 始め方

```bash
git clone https://github.com/ZIERA-io/Tableclock.git
cd Tableclock
npm install
npm run dev
```

[http://localhost:5173](http://localhost:5173) を開き、時計をクリックして設定パネルを開きます。

```bash
npm run build   # 出力 → dist/
```

---

## 短縮リンクの設定（オプション）

Supabaseなしでも URLハッシュ方式でシェアできます。短縮リンクとサーバー画像保存が必要な場合はSupabaseを接続してください。

**1. プロジェクト作成** — [supabase.com](https://supabase.com)

**2. `.env` ファイルを作成:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**3. SQLスキーマを実行** — Supabase SQL Editorで ([`.env.example`](.env.example) 参照)

**4. `logos` ストレージバケット作成** — パブリックバケット、INSERTポリシー `true`

設定後:
- **リンク名** フィールドに好きな名前を入力（例: `studio`）
- **保存** をクリック → `https://tableclock.io/studio` が生成される
- 重複する名前はエラーで拒否; 匿名リンクは後から編集不可

---

## デプロイ

```bash
npx vercel --prod
```

`vercel.json` に短縮リンクのルーティングが含まれています。短縮リンクを使う場合は Vercel の環境変数に `VITE_SUPABASE_URL` と `VITE_SUPABASE_ANON_KEY` を追加してください。

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | Vite · React 18 · TypeScript |
| 時計レンダリング | SVG + `requestAnimationFrame`（60fps、React再レンダーなし） |
| バックエンド（任意） | Supabase（Postgres + Storage） |
| ホスティング | Vercel |
| アナリティクス | Vercel Analytics |

---

## 制作チーム

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Hael-o">
        <img src="https://avatars.githubusercontent.com/Hael-o?v=4" width="80px" alt="Hael-o" style="border-radius:50%"/><br/>
        <sub><b>Hael-o</b></sub>
      </a><br/>
      フロントエンド
    </td>
    <td align="center">
      <a href="https://github.com/sera03">
        <img src="https://avatars.githubusercontent.com/sera03?v=4" width="80px" alt="sera03" style="border-radius:50%"/><br/>
        <sub><b>sera03</b></sub>
      </a><br/>
      バックエンド
    </td>
    <td align="center">
      <a href="https://github.com/Dev-minu">
        <img src="https://avatars.githubusercontent.com/Dev-minu?v=4" width="80px" alt="Dev-minu" style="border-radius:50%"/><br/>
        <sub><b>Dev-minu</b></sub>
      </a><br/>
      デザイン & 企画
    </td>
  </tr>
</table>

---

[English](README.md) · [한국어](README.ko.md)
