import { LivenessConfig } from "@liveness/engine";

export { LivenessConfig };

export class LivenessSDK {
  constructor(config?: LivenessConfig);
  on(event: string, callback: Function): this;
  off(event: string, callback: Function): this;
  load(): Promise<void>;
  start(
    videoElement: HTMLVideoElement,
    canvasElement: HTMLCanvasElement,
  ): Promise<void>;
  stop(videoElement?: HTMLVideoElement): void;
}
