/**
 * Linear Search Algorithm
 * 配列を先頭から順に探索する
 */

export interface SearchStep {
	/** チェック中のインデックス位置 */
	index: number;
	/** チェック中の要素の値 */
	current: number;
	/** 目標値と一致したかどうか */
	found: boolean;
}

/**
 * 線形探索を実行し、ステップ履歴を返す
 * @param array 探索対象の配列
 * @param target 探索する目標値
 * @returns 探索ステップの配列（発見時はその時点で終了）
 */
export function linearSearch(array: number[], target: number): SearchStep[] {
	const steps: SearchStep[] = [];

	for (let i = 0; i < array.length; i++) {
		const found = array[i] === target;
		steps.push({
			index: i,
			current: array[i],
			found,
		});

		if (found) {
			break;
		}
	}

	return steps;
}

/**
 * ランダムな配列を生成する
 * @param length 配列の長さ
 * @param max 要素の最大値（デフォルト: 99）
 * @returns ランダムな数値の配列
 */
export function generateRandomArray(length: number, max = 99): number[] {
	return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
}
