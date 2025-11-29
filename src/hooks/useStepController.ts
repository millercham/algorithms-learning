import { useState, useCallback, useRef, useEffect } from "preact/hooks";
import type { Step, AlgorithmDefinition } from "../types/algorithm";

/** ステップコントローラーの状態 */
export interface StepControllerState {
	/** 現在のステップインデックス */
	currentStep: number;
	/** 全ステップ */
	steps: Step[];
	/** 再生中かどうか */
	isPlaying: boolean;
	/** 再生速度（ms） */
	playSpeed: number;
}

/** ステップコントローラーの操作 */
export interface StepControllerActions {
	/** 次のステップへ */
	next: () => void;
	/** 前のステップへ */
	prev: () => void;
	/** リセット */
	reset: () => void;
	/** 再生/一時停止の切り替え */
	togglePlay: () => void;
	/** 再生開始 */
	play: () => void;
	/** 一時停止 */
	pause: () => void;
	/** 再生速度を設定 */
	setPlaySpeed: (speed: number) => void;
	/** データを更新してステップを再生成 */
	updateData: <T>(newData: T) => void;
}

/** useStepController の戻り値 */
export type UseStepControllerReturn = StepControllerState & StepControllerActions;

/**
 * ステップ制御のカスタムフック
 * @param algorithm アルゴリズム定義
 * @param initialData 初期データ（オプション）
 */
export function useStepController<TData>(
	algorithm: AlgorithmDefinition<TData>,
	initialData?: TData
): UseStepControllerReturn {
	const data = initialData ?? algorithm.initialData;
	const [steps, setSteps] = useState<Step[]>(() =>
		algorithm.generateSteps(data)
	);
	const [currentStep, setCurrentStep] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [playSpeed, setPlaySpeed] = useState(800);

	const intervalRef = useRef<number | null>(null);

	// 再生を停止
	const stopPlayback = useCallback(() => {
		if (intervalRef.current !== null) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setIsPlaying(false);
	}, []);

	// 次のステップへ
	const next = useCallback(() => {
		setCurrentStep((prev) => {
			if (prev < steps.length) {
				return prev + 1;
			}
			return prev;
		});
	}, [steps.length]);

	// 前のステップへ
	const prev = useCallback(() => {
		setCurrentStep((prev) => {
			if (prev > 0) {
				return prev - 1;
			}
			return prev;
		});
	}, []);

	// リセット
	const reset = useCallback(() => {
		stopPlayback();
		setCurrentStep(0);
	}, [stopPlayback]);

	// 再生開始
	const play = useCallback(() => {
		if (currentStep >= steps.length) {
			return;
		}

		setIsPlaying(true);
		intervalRef.current = window.setInterval(() => {
			setCurrentStep((prev) => {
				if (prev < steps.length) {
					return prev + 1;
				}
				stopPlayback();
				return prev;
			});
		}, playSpeed);
	}, [currentStep, steps.length, playSpeed, stopPlayback]);

	// 一時停止
	const pause = useCallback(() => {
		stopPlayback();
	}, [stopPlayback]);

	// 再生/一時停止の切り替え
	const togglePlay = useCallback(() => {
		if (isPlaying) {
			pause();
		} else {
			play();
		}
	}, [isPlaying, play, pause]);

	// データを更新してステップを再生成
	const updateData = useCallback(
		<T>(newData: T) => {
			stopPlayback();
			const newSteps = algorithm.generateSteps(newData as TData);
			setSteps(newSteps);
			setCurrentStep(0);
		},
		[algorithm, stopPlayback]
	);

	// 再生速度変更時に再生中なら再開
	useEffect(() => {
		if (isPlaying) {
			stopPlayback();
			play();
		}
	}, [playSpeed]);

	// 最後のステップに達したら停止
	useEffect(() => {
		if (currentStep >= steps.length && isPlaying) {
			stopPlayback();
		}
	}, [currentStep, steps.length, isPlaying, stopPlayback]);

	// クリーンアップ
	useEffect(() => {
		return () => {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	return {
		currentStep,
		steps,
		isPlaying,
		playSpeed,
		next,
		prev,
		reset,
		togglePlay,
		play,
		pause,
		setPlaySpeed,
		updateData,
	};
}

