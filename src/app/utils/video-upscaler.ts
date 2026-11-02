import { Resolution, resolutionSettings } from "./resolutions";
// Dynamically import ffmpeg only when needed (mp4 conversion) – we pin to 0.11.x which exposes createFFmpeg + fetchFile
type FFmpegModule = typeof import("@ffmpeg/ffmpeg");
type FFmpegInstance = ReturnType<FFmpegModule["createFFmpeg"]>;

interface VideoInfo {
  width: number;
  height: number;
  duration: number;
  fileSize: number;
}

interface UpscaleOptions {
  resolution: Resolution;
  bitrate: number; // in Mbps
  format?: "webm" | "mp4"; // mp4 support via ffmpeg.wasm
}

export type ProcessingStage = "recording" | "converting";

export function getProcessingLimits(format: "webm" | "mp4") {
  const maxBytes = (format === "mp4" ? 256 : 512) * 1024 * 1024;
  return { maxInputBytes: maxBytes, maxOutputBytes: maxBytes };
}

export function estimateOutputSize(duration: number, bitrate: number): number {
  return Math.ceil((duration * (bitrate * 1_000_000 + 192_000)) / 8);
}

export function getOutputDimensions(
  sourceWidth: number,
  sourceHeight: number,
  resolution: Resolution
): { width: number; height: number } {
  if (sourceWidth <= 0 || sourceHeight <= 0) {
    throw new Error("Invalid source dimensions");
  }

  const target = resolutionSettings[resolution];
  const landscape = sourceWidth >= sourceHeight;
  const scale = landscape
    ? target.width / sourceWidth
    : target.height / sourceHeight;
  const even = (value: number) => Math.max(2, Math.round(value / 2) * 2);

  return {
    width: landscape ? target.width : even(sourceWidth * scale),
    height: landscape ? even(sourceHeight * scale) : target.height,
  };
}

