import type { Step } from "../../types/algorithm";

interface StepControllerProps {
	currentStep: number;
	steps: Step[];
	isPlaying: boolean;
	onNext: () => void;
	onPrev: () => void;
	onReset: () => void;
	onTogglePlay: () => void;
}

/**
 * ステップ制御コンポーネント
 */
export function StepController({
	currentStep,
	steps,
	isPlaying,
	onNext,
	onPrev,
	onReset,
	onTogglePlay,
}: StepControllerProps) {
	const totalSteps = steps.length;
	const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
	const currentStepData = currentStep > 0 ? steps[currentStep - 1] : null;

	const isAtStart = currentStep === 0;
	const isAtEnd = currentStep >= totalSteps;

	return (
		<div class="space-y-4">
			{/* コントローラー */}
			<div class="flex flex-col gap-4 p-6 bg-white rounded-lg border border-neutral-200">
				<div class="flex items-center justify-between">
					<span class="text-neutral-600">
						ステップ:{" "}
						<span class="text-blue-600 font-semibold">{currentStep}</span> /{" "}
						{totalSteps}
					</span>

					<div class="flex gap-2">
						{/* リセット */}
						<button
							type="button"
							onClick={onReset}
							disabled={isAtStart}
							class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
							aria-label="リセット"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-4 h-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
								<path d="M3 3v5h5" />
							</svg>
							リセット
						</button>

						{/* 前へ */}
						<button
							type="button"
							onClick={onPrev}
							disabled={isAtStart}
							class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
							aria-label="前へ"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-4 h-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<polygon points="19 20 9 12 19 4 19 20" />
								<line x1="5" y1="19" x2="5" y2="5" />
							</svg>
							前へ
						</button>

						{/* 再生/一時停止 */}
						<button
							type="button"
							onClick={onTogglePlay}
							disabled={isAtEnd && !isPlaying}
							class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
							aria-label={isPlaying ? "一時停止" : "再生"}
						>
							{isPlaying ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-4 h-4"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<rect x="6" y="4" width="4" height="16" />
									<rect x="14" y="4" width="4" height="16" />
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-4 h-4"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<polygon points="5 3 19 12 5 21 5 3" />
								</svg>
							)}
							{isPlaying ? "一時停止" : "再生"}
						</button>

						{/* 次へ */}
						<button
							type="button"
							onClick={onNext}
							disabled={isAtEnd}
							class="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
							aria-label="次へ"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-4 h-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<polygon points="5 4 15 12 5 20 5 4" />
								<line x1="19" y1="5" x2="19" y2="19" />
							</svg>
							次へ
						</button>
					</div>
				</div>

				{/* プログレスバー */}
				<div class="relative w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
					<div
						class="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			{/* ステップ情報 */}
			{currentStepData && (
				<div
					class="p-6 bg-white rounded-xl border-2 border-blue-200 shadow-sm animate-fade-in"
					key={currentStep}
				>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-neutral-500 mb-1">現在のステップ</p>
							<p class="text-lg text-neutral-800">
								{currentStepData.description}
							</p>
						</div>
						<div
							class={`px-6 py-3 rounded-lg text-lg transition-all duration-300 ${
								currentStepData.found
									? "bg-green-100 text-green-700"
									: "bg-neutral-100 text-neutral-600"
							}`}
						>
							{currentStepData.found ? "✓ 発見！" : "一致しません"}
						</div>
					</div>
				</div>
			)}

			{/* 完了メッセージ */}
			{isAtEnd && totalSteps > 0 && (
				<div
					class={`p-6 rounded-xl border-2 ${
						steps[totalSteps - 1]?.found
							? "bg-green-50 border-green-300"
							: "bg-red-50 border-red-300"
					}`}
				>
					<p
						class={`text-xl ${
							steps[totalSteps - 1]?.found ? "text-green-800" : "text-red-800"
						}`}
					>
						{steps[totalSteps - 1]?.found
							? "✓ 探索完了: 目標値が見つかりました！"
							: "✗ 探索完了: 目標値は見つかりませんでした"}
					</p>
				</div>
			)}
		</div>
	);
}
