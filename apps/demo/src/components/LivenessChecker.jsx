// src/components/LivenessChecker.jsx
import {
  calculateCosineSimilarity,
  calculateEuclideanDistance,
} from "@liveness/engine/utils";
import { LivenessSDK } from "@liveness/sdk";
import { useEffect, useRef, useState } from "react";
import { ApiSettings } from "./ApiSettings";
import { ProgressBar } from "./ProgressBar";

const UI_STATE = {
  IDLE: "IDLE",
  LOADING_MODELS: "LOADING_MODELS",
  READY_TO_START: "READY_TO_START",
  CAMERA_ERROR: "CAMERA_ERROR",
  CHECKING: "CHECKING",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
};

const MODE = {
  ENROLL: "ENROLL",
  VERIFY: "VERIFY",
};

const VERIFY_TYPE = {
  ONE_TO_MANY: "1:N",
  ONE_TO_ONE: "1:1",
};

const MATCH_THRESHOLD = 0.98;
const EUCLIDEAN_THRESHOLD = 0.2;

export function LivenessChecker() {
  const [uiState, setUiState] = useState(UI_STATE.IDLE);
  const [mode, setMode] = useState(MODE.ENROLL);
  const [verifyType, setVerifyType] = useState(VERIFY_TYPE.ONE_TO_MANY);
  const [instruction, setInstruction] = useState("");
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [targetId, setTargetId] = useState("");
  const [selectedLocalIndex, setSelectedLocalIndex] = useState(0);

  const [recentCloudUsers, setRecentCloudUsers] = useState(() => {
    const saved = localStorage.getItem("recent_cloud_identities");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [matchMetrics, setMatchMetrics] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [distanceHint, setDistanceHint] = useState(null);
  const [progress, setProgress] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedChallenges, setSelectedChallenges] = useState([
    "WAITING",
    "BLINK",
    "TURN_LEFT",
    "TURN_RIGHT",
  ]);

  const toggleChallenge = (type) => {
    setSelectedChallenges((prev) => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== type);
      } else {
        const order = ["WAITING", "BLINK", "TURN_LEFT", "TURN_RIGHT"];
        const next = [...prev, type];
        return order.filter((c) => next.includes(c));
      }
    });
  };

  const [apiConfig, setApiConfig] = useState(() => {
    const saved = localStorage.getItem("cloud_api_config");
    try {
      return saved
        ? JSON.parse(saved)
        : {
            enabled: false,
            apiKey: "",
            apiUrl: "http://localhost:3000/api/liveness",
          };
    } catch {
      return {
        enabled: false,
        apiKey: "",
        apiUrl: "http://localhost:3000/api/liveness",
      };
    }
  });

  const isCloudMode = !!(apiConfig.enabled && apiConfig.apiKey);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sdkRef = useRef(null);
  const userNameRef = useRef(userName);
  const targetIdRef = useRef(targetId);
  const verifyTypeRef = useRef(verifyType);
  const selectedLocalIndexRef = useRef(selectedLocalIndex);
  const enrolledUsersRef = useRef(enrolledUsers);
  const apiConfigRef = useRef(apiConfig);

  useEffect(() => {
    userNameRef.current = userName;
  }, [userName]);

  useEffect(() => {
    targetIdRef.current = targetId;
  }, [targetId]);

  useEffect(() => {
    verifyTypeRef.current = verifyType;
  }, [verifyType]);

  useEffect(() => {
    selectedLocalIndexRef.current = selectedLocalIndex;
  }, [selectedLocalIndex]);

  useEffect(() => {
    enrolledUsersRef.current = enrolledUsers;
  }, [enrolledUsers]);

  useEffect(() => {
    apiConfigRef.current = apiConfig;
    localStorage.setItem("cloud_api_config", JSON.stringify(apiConfig));
  }, [apiConfig]);

  useEffect(() => {
    localStorage.setItem(
      "recent_cloud_identities",
      JSON.stringify(recentCloudUsers),
    );
  }, [recentCloudUsers]);

  useEffect(() => {
    if (!isCloudMode) {
      const saved = localStorage.getItem("face_identity");
      if (saved) {
        try {
          const rawUsers = JSON.parse(saved);
          if (Array.isArray(rawUsers) && rawUsers.length > 0) {
            const users = rawUsers.map((u, idx) => ({
              id: u.id || `local-${idx + 1}`,
              name: u.name || `User ${idx + 1}`,
              descriptor: u.descriptor,
            }));
            setEnrolledUsers(users);
            setMode(MODE.VERIFY);
          } else {
            setEnrolledUsers([]);
            setMode(MODE.ENROLL);
          }
        } catch (e) {
          console.error("Failed to parse enrolled identities", e);
          setEnrolledUsers([]);
        }
      } else {
        setEnrolledUsers([]);
        setMode(MODE.ENROLL);
      }
    } else {
      setMode(MODE.VERIFY);
    }
  }, [isCloudMode]);

  useEffect(() => {
    setUiState(UI_STATE.LOADING_MODELS);
    setInstruction("Loading models, please wait...");

    const sdk = new LivenessSDK({
      headTurnThreshold: 0.4,
      challengeTimeout: 10000,
    });

    sdk.on("ready", () => {
      setUiState(UI_STATE.READY_TO_START);
      setInstruction('Click "Start" to begin.');
    });

    sdk.on("challenge", ({ type, instruction, distance }) => {
      setCurrentChallenge(type);
      setInstruction(instruction);
      setDistanceHint(distance);
      setProgress(0);
    });

    sdk.on("progress", ({ progress }) => {
      setProgress(progress);
    });

    sdk.on("success", async (livenessResult) => {
      const { descriptor } = livenessResult;
      setCurrentChallenge(null);

      // Cloud Mode
      if (apiConfigRef.current.enabled && apiConfigRef.current.apiKey) {
        try {
          const apiKey = apiConfigRef.current.apiKey.trim();
          setInstruction("Syncing with Cloud API...");

          const rawUrl =
            apiConfigRef.current.apiUrl?.trim() ||
            "http://localhost:3000/api/liveness";
          const baseUrl = rawUrl.replace(/\/+$/, "");

          let endpoint;
          let body;

          if (mode === MODE.ENROLL) {
            endpoint = `${baseUrl}/enroll`;
            body = { name: userNameRef.current || "User", ...livenessResult };
          } else if (verifyTypeRef.current === VERIFY_TYPE.ONE_TO_ONE) {
            endpoint = `${baseUrl}/verify-one`;
            const currentTargetId = targetIdRef.current.trim();
            if (!currentTargetId) {
              throw new Error(
                "Target ID (UUID) is required for 1:1 verification.",
              );
            }
            body = { targetId: currentTargetId, ...livenessResult };
          } else {
            endpoint = `${baseUrl}/verify`;
            body = livenessResult;
          }

          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
            },
            body: JSON.stringify(body),
          });

          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(
              error.error || `Request failed with status ${response.status}`,
            );
          }

          const cloudResult = await response.json();

          if (mode === MODE.ENROLL) {
            const newCloudUser = {
              id: cloudResult.id,
              name: cloudResult.name,
              enrolledAt: cloudResult.enrolled_at || new Date().toISOString(),
            };
            setRecentCloudUsers((prev) => {
              const filtered = prev.filter((u) => u.id !== newCloudUser.id);
              return [newCloudUser, ...filtered].slice(0, 10);
            });
            setTargetId(cloudResult.id);
            setUiState(UI_STATE.SUCCESS);
            setInstruction(`Cloud Identity Enrolled: ${cloudResult.name}`);
            setUserName("");
          } else if (verifyTypeRef.current === VERIFY_TYPE.ONE_TO_ONE) {
            setMatchMetrics({
              similarity: cloudResult.match?.similarity ?? 0,
              distance: cloudResult.match?.distance ?? Infinity,
            });
            setUiState(UI_STATE.SUCCESS);
            setInstruction(
              cloudResult.verified
                ? `1:1 Match confirmed for ${cloudResult.match?.name || "Target User"}`
                : "1:1 Verification Failed: Face does not match target ID.",
            );
          } else {
            setMatchMetrics({
              similarity: cloudResult.match?.similarity ?? 0,
              distance: cloudResult.match?.distance ?? Infinity,
            });
            setUiState(UI_STATE.SUCCESS);
            setInstruction(
              cloudResult.verified
                ? `Identified as ${cloudResult.match?.name}`
                : "1:N Verification Failed: No matching identity found.",
            );
          }
        } catch (err) {
          setUiState(UI_STATE.FAILURE);
          setInstruction(`Cloud API Error: ${err.message}`);
        }
      }
      // Offline / LocalStorage Mode
      else {
        if (mode === MODE.ENROLL) {
          const newIdentity = {
            id: `local_${Date.now().toString(36)}`,
            name: userNameRef.current.trim() || "User",
            descriptor,
          };

          setEnrolledUsers((prev) => {
            const updated = [...prev, newIdentity];
            localStorage.setItem("face_identity", JSON.stringify(updated));
            return updated;
          });

          setUiState(UI_STATE.SUCCESS);
          setInstruction(`Enrolled ${newIdentity.name} locally!`);
          setUserName("");
        } else if (verifyTypeRef.current === VERIFY_TYPE.ONE_TO_ONE) {
          const targetUser =
            enrolledUsersRef.current[selectedLocalIndexRef.current];
          if (!targetUser) {
            setUiState(UI_STATE.FAILURE);
            setInstruction("No local identity selected for 1:1 verification.");
            return;
          }

          const similarity = calculateCosineSimilarity(
            descriptor,
            targetUser.descriptor,
          );
          const distance = calculateEuclideanDistance(
            descriptor,
            targetUser.descriptor,
          );

          setMatchMetrics({ similarity, distance });
          const isMatch =
            similarity >= MATCH_THRESHOLD && distance <= EUCLIDEAN_THRESHOLD;

          setUiState(UI_STATE.SUCCESS);
          setInstruction(
            isMatch
              ? `1:1 Verified: Matches ${targetUser.name}`
              : `1:1 Mismatch: Does not match ${targetUser.name}`,
          );
        } else {
          if (enrolledUsersRef.current.length > 0) {
            let bestMatch = {
              similarity: -1,
              distance: Infinity,
              name: "Unknown",
            };

            enrolledUsersRef.current.forEach((user) => {
              const similarity = calculateCosineSimilarity(
                descriptor,
                user.descriptor,
              );
              const distance = calculateEuclideanDistance(
                descriptor,
                user.descriptor,
              );
              if (similarity > bestMatch.similarity) {
                bestMatch = { similarity, distance, name: user.name };
              }
            });

            const finalSim =
              bestMatch.similarity >= 0 ? bestMatch.similarity : 0;
            setMatchMetrics({
              similarity: finalSim,
              distance: bestMatch.distance,
            });

            const isMatch =
              finalSim >= MATCH_THRESHOLD &&
              bestMatch.distance <= EUCLIDEAN_THRESHOLD;

            setUiState(UI_STATE.SUCCESS);
            setInstruction(
              isMatch
                ? `1:N Verified: Identified as ${bestMatch.name}`
                : "1:N Identification Failed: No match found.",
            );
          }
        }
      }
    });

    sdk.on("failure", (error) => {
      setUiState(UI_STATE.FAILURE);
      setInstruction(`Error: ${error.message}`);
      setCurrentChallenge(null);
    });

    sdk.on("error", (err) => {
      setUiState(UI_STATE.FAILURE);
      setInstruction(`System Error: ${err.message}`);
    });

    sdk.load().catch(console.error);
    sdkRef.current = sdk;

    const currentVideo = videoRef.current;
    return () => sdkRef.current?.stop(currentVideo);
  }, [mode]);

  const handleStartClick = async () => {
    if (!videoRef.current || !canvasRef.current || !sdkRef.current) return;
    setProgress(0);
    setMatchMetrics(null);
    setCurrentChallenge(null);
    setUiState(UI_STATE.CHECKING);

    const sessionToken = `sess_${Math.random().toString(36).substring(2, 15)}`;
    sdkRef.current.updateConfig({
      sessionToken,
      challenges: selectedChallenges,
    });

    try {
      await sdkRef.current.start(videoRef.current, canvasRef.current);
    } catch {
      setUiState(UI_STATE.CAMERA_ERROR);
    }
  };

  const clearIdentity = () => {
    localStorage.removeItem("face_identity");
    setEnrolledUsers([]);
    setUserName("");
    setMode(MODE.ENROLL);
    setUiState(UI_STATE.READY_TO_START);
  };

  const removeIdentity = (indexToRemove) => {
    setEnrolledUsers((prev) => {
      const updated = prev.filter((_, index) => index !== indexToRemove);
      if (updated.length === 0) {
        localStorage.removeItem("face_identity");
        setMode(MODE.ENROLL);
      } else {
        localStorage.setItem("face_identity", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleCopyId = (id) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const isStartDisabled =
    (mode === MODE.ENROLL && !userName.trim()) ||
    (mode === MODE.VERIFY &&
      verifyType === VERIFY_TYPE.ONE_TO_ONE &&
      isCloudMode &&
      !targetId.trim()) ||
    (mode === MODE.VERIFY && !isCloudMode && enrolledUsers.length === 0);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
      {/* Header bar: Status + Settings */}
      <div className="mb-4 flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isCloudMode
                ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                : "bg-slate-400"
            }`}
          />
          <span className="text-xs font-bold tracking-wide text-slate-500 uppercase">
            {isCloudMode ? "Cloud Mode" : "Offline (Local Storage)"}
          </span>
        </div>
        <ApiSettings config={apiConfig} onSave={setApiConfig} />
      </div>

      {/* Main Mode Selector: Enroll vs Verify */}
      <div className="mb-4 flex w-full max-w-sm rounded-xl bg-slate-100 p-1">
        <button
          onClick={() => {
            setMode(MODE.ENROLL);
            setUiState(UI_STATE.READY_TO_START);
          }}
          className={`flex-1 cursor-pointer rounded-lg py-2 text-sm font-semibold transition-all ${
            mode === MODE.ENROLL
              ? "bg-white text-blue-600 shadow"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Enroll
        </button>
        <button
          onClick={() => {
            setMode(MODE.VERIFY);
            setUiState(UI_STATE.READY_TO_START);
          }}
          disabled={!isCloudMode && enrolledUsers.length === 0}
          className={`flex-1 cursor-pointer rounded-lg py-2 text-sm font-semibold transition-all ${
            mode === MODE.VERIFY
              ? "bg-white text-blue-600 shadow"
              : "text-slate-500 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          }`}
        >
          Verify
        </button>
      </div>

      {/* Verification Type (1:N vs 1:1) */}
      {mode === MODE.VERIFY && (
        <div className="mb-5 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
              Verification Mode
            </span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-blue-600">
              {isCloudMode
                ? verifyType === VERIFY_TYPE.ONE_TO_ONE
                  ? "POST /api/liveness/verify-one"
                  : "POST /api/liveness/verify"
                : verifyType === VERIFY_TYPE.ONE_TO_ONE
                  ? "Local 1:1 Match"
                  : "Local 1:N Search"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setVerifyType(VERIFY_TYPE.ONE_TO_MANY);
                setUiState(UI_STATE.READY_TO_START);
              }}
              className={`flex cursor-pointer flex-col items-start rounded-xl border p-3 text-left transition-all ${
                verifyType === VERIFY_TYPE.ONE_TO_MANY
                  ? "border-blue-500 bg-blue-50/70 text-blue-900 shadow-xs ring-1 ring-blue-500/30"
                  : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100/80"
              }`}
            >
              <span className="text-xs font-bold">1:N Identification</span>
              <span className="mt-1 text-[11px] text-slate-500">
                {isCloudMode ? "Search database" : "Search local identities"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setVerifyType(VERIFY_TYPE.ONE_TO_ONE);
                setUiState(UI_STATE.READY_TO_START);
              }}
              className={`flex cursor-pointer flex-col items-start rounded-xl border p-3 text-left transition-all ${
                verifyType === VERIFY_TYPE.ONE_TO_ONE
                  ? "border-indigo-500 bg-indigo-50/70 text-indigo-900 shadow-xs ring-1 ring-indigo-500/30"
                  : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100/80"
              }`}
            >
              <div className="flex items-center gap-1 text-xs font-bold">
                <span>1:1 Verification</span>
              </div>
              <span className="mt-1 text-[11px] text-slate-500">
                {isCloudMode ? "Target user ID" : "Target local user"}
              </span>
            </button>
          </div>

          {/* 1:1 Cloud Target ID Input */}
          {verifyType === VERIFY_TYPE.ONE_TO_ONE && isCloudMode && (
            <div className="mt-3.5 space-y-2 rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Target User ID (UUID) <span className="text-red-500">*</span>
                </label>
                <span className="font-mono text-[10px] text-slate-400">
                  UUID v4
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-8 font-mono text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
                {targetId && (
                  <button
                    onClick={() => setTargetId("")}
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
                    type="button"
                  >
                    ✕
                  </button>
                )}
              </div>

              {recentCloudUsers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {recentCloudUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => setTargetId(user.id)}
                      className={`cursor-pointer rounded-md border px-2 py-1 text-[11px] transition-all ${
                        targetId === user.id
                          ? "border-indigo-500 bg-indigo-100 font-bold text-indigo-800"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {user.name} ({user.id.slice(0, 8)}...)
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 1:1 Local Selector */}
          {verifyType === VERIFY_TYPE.ONE_TO_ONE &&
            !isCloudMode &&
            enrolledUsers.length > 0 && (
              <div className="mt-3.5 space-y-1.5 rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5">
                <label className="block text-xs font-bold text-slate-700">
                  Target Identity:
                </label>
                <select
                  value={selectedLocalIndex}
                  onChange={(e) =>
                    setSelectedLocalIndex(Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                >
                  {enrolledUsers.map((user, idx) => (
                    <option key={user.id || idx} value={idx}>
                      {user.name} (#{idx + 1})
                    </option>
                  ))}
                </select>
              </div>
            )}
        </div>
      )}

      {/* Enroll Name Input */}
      {mode === MODE.ENROLL && uiState === UI_STATE.READY_TO_START && (
        <div className="mb-4 w-full max-w-sm">
          <input
            type="text"
            placeholder="Enter your full name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      )}

      {/* Challenges Sequence */}
      {uiState === UI_STATE.READY_TO_START && (
        <div className="mb-6 w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="mb-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
            Active Challenges
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "WAITING", label: "Center Face" },
              { id: "BLINK", label: "Eye Blink" },
              { id: "TURN_LEFT", label: "Turn Left" },
              { id: "TURN_RIGHT", label: "Turn Right" },
            ].map((ch) => (
              <label
                key={ch.id}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs font-bold transition-all ${
                  selectedChallenges.includes(ch.id)
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                <span>{ch.label}</span>
                <input
                  type="checkbox"
                  checked={selectedChallenges.includes(ch.id)}
                  onChange={() => toggleChallenge(ch.id)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Camera Viewport */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-slate-900/10">
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 h-full w-full scale-x-[-1] transform object-cover"
        />
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute top-4 right-0 left-0 z-10 flex justify-center px-4">
          <div className="rounded-full border border-white/10 bg-black/60 px-6 py-2 text-center text-sm font-medium text-white shadow-lg backdrop-blur-md">
            {uiState === UI_STATE.LOADING_MODELS
              ? "Loading AI Models..."
              : instruction}
          </div>
        </div>

        {currentChallenge === "WAITING" && distanceHint && (
          <div className="absolute top-1/2 right-0 left-0 z-10 flex justify-center">
            <div className="rounded-full border border-white/10 bg-red-500/80 px-6 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md">
              {`Move ${distanceHint}`}
            </div>
          </div>
        )}

        {(uiState === UI_STATE.READY_TO_START ||
          uiState === UI_STATE.FAILURE) && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
            <button
              onClick={handleStartClick}
              disabled={isStartDisabled}
              className={`flex transform items-center gap-2 rounded-full px-8 py-3 font-bold shadow-lg transition-all ${
                isStartDisabled
                  ? "cursor-not-allowed bg-slate-500 text-slate-200 opacity-75"
                  : "cursor-pointer bg-blue-600 text-white hover:scale-105 hover:bg-blue-500 active:scale-95"
              }`}
            >
              {uiState === UI_STATE.READY_TO_START
                ? "Start Session"
                : "Retry Check"}
            </button>
          </div>
        )}

        {(currentChallenge === "TURN_LEFT" ||
          currentChallenge === "TURN_RIGHT") && (
          <div className="absolute right-0 bottom-0 left-0 z-10 p-6">
            <ProgressBar
              progress={progress}
              direction={currentChallenge === "TURN_LEFT" ? "left" : "right"}
            />
          </div>
        )}

        {/* Result Overlay */}
        {uiState === UI_STATE.SUCCESS && (
          <div
            className={`absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-white backdrop-blur-md ${
              instruction.includes("Mismatch") ||
              instruction.includes("Failed") ||
              (mode === MODE.VERIFY &&
                matchMetrics !== null &&
                (matchMetrics.similarity < MATCH_THRESHOLD ||
                  matchMetrics.distance > EUCLIDEAN_THRESHOLD))
                ? "bg-red-500/90"
                : "bg-green-500/90"
            }`}
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
              {instruction.includes("Mismatch") ||
              instruction.includes("Failed") ||
              (mode === MODE.VERIFY &&
                matchMetrics !== null &&
                (matchMetrics.similarity < MATCH_THRESHOLD ||
                  matchMetrics.distance > EUCLIDEAN_THRESHOLD)) ? (
                <svg
                  className="h-10 w-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              )}
            </div>

            <h3 className="px-6 text-center text-2xl font-bold">
              {instruction}
            </h3>

            {mode === MODE.VERIFY && matchMetrics !== null && (
              <div className="mt-3 flex items-center gap-2.5 rounded-full bg-black/30 px-4 py-1.5 font-mono text-xs text-white/95 shadow-sm">
                <span>Cosine: {(matchMetrics.similarity * 100).toFixed(1)}%</span>
                <span className="text-white/40">•</span>
                <span>
                  Distance:{" "}
                  {matchMetrics.distance !== undefined &&
                  matchMetrics.distance !== Infinity
                    ? matchMetrics.distance.toFixed(3)
                    : "N/A"}
                </span>
              </div>
            )}

            <button
              onClick={() => setUiState(UI_STATE.READY_TO_START)}
              className="mt-6 cursor-pointer rounded-full bg-white px-6 py-2 text-sm font-bold text-slate-900 shadow-sm hover:bg-slate-100"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* Local Identities Directory (Offline Mode) */}
      {!isCloudMode && enrolledUsers.length > 0 && (
        <div className="mt-8 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <h3 className="font-bold text-slate-800">
              Local Identities ({enrolledUsers.length})
            </h3>
            <button
              onClick={clearIdentity}
              className="cursor-pointer text-xs font-bold tracking-wider text-red-500 uppercase hover:text-red-700"
            >
              Clear All
            </button>
          </div>
          <ul className="max-h-64 divide-y divide-slate-100 overflow-y-auto">
            {enrolledUsers.map((user, index) => (
              <li
                key={user.id || index}
                className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                    {(user.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {user.name}
                    </p>
                    <p className="font-mono text-xs text-slate-400">
                      {user.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode(MODE.VERIFY);
                      setVerifyType(VERIFY_TYPE.ONE_TO_ONE);
                      setSelectedLocalIndex(index);
                      setUiState(UI_STATE.READY_TO_START);
                    }}
                    className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700"
                  >
                    Verify 1:1
                  </button>
                  <button
                    onClick={() => removeIdentity(index)}
                    className="cursor-pointer rounded-full p-1.5 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
                    title="Remove"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cloud Identities Directory */}
      {isCloudMode && recentCloudUsers.length > 0 && (
        <div className="mt-8 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            <h3 className="font-bold text-slate-800">
              Recent Cloud Enrollments ({recentCloudUsers.length})
            </h3>
            <button
              onClick={() => {
                setRecentCloudUsers([]);
                localStorage.removeItem("recent_cloud_identities");
              }}
              className="cursor-pointer text-xs font-bold tracking-wider text-red-500 uppercase hover:text-red-700"
            >
              Clear
            </button>
          </div>
          <ul className="max-h-64 divide-y divide-slate-100 overflow-y-auto">
            {recentCloudUsers.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                    {(user.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {user.name}
                    </p>
                    <p className="font-mono text-xs text-slate-400">
                      ID: {user.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyId(user.id)}
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    {copiedId === user.id ? "Copied!" : "Copy ID"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode(MODE.VERIFY);
                      setVerifyType(VERIFY_TYPE.ONE_TO_ONE);
                      setTargetId(user.id);
                      setUiState(UI_STATE.READY_TO_START);
                    }}
                    className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-2xs hover:bg-indigo-700"
                  >
                    Verify 1:1
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
