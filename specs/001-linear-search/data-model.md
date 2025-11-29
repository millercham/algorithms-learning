# データモデル: 線形探索 (Linear Search) ページ

**ブランチ (Branch)**: `001-linear-search`  
**作成日 (Date)**: 2025-11-28  
**ステータス (Status)**: 完了

## 概要

線形探索ページで使用するデータ構造を定義する。**React は使用せず**、vanilla TypeScript でクライアントサイドの状態を管理する。状態はすべてモジュールスコープの変数として保持し、永続化は行わない。

---

## エンティティ定義

### 1. SearchStep（探索ステップ）

探索アルゴリズムの1ステップを表現するデータ構造。

```typescript
/**
 * 探索の1ステップを表すデータ
 */
export interface SearchStep {
  /** チェック中のインデックス位置 (0-indexed) */
  index: number;
  
  /** チェック中の要素の値 */
  current: number;
  
  /** 目標値と一致したかどうか */
  found: boolean;
}
```

**フィールド説明**:

| フィールド | 型 | 説明 | 制約 |
|-----------|-----|------|------|
| `index` | `number` | 配列内のインデックス | 0 ≤ index < array.length |
| `current` | `number` | 該当インデックスの要素値 | array[index] と同値 |
| `found` | `boolean` | 目標値と一致したか | true なら探索終了 |

**生成ルール**:
- 配列の先頭から順に1要素ずつステップを生成
- `found: true` のステップで生成を終了
- 見つからない場合は全要素分のステップを生成

---

### 2. SearchState（探索状態）

可視化の現在の状態を表現。モジュールスコープの変数として管理。

```typescript
/**
 * 可視化の現在の状態
 */
interface SearchState {
  /** 探索対象の配列 */
  array: number[];
  
  /** 探索する目標値 */
  target: number;
  
  /** 生成済みのステップ配列 */
  steps: SearchStep[];
  
  /** 現在表示中のステップ位置 (0 = 初期状態、1以上 = steps[currentStep-1] を表示) */
  currentStep: number;
  
  /** 自動再生中かどうか */
  isPlaying: boolean;
  
  /** 目標値が見つかったインデックス（見つかっていない場合は undefined） */
  foundIndex: number | undefined;
}
```

**フィールド説明**:

| フィールド | 型 | 初期値 | 説明 |
|-----------|-----|--------|------|
| `array` | `number[]` | `[23, 45, 12, 78, 34, 56, 89, 23, 67]` | 探索対象配列 |
| `target` | `number` | `34` | 探索する目標値 |
| `steps` | `SearchStep[]` | `[]`（runSearch で生成） | 探索ステップの配列 |
| `currentStep` | `number` | `0` | 現在のステップ位置 |
| `isPlaying` | `boolean` | `false` | 自動再生中フラグ |
| `foundIndex` | `number \| undefined` | `undefined` | 発見時のインデックス |

---

### 3. DOM 要素の構造

Astro コンポーネントで生成される HTML 構造と、JavaScript からアクセスするための属性。

#### 配列要素のボックス

```html
<div 
  class="array-box"
  data-index="0"
  data-value="23"
>
  <span class="value">23</span>
  <span class="index">0</span>
</div>
```

**data 属性**:

| 属性 | 説明 | 用途 |
|------|------|------|
| `data-index` | 配列内のインデックス | JavaScript から要素を選択 |
| `data-value` | 要素の値 | デバッグ用 |

#### ステップ制御ボタン

```html
<button id="btn-play" aria-label="再生">...</button>
<button id="btn-pause" aria-label="一時停止">...</button>
<button id="btn-next" aria-label="次へ">...</button>
<button id="btn-prev" aria-label="前へ">...</button>
<button id="btn-reset" aria-label="リセット">...</button>
<button id="btn-randomize" aria-label="新しい配列を生成">...</button>
```

#### 情報表示エリア

```html
<div id="target-display">目標値: <span id="target-value">34</span></div>
<div id="step-display">ステップ: <span id="current-step">0</span> / <span id="total-steps">9</span></div>
<div id="progress-bar"><div id="progress-fill"></div></div>
<div id="step-info"><!-- 現在のステップ情報 --></div>
<div id="result-message"><!-- 結果メッセージ --></div>
```

