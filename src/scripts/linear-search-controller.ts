import { animate } from 'motion';
import { linearSearch, generateRandomArray, type SearchStep } from '../utils/algorithms/linearSearch';

// 状態
interface State {
  array: number[];
  target: number;
  steps: SearchStep[];
  currentStep: number;
  isPlaying: boolean;
  foundIndex: number | undefined;
  playInterval: number | null;
}

const state: State = {
  array: [],
  target: 0,
  steps: [],
  currentStep: 0,
  isPlaying: false,
  foundIndex: undefined,
  playInterval: null,
};

// DOM 要素
let elements: {
  arrayContainer: HTMLElement | null;
  currentStepEl: HTMLElement | null;
  totalStepsEl: HTMLElement | null;
  progressFill: HTMLElement | null;
  targetValue: HTMLElement | null;
  stepInfo: HTMLElement | null;
  infoIndex: HTMLElement | null;
  infoValue: HTMLElement | null;
  infoResult: HTMLElement | null;
  resultMessage: HTMLElement | null;
  resultText: HTMLElement | null;
  btnPlay: HTMLButtonElement | null;
  btnPlayText: HTMLElement | null;
  iconPlay: HTMLElement | null;
  iconPause: HTMLElement | null;
  btnNext: HTMLButtonElement | null;
  btnPrev: HTMLButtonElement | null;
  btnReset: HTMLButtonElement | null;
  btnRandomize: HTMLButtonElement | null;
};

/**
 * 初期化
 */
export function init(initialArray: number[], initialTarget: number): void {
  state.array = initialArray;
  state.target = initialTarget;

  // DOM 要素を取得
  elements = {
    arrayContainer: document.getElementById('array-container'),
    currentStepEl: document.getElementById('current-step'),
    totalStepsEl: document.getElementById('total-steps'),
    progressFill: document.getElementById('progress-fill'),
    targetValue: document.getElementById('target-value'),
    stepInfo: document.getElementById('step-info'),
    infoIndex: document.getElementById('info-index'),
    infoValue: document.getElementById('info-value'),
    infoResult: document.getElementById('info-result'),
    resultMessage: document.getElementById('result-message'),
    resultText: document.getElementById('result-text'),
    btnPlay: document.getElementById('btn-play') as HTMLButtonElement,
    btnPlayText: document.getElementById('btn-play-text'),
    iconPlay: document.getElementById('icon-play'),
    iconPause: document.getElementById('icon-pause'),
    btnNext: document.getElementById('btn-next') as HTMLButtonElement,
    btnPrev: document.getElementById('btn-prev') as HTMLButtonElement,
    btnReset: document.getElementById('btn-reset') as HTMLButtonElement,
    btnRandomize: document.getElementById('btn-randomize') as HTMLButtonElement,
  };

  // 探索を実行
  runSearch();

  // イベントリスナーをバインド
  bindEvents();
}

/**
 * 探索を実行してステップを生成
 */
function runSearch(): void {
  state.steps = linearSearch(state.array, state.target);
  state.currentStep = 0;
  state.isPlaying = false;
  state.foundIndex = undefined;

  const found = state.steps.find((step) => step.found);
  if (found) {
    state.foundIndex = found.index;
  }

  updateUI();
  resetArrayVisuals();
}

/**
 * イベントリスナーをバインド
 */
function bindEvents(): void {
  elements.btnPlay?.addEventListener('click', handlePlayPause);
  elements.btnNext?.addEventListener('click', handleNext);
  elements.btnPrev?.addEventListener('click', handlePrev);
  elements.btnReset?.addEventListener('click', handleReset);
  elements.btnRandomize?.addEventListener('click', handleRandomize);
}

/**
 * 次のステップへ
 */
async function handleNext(): Promise<void> {
  if (state.currentStep < state.steps.length) {
    state.currentStep++;
    await animateStep();
    updateUI();
  }
}

/**
 * 前のステップへ
 */
async function handlePrev(): Promise<void> {
  if (state.currentStep > 0) {
    state.currentStep--;
    await revertStep();
    updateUI();
  }
}

/**
 * リセット
 */
function handleReset(): void {
  stopPlaying();
  state.currentStep = 0;
  resetArrayVisuals();
  updateUI();
}

/**
 * 再生/一時停止
 */
function handlePlayPause(): void {
  if (state.isPlaying) {
    stopPlaying();
  } else {
    startPlaying();
  }
  updateUI();
}

/**
 * 自動再生を開始
 */
function startPlaying(): void {
  if (state.currentStep >= state.steps.length) return;

  state.isPlaying = true;
  state.playInterval = window.setInterval(async () => {
    if (state.currentStep < state.steps.length) {
      state.currentStep++;
      await animateStep();
      updateUI();
    } else {
      stopPlaying();
    }
  }, 800);
}

/**
 * 自動再生を停止
 */
function stopPlaying(): void {
  state.isPlaying = false;
  if (state.playInterval) {
    clearInterval(state.playInterval);
    state.playInterval = null;
  }
}

