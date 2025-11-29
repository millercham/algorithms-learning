import { useState, useCallback } from "preact/hooks";
import type { ArrayAlgorithmData } from "../../types/algorithm";
import { linearSearch } from "../../algorithms/linear-search";
import { useStepController } from "../../hooks/useStepController";
import { ArrayVisualizer } from "./ArrayVisualizer";
import { StepController } from "./StepController";

/**
 * ランダムな配列を生成
 */
function generateRandomArray(length: number, max = 99): number[] {
	return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
}

/**
 * 線形探索専用の可視化コンポーネント
 */
export function LinearSearchVisualizer() {
	const [data, setData] = useState<ArrayAlgorithmData>(linearSearch.initialData);

	const {
		currentStep,
		steps,
		isPlaying,
		next,
		prev,
		reset,
		togglePlay,
		updateData,
	} = useStepController(linearSearch, data);

	// ランダム配列を生成
	const handleRandomize = useCallback(() => {
		const newArray = generateRandomArray(9, 99);
		const newTarget = newArray[Math.floor(Math.random() * newArray.length)];
		const newData: ArrayAlgorithmData = {
			array: newArray,
			target: newTarget,
		};
		setData(newData);
		updateData(newData);
	}, [updateData]);

	// 現在のステップデータ
	const currentStepData = currentStep > 0 ? steps[currentStep - 1] : null;

	return (
		<div class="space-y-8">
			<ArrayVisualizer
				array={data.array}
				target={data.target}
				currentStep={currentStepData}
				onRandomize={handleRandomize}
			/>

			<StepController
				currentStep={currentStep}
				steps={steps}
				isPlaying={isPlaying}
				onNext={next}
				onPrev={prev}
				onReset={reset}
				onTogglePlay={togglePlay}
			/>
		</div>
	);
}

