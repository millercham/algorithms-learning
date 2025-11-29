import type {
	AlgorithmDefinition,
	ArrayAlgorithmData,
	Step,
	ElementStatus,
} from "../types/algorithm";

/**
 * 線形探索アルゴリズムの定義
 */
export const linearSearch: AlgorithmDefinition<ArrayAlgorithmData> = {
	id: "linear-search",
	name: "線形探索 (Linear Search)",
	category: "search",
	visualizer: "array",
	description: "配列の先頭から順番に目標値を探すシンプルなアルゴリズム",

	initialData: {
		array: [23, 45, 12, 78, 34, 56, 89, 23, 67],
		target: 34,
	},

	generateSteps: (data: ArrayAlgorithmData): Step[] => {
		const { array, target } = data;
		if (target === undefined) return [];

		const steps: Step[] = [];

		for (let i = 0; i < array.length; i++) {
			const statuses = new Map<number, ElementStatus>();

			// 探索済みの要素をマーク
			for (let j = 0; j < i; j++) {
				statuses.set(j, "checked");
			}

			const found = array[i] === target;
			statuses.set(i, found ? "found" : "checking");

			steps.push({
				highlights: [i],
				statuses,
				description: found
					? `インデックス ${i} で目標値 ${target} を発見！`
					: `インデックス ${i} をチェック: ${array[i]} ≠ ${target}`,
				comparingValue: array[i],
				found,
			});

			if (found) break;
		}

		return steps;
	},

	complexity: {
		time: {
			best: "O(1)",
			average: "O(n)",
			worst: "O(n)",
		},
		space: "O(1)",
	},

	code: `function linearSearch(array: number[], target: number): number {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === target) {
      return i;  // 発見: インデックスを返す
    }
  }
  return -1;  // 見つからない場合
}`,

	useCases: [
		"小さな配列の探索",
		"ソートされていないデータ",
		"最初に見つかった要素を返したい場合",
	],
};