/**
 * ランダムな配列を生成
 */
function handleRandomize(): void {
  stopPlaying();
  state.array = generateRandomArray(9, 99);
  state.target = state.array[Math.floor(Math.random() * state.array.length)];

  // 配列を再描画
  renderArray();
  runSearch();
}

/**
 * 配列を再描画
 */
function renderArray(): void {
  if (!elements.arrayContainer) return;

  elements.arrayContainer.innerHTML = state.array
    .map(
      (value, index) => `
      <div class="flex flex-col items-center gap-3">
        <div class="label-container h-6"></div>
        <div
          class="array-box w-20 h-20 flex items-center justify-center rounded-xl border-2 border-neutral-300 bg-neutral-100 text-neutral-600 shadow-md transition-all duration-300"
          data-index="${index}"
          data-value="${value}"
        >
          <span class="text-2xl">${value}</span>
        </div>
        <div class="flex flex-col items-center gap-1">
          <span class="text-xs text-neutral-400">index</span>
          <span class="text-sm text-neutral-600 font-mono bg-neutral-100 px-2 py-0.5 rounded">${index}</span>
        </div>
      </div>
    `
    )
    .join('');

  // 目標値を更新
  if (elements.targetValue) {
    elements.targetValue.textContent = state.target.toString();
  }
}

/**
 * 現在のステップをアニメーション
 */
async function animateStep(): Promise<void> {
  if (state.currentStep === 0 || state.currentStep > state.steps.length) return;

  const step = state.steps[state.currentStep - 1];
  const box = document.querySelector(`[data-index="${step.index}"]`) as HTMLElement;
  const labelContainer = box?.parentElement?.querySelector('.label-container') as HTMLElement;

  if (!box) return;

  // 前の要素をグレーアウト
  if (state.currentStep > 1) {
    const prevStep = state.steps[state.currentStep - 2];
    const prevBox = document.querySelector(`[data-index="${prevStep.index}"]`) as HTMLElement;
    if (prevBox && !prevStep.found) {
      await animate(
        prevBox,
        {
          scale: 1,
          backgroundColor: '#e5e5e5',
          borderColor: '#d4d4d4',
        },
        { duration: 0.2 }
      ).finished;
      prevBox.classList.remove('text-neutral-900');
      prevBox.classList.add('text-neutral-500');

      // ラベルを更新
      const prevLabelContainer = prevBox.parentElement?.querySelector('.label-container') as HTMLElement;
      if (prevLabelContainer) {
        prevLabelContainer.innerHTML =
          '<div class="text-xs px-2 py-1 bg-neutral-100 rounded border border-neutral-200 text-neutral-500">探索済み</div>';
      }
    }
  }

  // 現在の要素をハイライト
  if (step.found) {
    await animate(
      box,
      {
        scale: 1.15,
        backgroundColor: '#22c55e',
        borderColor: '#16a34a',
      },
      { duration: 0.4, easing: 'ease-out' }
    ).finished;
    box.classList.remove('text-neutral-600');
    box.classList.add('text-white');

    if (labelContainer) {
      labelContainer.innerHTML =
        '<div class="text-xs px-2 py-1 bg-green-100 rounded border border-green-300 text-green-700">発見！</div>';
    }
  } else {
    await animate(
      box,
      {
        scale: 1.15,
        backgroundColor: '#facc15',
        borderColor: '#eab308',
      },
      { duration: 0.4, easing: 'ease-out' }
    ).finished;
    box.classList.remove('text-neutral-600');
    box.classList.add('text-neutral-900');

    if (labelContainer) {
      labelContainer.innerHTML =
        '<div class="text-xs px-2 py-1 bg-white rounded border border-neutral-300 text-neutral-600">チェック中</div>';
    }
  }
}

/**
 * ステップを戻すアニメーション
 */
async function revertStep(): Promise<void> {
  // 現在のステップ以降のすべての要素をリセット
  for (let i = state.currentStep; i < state.steps.length; i++) {
    const step = state.steps[i];
    const box = document.querySelector(`[data-index="${step.index}"]`) as HTMLElement;
    const labelContainer = box?.parentElement?.querySelector('.label-container') as HTMLElement;

    if (box) {
      await animate(
        box,
        {
          scale: 1,
          backgroundColor: '#f5f5f5',
          borderColor: '#d4d4d4',
        },
        { duration: 0.2 }
      ).finished;
      box.classList.remove('text-neutral-900', 'text-neutral-500', 'text-white');
      box.classList.add('text-neutral-600');
    }

    if (labelContainer) {
      labelContainer.innerHTML = '';
    }
  }

  // 現在のステップが1以上なら、その要素をハイライト
  if (state.currentStep > 0) {
    const step = state.steps[state.currentStep - 1];
    const box = document.querySelector(`[data-index="${step.index}"]`) as HTMLElement;
    const labelContainer = box?.parentElement?.querySelector('.label-container') as HTMLElement;

    if (box) {
      if (step.found) {
        box.style.backgroundColor = '#22c55e';
        box.style.borderColor = '#16a34a';
        box.style.transform = 'scale(1.15)';
        box.classList.remove('text-neutral-600');
        box.classList.add('text-white');
        if (labelContainer) {
          labelContainer.innerHTML =
            '<div class="text-xs px-2 py-1 bg-green-100 rounded border border-green-300 text-green-700">発見！</div>';
        }
      } else {
        box.style.backgroundColor = '#facc15';
        box.style.borderColor = '#eab308';
        box.style.transform = 'scale(1.15)';
        box.classList.remove('text-neutral-600');
        box.classList.add('text-neutral-900');
        if (labelContainer) {
          labelContainer.innerHTML =
            '<div class="text-xs px-2 py-1 bg-white rounded border border-neutral-300 text-neutral-600">チェック中</div>';
        }
      }
    }
  }
}