export async function getVideoInfo(file: File): Promise<VideoInfo> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
        fileSize: file.size,
      });
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error("Failed to load video metadata"));
    };

    video.src = URL.createObjectURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export async function upscaleVideo(
  file: File,
  options: UpscaleOptions,
  onProgress: (progress: number, stage: ProcessingStage) => void,
  abortSignal?: AbortSignal
): Promise<{ blob: Blob; fileSize: number }> {
  return new Promise((resolve, reject) => {
    if (abortSignal?.aborted) {
      reject(new Error("Operation cancelled"));
      return;
    }

    const limits = getProcessingLimits(options.format ?? "webm");
    if (file.size > limits.maxInputBytes) {
      reject(new Error("Input video exceeds this browser processing limit"));
      return;
    }

    const sourceVideo = document.createElement("video");
    sourceVideo.src = URL.createObjectURL(file);
    sourceVideo.muted = true;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });
    let mediaRecorder: MediaRecorder | null = null;
    let videoStream: MediaStream | null = null;
    let sourceStream: MediaStream | null = null;
    let audioContext: AudioContext | null = null;
    if (typeof AudioContext !== "undefined") {
      try {
        audioContext = new AudioContext();
        // Resume while this call is still part of the user's button click.
        void audioContext.resume().catch(() => {});
      } catch {
        // A missing audio track will produce a clear error below.
      }
    }
    let audioSource: MediaElementAudioSourceNode | null = null;
    let ffmpeg: FFmpegInstance | null = null;
    let frameId: number | null = null;
    let usingVideoFrameCallback = false;
    let pausedForVisibility = false;
    let settled = false;

    const cancelFrame = () => {
      if (frameId === null) return;
      if (usingVideoFrameCallback) {
        sourceVideo.cancelVideoFrameCallback(frameId);
      } else {
        cancelAnimationFrame(frameId);
      }
      frameId = null;
    };

    const stopStreams = () => {
      videoStream?.getTracks().forEach((track) => track.stop());
      sourceStream?.getTracks().forEach((track) => track.stop());
      audioSource?.disconnect();
      audioSource = null;
      if (audioContext) void audioContext.close().catch(() => {});
      audioContext = null;
      videoStream = null;
      sourceStream = null;
    };

    const stopFFmpeg = () => {
      if (!ffmpeg) return;
      try {
        ffmpeg.exit();
      } catch {
        // A worker may already have exited after an encoding failure.
      }
      ffmpeg = null;
    };

    const cleanup = () => {
      cancelFrame();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      abortSignal?.removeEventListener("abort", handleAbort);
      sourceVideo.pause();
      sourceVideo.removeAttribute("src");
      sourceVideo.load();
      URL.revokeObjectURL(sourceUrl);
      stopStreams();
    };

    const sourceUrl = sourceVideo.src;

    const finish = (result: { blob: Blob; fileSize: number }) => {
      if (settled) return;
      settled = true;
      cleanup();
      stopFFmpeg();
      onProgress(100, options.format === "mp4" ? "converting" : "recording");
      resolve(result);
    };

    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        try {
          mediaRecorder.stop();
        } catch {
          // Continue releasing resources if recording has already failed.
        }
      }
      cleanup();
      stopFFmpeg();
      reject(error);
    };

    const handleAbort = () => fail(new Error("Operation cancelled"));

    const handleVisibilityChange = () => {
      if (!mediaRecorder || settled) return;
      if (document.hidden && mediaRecorder.state === "recording") {
        pausedForVisibility = true;
        cancelFrame();
        sourceVideo.pause();
        mediaRecorder.pause();
      } else if (!document.hidden && pausedForVisibility) {
        pausedForVisibility = false;
        mediaRecorder.resume();
        sourceVideo.play().then(scheduleFrame).catch(() => {
          fail(new Error("Failed to resume source video"));
        });
      }
    };

    const scheduleFrame = () => {
      if (settled || pausedForVisibility || sourceVideo.ended) return;
      const supportsVideoFrameCallback =
        typeof sourceVideo.requestVideoFrameCallback === "function";
      if (supportsVideoFrameCallback) {
        usingVideoFrameCallback = true;
        frameId = sourceVideo.requestVideoFrameCallback((_now, metadata) => {
          drawFrame(metadata.mediaTime);
        });
      } else {
        usingVideoFrameCallback = false;
        frameId = requestAnimationFrame(() => drawFrame(sourceVideo.currentTime));
      }
    };

    let lastProgress = -1;
    const drawFrame = (mediaTime: number) => {
      frameId = null;
      if (settled || pausedForVisibility || sourceVideo.ended) return;
      try {
        ctx?.drawImage(sourceVideo, 0, 0, canvas.width, canvas.height);
        if (Number.isFinite(sourceVideo.duration) && sourceVideo.duration > 0) {
          const progress = Math.min(
            100,
            Math.floor((mediaTime / sourceVideo.duration) * 100)
          );
          if (progress > lastProgress) {
            lastProgress = progress;
            onProgress(
              options.format === "mp4" ? Math.floor(progress * 0.8) : progress,
              "recording"
            );
          }
        }
        scheduleFrame();
      } catch {
        fail(new Error("Failed to process a video frame"));
      }
    };

    if (!ctx) {
      fail(new Error("Failed to get canvas context"));
      return;
    }

    abortSignal?.addEventListener("abort", handleAbort, { once: true });

    sourceVideo.onloadedmetadata = async () => {
      if (settled) return;
      try {
        const dimensions = getOutputDimensions(
          sourceVideo.videoWidth,
          sourceVideo.videoHeight,
          options.resolution
        );
        if (
          estimateOutputSize(sourceVideo.duration, options.bitrate) >
          limits.maxOutputBytes
        ) {
          throw new Error("Estimated output exceeds this browser processing limit");
        }
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
        videoStream = canvas.captureStream();

        sourceStream = (
          sourceVideo as HTMLVideoElement & { captureStream?: () => MediaStream }
        ).captureStream?.() ?? null;
        const audioTrack = sourceStream?.getAudioTracks()[0];
        if (audioTrack) {
          videoStream.addTrack(audioTrack);
        } else {
          if (!audioContext) {
            throw new Error("This browser cannot capture video audio");
          }
          audioSource = audioContext.createMediaElementSource(sourceVideo);
          const destination = audioContext.createMediaStreamDestination();
          audioSource.connect(destination);
          const routedTrack = destination.stream.getAudioTracks()[0];
          if (!routedTrack) {
            throw new Error("This browser cannot capture video audio");
          }
          videoStream.addTrack(routedTrack);
          sourceVideo.muted = false;
          await audioContext.resume();
          if (settled) return;
          if (audioContext.state !== "running") {
            throw new Error("This browser could not start audio capture");
          }
        }

        const mimeType = [
          "video/webm;codecs=vp9,opus",
          "video/webm;codecs=vp8,opus",
          "video/webm",
        ].find((type) => MediaRecorder.isTypeSupported(type));
        if (!mimeType) {
          throw new Error("This browser cannot record WebM video");
        }

        mediaRecorder = new MediaRecorder(videoStream, {
          mimeType,
          videoBitsPerSecond: options.bitrate * 1000000,
        });

        const chunks: Blob[] = [];
        let recordedBytes = 0;

        mediaRecorder.ondataavailable = (e) => {
          if (settled || e.data.size === 0) return;
          recordedBytes += e.data.size;
          if (recordedBytes > limits.maxOutputBytes) {
            fail(new Error("Recorded video exceeds this browser processing limit"));
            return;
          }
          chunks.push(e.data);
        };

        mediaRecorder.onerror = () => fail(new Error("Error during recording"));

        mediaRecorder.onstop = () => {
          if (settled) return;
          cancelFrame();
          sourceVideo.pause();
          stopStreams();
          const webmBlob = new Blob(chunks, { type: "video/webm" });
          if (webmBlob.size === 0) {
            fail(new Error("Recording produced an empty video"));
            return;
          }

          if (options.format === "mp4") {
            onProgress(80, "converting");
            (async () => {
              const { createFFmpeg, fetchFile }: FFmpegModule = await import(
                "@ffmpeg/ffmpeg"
              );
              if (settled) return;
              ffmpeg = createFFmpeg({ log: false });
              let conversionProgress = 80;
              ffmpeg.setProgress(({ ratio }) => {
                if (!settled && Number.isFinite(ratio)) {
                  conversionProgress = Math.max(
                    conversionProgress,
                    Math.min(99, 80 + Math.floor(Math.max(0, ratio) * 19))
                  );
                  onProgress(
                    conversionProgress,
                    "converting"
                  );
                }
              });
              await ffmpeg.load();
              if (settled) return;

              ffmpeg.FS("writeFile", "input.webm", await fetchFile(webmBlob));

              await ffmpeg.run(
                "-i",
                "input.webm",
                "-c:v",
                "libx264",
                "-preset",
                "slow",
                "-b:v",
                `${options.bitrate}M`,
                "-c:a",
                "aac",
                "-b:a",
                "192k",
                "output.mp4"
              );
              if (settled) return;

              const data = ffmpeg.FS("readFile", "output.mp4");
              const mp4Blob = new Blob([new Uint8Array(data.buffer)], {
                type: "video/mp4",
              });
              if (mp4Blob.size === 0) {
                throw new Error("MP4 conversion produced an empty video");
              }
              if (mp4Blob.size > limits.maxOutputBytes) {
                throw new Error("MP4 output exceeds this browser processing limit");
              }
              finish({ blob: mp4Blob, fileSize: mp4Blob.size });
            })().catch((err) => {
              fail(new Error("MP4 conversion failed", { cause: err }));
            });
          } else {
            finish({ blob: webmBlob, fileSize: webmBlob.size });
          }
        };

        sourceVideo.onended = () => {
          cancelFrame();
          if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
          }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        mediaRecorder.start(1000);
        sourceVideo.play()
          .then(() => {
            if (document.hidden) handleVisibilityChange();
            else scheduleFrame();
          })
          .catch(() => fail(new Error("Failed to play source video")));
      } catch (error) {
        fail(
          error instanceof Error
            ? error
            : new Error("Failed to initialize video recording")
        );
      }
    };

    sourceVideo.onerror = () => fail(new Error("Error loading video file"));
  });
}
