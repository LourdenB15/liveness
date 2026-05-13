export interface LivenessCallbacks {
  onReady: () => void;
  onSuccess: (result: { descriptor: number[] }) => void;
  onFailure: (error: { code: string; message: string }) => void;
  onChallengeChanged: (challenge: {
    type: string;
    instruction: string;
  }) => void;
  onProgress?: (data: { progress: number; rawValue: any }) => void;
}

export interface LivenessConfig {
  blinkEARThreshold?: number;
  headTurnThreshold?: number;
  challengeTimeout?: number;
  targetFPS?: number;
  minFaceSize?: number;
  maxFaceSize?: number;
  basePath?: string;
}

export class LivenessEngine {
  constructor(callbacks: LivenessCallbacks, config?: LivenessConfig);
  load(): Promise<void>;
  start(
    videoElement: HTMLVideoElement,
    canvasElement: HTMLCanvasElement,
  ): Promise<void>;
  stop(videoElement?: HTMLVideoElement): void;
}