/**
 * 配列のビジュアルをリセット
 */
function resetArrayVisuals(): void {
  const boxes = document.querySelectorAll('.array-box');
  boxes.forEach((box) => {
    const el = box as HTMLElement;
    el.style.backgroundColor = '#f5f5f5';
    el.style.borderColor = '#d4d4d4';
    el.style.transform = 'scale(1)';
    el.classList.remove('text-neutral-900', 'text-neutral-500', 'text-white');
    el.classList.add('text-neutral-600');

    const labelContainer = el.parentElement?.querySelector('.label-container') as HTMLElement;
    if (labelContainer) {
      labelContainer.innerHTML = '';
    }
  });
}

/**
 * UI を更新
 */
function updateUI(): void {
  // ステップ表示
  if (elements.currentStepEl) {
    elements.currentStepEl.textContent = state.currentStep.toString();
  }
  if (elements.totalStepsEl) {
    elements.totalStepsEl.textContent = state.steps.length.toString();
  }

  // プログレスバー
  if (elements.progressFill) {
    const percent = state.steps.length > 0 ? (state.currentStep / state.steps.length) * 100 : 0;
    elements.progressFill.style.width = `${percent}%`;
  }

  // ボタンの状態
  if (elements.btnPrev) {
    elements.btnPrev.disabled = state.currentStep === 0;
  }
  if (elements.btnNext) {
    elements.btnNext.disabled = state.currentStep >= state.steps.length;
  }
  if (elements.btnReset) {
    elements.btnReset.disabled = state.currentStep === 0;
  }
  if (elements.btnPlay) {
    elements.btnPlay.disabled = state.currentStep >= state.steps.length && !state.isPlaying;
  }

  // 再生/一時停止アイコン
  if (elements.iconPlay && elements.iconPause && elements.btnPlayText) {
    if (state.isPlaying) {
      elements.iconPlay.classList.add('hidden');
      elements.iconPause.classList.remove('hidden');
      elements.btnPlayText.textContent = '一時停止';
    } else {
      elements.iconPlay.classList.remove('hidden');
      elements.iconPause.classList.add('hidden');
      elements.btnPlayText.textContent = '再生';
    }
  }

  // ステップ情報
  if (state.currentStep > 0 && state.currentStep <= state.steps.length) {
    const step = state.steps[state.currentStep - 1];

    if (elements.stepInfo) {
      elements.stepInfo.classList.remove('hidden');
    }
    if (elements.infoIndex) {
      elements.infoIndex.textContent = step.index.toString();
    }
    if (elements.infoValue) {
      elements.infoValue.textContent = step.current.toString();
    }
    if (elements.infoResult) {
      if (step.found) {
        elements.infoResult.className = 'px-6 py-3 bg-green-100 text-green-700 rounded-lg text-lg';
        elements.infoResult.textContent = '✓ 見つかりました！';
      } else {
        elements.infoResult.className = 'px-6 py-3 bg-neutral-100 text-neutral-600 rounded-lg';
        elements.infoResult.textContent = '一致しません';
      }
    }
  } else {
    if (elements.stepInfo) {
      elements.stepInfo.classList.add('hidden');
    }
  }

  // 探索完了メッセージ
  if (state.currentStep >= state.steps.length && state.steps.length > 0) {
    if (elements.resultMessage && elements.resultText) {
      elements.resultMessage.classList.remove('hidden');
      if (state.foundIndex !== undefined) {
        elements.resultMessage.className = 'p-6 rounded-xl border-2 mt-4 bg-green-50 border-green-300';
        elements.resultText.className = 'text-xl text-green-800';
        elements.resultText.textContent = `✓ 目標値 ${state.target} がインデックス ${state.foundIndex} で見つかりました！`;
      } else {
        elements.resultMessage.className = 'p-6 rounded-xl border-2 mt-4 bg-red-50 border-red-300';
        elements.resultText.className = 'text-xl text-red-800';
        elements.resultText.textContent = `✗ 目標値 ${state.target} は配列内に見つかりませんでした。`;
      }
    }
  } else {
    if (elements.resultMessage) {
      elements.resultMessage.classList.add('hidden');
    }
  }
}

