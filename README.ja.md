# Tempus

ブラウザで動くカスタマイズ時計です。色、フォント、文字盤のデザイン、ロゴを好きなように組み合わせて、URLひとつでシェアできます。設定がリンクの中に丸ごと入っているので、アカウントもサーバーも要りません。

## 機能

- アナログ / デジタル切り替え
- アナログ文字盤5種 — クラシック、ミニマル、モダン、レトロ、スポーツ
- 背景・文字盤・目盛・針・アクセント・テキストの6色を個別調整
- ロゴ設定 — テキスト/絵文字、画像URL、ファイルアップロード
- 設定をURLハッシュにエンコードしてシェア — アカウント不要
- Supabase接続で `/a/名前` 形式の短縮リンクに対応
- フルスクリーン、タイムゾーン、24時間表示、日付・秒、フォント選択

## 始め方

```bash
npm install
npm run dev
```

http://localhost:5173 を開いてください。

## ビルド

```bash
npm run build
```

成果物は `dist/` に出力されます。

## 短縮リンク（オプション）

デフォルトのシェア方法はURLハッシュ形式です。画像アップロード時はリンクが長くなりますが、Supabaseを接続することで `/a/名前` 形式の短縮リンクが使えます。

```env
# .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

SQLスキーマは `.env.example` を参照してください。

## デプロイ

`vercel.json` に `/a/*` パスのSPAルーティング設定が含まれています。

```bash
npx vercel --prod
```

## 技術スタック

Vite · React 18 · TypeScript · Supabase（オプション）

---

[English](README.md) · [한국어](README.ko.md)
