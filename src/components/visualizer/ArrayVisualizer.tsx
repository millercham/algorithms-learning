import type { Step, ElementStatus } from "../../types/algorithm";
import { ArrayBox } from "./ArrayBox";

interface ArrayVisualizerProps {
	array: number[];
	target?: number;
	currentStep: Step | null;
	onRandomize?: () => void;
}

/**
 * 配列を可視化するコンポーネント
 */
export function ArrayVisualizer({
	array,
	target,
	currentStep,
	onRandomize,
}: ArrayVisualizerProps) {
	const getStatus = (index: number): ElementStatus => {
		if (!currentStep) return "default";
		return currentStep.statuses.get(index) || "default";
	};

	return (
		<div class="array-visualizer">
			{/* 目標値表示 */}
			{target !== undefined && (
				<div class="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mb-8">
					<div>
						<p class="text-neutral-600 text-sm mb-1">探索対象</p>
						<p class="text-3xl text-blue-600">
							目標値: <span class="font-bold">{target}</span>
						</p>
					</div>
					{onRandomize && (
						<button
							type="button"
							onClick={onRandomize}
							class="px-6 py-3 bg-white hover:bg-neutral-50 border-2 border-blue-300 rounded-lg transition-all hover:shadow-md flex items-center gap-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-5 h-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
								<path d="m18 2 4 4-4 4" />
								<path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
								<path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
								<path d="m18 14 4 4-4 4" />
							</svg>
							新しい配列を生成
						</button>
					)}
				</div>
			)}

			{/* 配列表示 */}
			<div class="p-6 md:p-10 bg-gradient-to-br from-white to-neutral-50 rounded-xl border-2 border-neutral-200 shadow-sm">
				<div class="flex flex-wrap gap-3 md:gap-4 justify-center items-end min-h-[200px]">
					{array.map((value, index) => (
						<ArrayBox
							key={index}
							value={value}
							index={index}
							status={getStatus(index)}
						/>
					))}
				</div>

				{/* 凡例 */}
				<div class="mt-8 flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded bg-yellow-400 border-2 border-yellow-500" />
						<span class="text-neutral-600">チェック中</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded bg-neutral-200 border-2 border-neutral-300" />
						<span class="text-neutral-600">探索済み</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded bg-green-500 border-2 border-green-600" />
						<span class="text-neutral-600">発見</span>
					</div>
				</div>
			</div>
		</div>
	);
}