---

### 4. 視覚的状態マッピング

JavaScript で要素のスタイルを更新する際の状態マッピング。

| 条件 | CSS クラス | 背景色 | 追加効果 |
|------|-----------|--------|----------|
| `index === foundIndex` | `.found` | green-500/600 | ラベル「発見！」 |
| `index === currentIndex` | `.checking` | yellow-400/amber-400 | scale: 1.15, ラベル「チェック中」 |
| `index < currentIndex` | `.checked` | neutral-200 | ラベル「探索済み」 |
| その他 | `.default` | neutral-100 | ラベルなし |

---

### 5. ボタン状態ロジック

各ボタンの有効/無効状態を決定するロジック。

| ボタン | 有効条件 | 無効時の処理 |
|--------|----------|--------------|
| 再生 | `!isPlaying && currentStep < totalSteps` | `disabled` 属性を追加 |
| 一時停止 | `isPlaying` | `disabled` 属性を追加 |
| 次へ | `currentStep < totalSteps` | `disabled` 属性を追加 |
| 前へ | `currentStep > 0` | `disabled` 属性を追加 |
| リセット | `currentStep > 0` | `disabled` 属性を追加 |
| 新しい配列 | 常に有効 | - |

---

## 状態遷移図

```
[初期状態]
    │
    │ ページロード / runSearch()
    ▼
[ステップ0: 待機中]
    │
    ├─── 「次へ」クリック ───► [ステップ1: index 0 をチェック中]
    │                              │
    │                              ├─── 一致 ───► [探索完了: 発見]
    │                              │
    │                              └─── 不一致 ───► [ステップ2: index 1 をチェック中]
    │                                                  │
    │                                                  └─── ... 繰り返し ...
    │
    ├─── 「再生」クリック ───► [自動再生中] ◄─── 「一時停止」で停止
    │
    └─── 「新しい配列」クリック ───► [新しい配列で初期状態]

[探索完了: 発見] or [探索完了: 未発見]
    │
    └─── 「リセット」クリック ───► [ステップ0: 待機中]
```

---

## バリデーションルール

### 配列生成時

- 配列長: 1 ≤ length ≤ 20（推奨: 9）
- 要素値: 1 ≤ value ≤ 99
- 目標値: 配列内の要素から選択（発見可能を保証）

### ステップ操作時

- `currentStep` は 0 ≤ currentStep ≤ steps.length の範囲
- 「前へ」は `currentStep > 0` のときのみ有効
- 「次へ」は `currentStep < steps.length` のときのみ有効

---

## 関数シグネチャ

### linearSearch（アルゴリズムロジック）

```typescript
// src/utils/algorithms/linearSearch.ts

/**
 * 線形探索を実行し、ステップ履歴を返す
 * @param array 探索対象の配列
 * @param target 探索する目標値
 * @returns 探索ステップの配列（発見時はその時点で終了）
 */
export function linearSearch(array: number[], target: number): SearchStep[];

/**
 * ランダムな配列を生成する
 * @param length 配列の長さ
 * @param max 要素の最大値（デフォルト: 100）
 * @returns ランダムな数値の配列
 */
export function generateRandomArray(length: number, max?: number): number[];
```

### コントローラー関数（UI 制御）

```typescript
// src/scripts/linear-search-controller.ts

/** 探索を初期化し、ステップを生成 */
function runSearch(): void;

/** 次のステップへ進む */
function handleNext(): void;

/** 前のステップへ戻る */
function handlePrev(): void;

/** 初期状態にリセット */
function handleReset(): void;

/** 自動再生の開始/停止を切り替え */
function handlePlayPause(): void;

/** 新しい配列を生成 */
function handleRandomize(): void;

/** UI を現在の状態に同期 */
function updateUI(): void;

/** アニメーション付きで要素をハイライト */
async function highlightElement(index: number, status: 'checking' | 'checked' | 'found'): Promise<void>;
```
