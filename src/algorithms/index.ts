import type { AlgorithmRegistry } from "../types/algorithm";
import { linearSearch } from "./linear-search";

/**
 * 登録されているすべてのアルゴリズム
 */
export const algorithms: AlgorithmRegistry = {
	"linear-search": linearSearch,
};

/**
 * IDからアルゴリズムを取得
 */
export function getAlgorithm(id: string) {
	return algorithms[id];
}

/**
 * すべてのアルゴリズムIDを取得
 */
export function getAllAlgorithmIds(): string[] {
	return Object.keys(algorithms);
}

/**
 * カテゴリでフィルタリング
 */
export function getAlgorithmsByCategory(category: string) {
	return Object.values(algorithms).filter((algo) => algo.category === category);
}

