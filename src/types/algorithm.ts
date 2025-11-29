/**
 * アルゴリズム可視化の共通型定義
 */

/** 可視化タイプ */
export type VisualizerType = "array" | "graph" | "tree" | "grid";

/** 要素の状態 */
export type ElementStatus =
	| "default"
	| "checking"
	| "checked"
	| "found"
	| "comparing"
	| "swapping"
	| "sorted";

/** ステップの定義 */
export interface Step {
	/** ハイライトする要素のインデックス */
	highlights: number[];
	/** 各要素の状態マップ */
	statuses: Map<number, ElementStatus>;
	/** ステップの説明 */
	description: string;
	/** 比較中の値（オプション） */
	comparingValue?: number;
	/** 発見したかどうか */
	found?: boolean;
}

/** アルゴリズムのカテゴリ */
export type AlgorithmCategory = "search" | "sort" | "graph" | "tree" | "other";

/** 計算量の定義 */
export interface Complexity {
	time: {
		best: string;
		average: string;
		worst: string;
	};
	space: string;
}

/** アルゴリズム定義 */
export interface AlgorithmDefinition<TData = unknown> {
	/** 一意の識別子（URL スラッグ） */
	id: string;
	/** 表示名 */
	name: string;
	/** カテゴリ */
	category: AlgorithmCategory;
	/** 可視化タイプ */
	visualizer: VisualizerType;
	/** 説明文 */
	description: string;
	/** 初期データ */
	initialData: TData;
	/** ステップ生成関数 */
	generateSteps: (data: TData) => Step[];
	/** 計算量 */
	complexity: Complexity;
	/** コード例 */
	code: string;
	/** 使用場面 */
	useCases: string[];
}

/** 配列アルゴリズム用のデータ型 */
export interface ArrayAlgorithmData {
	array: number[];
	target?: number;
}

/** アルゴリズム定義の登録用型 */
export type AlgorithmRegistry = Record<string, AlgorithmDefinition<unknown>>;

