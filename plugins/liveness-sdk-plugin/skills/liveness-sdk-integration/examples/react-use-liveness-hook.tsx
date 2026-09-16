import { useState, useEffect, useRef, useCallback } from "react";
import {
  LivenessSDK,
  type LivenessConfig,
  type LivenessResult,
  type LivenessError,
} from "@liveness/sdk";

export type LivenessStatus =
  | "IDLE"
  | "LOADING_MODELS"
  | "READY"
  | "DETECTING"
  | "SUCCESS"
  | "FAILURE"
  | "ERROR";

export interface ChallengeInfo {
  type: string;
  instruction: string;
  distance?: "CLOSER" | "FURTHER" | null;
}

export interface UseLivenessOptions {
  config?: Partial<LivenessConfig>;
  onSuccess?: (result: LivenessResult) => void;
  onFailure?: (error: LivenessError) => void;
}

export function useLiveness({
  config,
  onSuccess,
  onFailure,
}: UseLivenessOptions = {}) {
  const [status, setStatus] = useState<LivenessStatus>("IDLE");
  const [currentChallenge, setCurrentChallenge] =
    useState<ChallengeInfo | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [result, setResult] = useState<LivenessResult | null>(null);
  const [error, setError] = useState<LivenessError | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sdkRef = useRef<LivenessSDK | null>(null);

  // Initialize and preload models
  useEffect(() => {
    setStatus("LOADING_MODELS");
    const sdk = new LivenessSDK(config);
    sdkRef.current = sdk;

    sdk.on("ready", () => {
      setStatus("READY");
    });

    sdk.on("challenge", (info: ChallengeInfo) => {
      setCurrentChallenge(info);
    });

    sdk.on("progress", ({ progress }: { progress: number }) => {
      setProgress(Math.round(progress * 100));
    });

    sdk.on("success", (res: LivenessResult) => {
      setResult(res);
      setStatus("SUCCESS");
      onSuccess?.(res);
    });

    sdk.on("failure", (err: LivenessError) => {
      setError(err);
      setStatus("FAILURE");
      onFailure?.(err);
    });

    sdk.on("error", (err: LivenessError) => {
      setError(err);
      setStatus("ERROR");
      onFailure?.(err);
    });

    sdk.load().catch((err) => {
      setError({
        code: "LOAD_FAILED",
        message: err.message || "Failed to load models",
      });
      setStatus("ERROR");
    });

    return () => {
      if (videoRef.current) {
        sdk.stop(videoRef.current);
      }
    };
  }, []);

  const start = useCallback(async () => {
    if (!sdkRef.current || !videoRef.current || !canvasRef.current) {
      console.warn("LivenessSDK or DOM elements not ready.");
      return;
    }
    setError(null);
    setResult(null);
    setProgress(0);
    setStatus("DETECTING");

    try {
      await sdkRef.current.start(videoRef.current, canvasRef.current, config);
    } catch (err: any) {
      setError({
        code: "START_FAILED",
        message: err.message || "Failed to start camera",
      });
      setStatus("ERROR");
    }
  }, [config]);

  const stop = useCallback(() => {
    if (sdkRef.current && videoRef.current) {
      sdkRef.current.stop(videoRef.current);
      setStatus("IDLE");
      setCurrentChallenge(null);
      setProgress(0);
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setError(null);
    setResult(null);
    setProgress(0);
    setStatus("READY");
  }, [stop]);

  return {
    videoRef,
    canvasRef,
    status,
    currentChallenge,
    progress,
    result,
    error,
    start,
    stop,
    reset,
  };
}
