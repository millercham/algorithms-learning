import { useState, useCallback } from "preact/hooks";
import type { AlgorithmDefinition, ArrayAlgorithmData } from "../../types/algorithm";
import { useStepController } from "../../hooks/useStepController";
import { ArrayVisualizer } from "./ArrayVisualizer";
import { StepController } from "./StepController";

interface AlgorithmVisualizerProps {
	algorithm: AlgorithmDefinition<ArrayAlgorithmData>;
}

/**
 * ランダムな配列を生成
 */
function generateRandomArray(length: number, max = 99): number[] {
	return Array.from({ length }, () => Math.floor(Math.random() * max) + 1);
}

/**
 * アルゴリズム可視化のメインコンポーネント
 */
export function AlgorithmVisualizer({ algorithm }: AlgorithmVisualizerProps) {
	const [data, setData] = useState<ArrayAlgorithmData>(algorithm.initialData);

	const {
		currentStep,
		steps,
		isPlaying,
		next,
		prev,
		reset,
		togglePlay,
		updateData,
	} = useStepController(algorithm, data);

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

