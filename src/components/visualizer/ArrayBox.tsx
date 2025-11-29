import { useEffect, useRef } from "preact/hooks";
import type { ElementStatus } from "../../types/algorithm";

interface ArrayBoxProps {
	value: number;
	index: number;
	status: ElementStatus;
	label?: string;
}

/**
 * 配列の1要素を表示するボックス
 */
export function ArrayBox({ value, index, status, label }: ArrayBoxProps) {
	const boxRef = useRef<HTMLDivElement>(null);
	const prevStatusRef = useRef<ElementStatus>(status);

	// ステータス変更時にアニメーション効果を追加
	useEffect(() => {
		const box = boxRef.current;
		if (!box) return;

		// 新しいステータスに変わった時のみアニメーション
		if (prevStatusRef.current !== status) {
			// checking または found になった時にバウンスアニメーション
			if (status === "checking" || status === "found") {
				box.animate(
					[
						{ transform: "scale(1)" },
						{ transform: "scale(1.2)" },
						{ transform: "scale(1.1)" },
					],
					{
						duration: 300,
						easing: "ease-out",
					},
				);
			}
			prevStatusRef.current = status;
		}
	}, [status]);

	// ベーススタイル
	const baseStyle =
		"w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-xl border-2 shadow-md";

	// ステータスごとのスタイル（transform は inline style で制御）
	const statusStyles: Record<ElementStatus, string> = {
		default: "bg-neutral-100 border-neutral-300 text-neutral-600",
		checking: "bg-yellow-400 border-yellow-500 text-neutral-900 shadow-lg",
		checked: "bg-neutral-200 border-neutral-300 text-neutral-500",
		found: "bg-green-500 border-green-600 text-white shadow-lg",
		comparing: "bg-blue-400 border-blue-500 text-white",
		swapping: "bg-purple-400 border-purple-500 text-white",
		sorted: "bg-green-200 border-green-300 text-green-800",
	};

	const labelStyles: Record<ElementStatus, string> = {
		default: "",
		checking: "bg-white border-neutral-300 text-neutral-600",
		checked: "bg-neutral-100 border-neutral-200 text-neutral-500",
		found: "bg-green-100 border-green-300 text-green-700",
		comparing: "bg-blue-100 border-blue-300 text-blue-700",
		swapping: "bg-purple-100 border-purple-300 text-purple-700",
		sorted: "bg-green-100 border-green-300 text-green-700",
	};

	const labelTexts: Record<ElementStatus, string> = {
		default: "",
		checking: "チェック中",
		checked: "探索済み",
		found: "発見！",
		comparing: "比較中",
		swapping: "交換中",
		sorted: "ソート済み",
	};

	const displayLabel = label || labelTexts[status];

	// スケール値
	const scale = status === "checking" || status === "found" ? 1.1 : 1;

	return (
		<div class="flex flex-col items-center gap-2">
			{/* ラベル */}
			<div class="h-6 flex items-center">
				{displayLabel && (
					<div
						class={`text-xs px-2 py-1 rounded border transition-all duration-300 ${labelStyles[status]}`}
					>
						{displayLabel}
					</div>
				)}
			</div>

			{/* ボックス */}
			<div
				ref={boxRef}
				class={`${baseStyle} ${statusStyles[status]}`}
				style={{
					transform: `scale(${scale})`,
					transition: "all 0.3s ease-out",
				}}
			>
				<span class="text-xl md:text-2xl font-medium">{value}</span>
			</div>

			{/* インデックス */}
			<div class="flex flex-col items-center gap-0.5">
				<span class="text-xs text-neutral-400">index</span>
				<span class="text-sm text-neutral-600 font-mono bg-neutral-100 px-2 py-0.5 rounded">
					{index}
				</span>
			</div>
		</div>
	);
}
