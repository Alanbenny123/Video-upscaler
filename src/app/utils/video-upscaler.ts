import { Resolution, resolutionSettings } from "./resolutions";

interface VideoInfo {
  width: number;
  height: number;
  duration: number;
  fileSize: number;
}

interface UpscaleOptions {
  resolution: Resolution;
  bitrate: number; // in Mbps
  format?: "webm" | "mp4" | "mp3"; // Add format option
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
  onProgress: (progress: number) => void
): Promise<{ blob: Blob; fileSize: number }> {
  return new Promise((resolve, reject) => {
    const sourceVideo = document.createElement("video");
    sourceVideo.src = URL.createObjectURL(file);
    sourceVideo.muted = true;

    const targetDimensions = resolutionSettings[options.resolution];
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    if (!ctx) {
      reject(new Error("Failed to get canvas context"));
      return;
    }

    sourceVideo.onloadedmetadata = () => {
      // Decide which side to fit based on orientation to keep original aspect ratio with NO black bars.
      let newWidth: number;
      let newHeight: number;

      if (sourceVideo.videoWidth >= sourceVideo.videoHeight) {
        // Landscape – fit width to target width
        const scale = targetDimensions.width / sourceVideo.videoWidth;
        newWidth = targetDimensions.width;
        newHeight = Math.round(sourceVideo.videoHeight * scale);
      } else {
        // Portrait – fit height to target height
        const scale = targetDimensions.height / sourceVideo.videoHeight;
        newHeight = targetDimensions.height;
        newWidth = Math.round(sourceVideo.videoWidth * scale);
      }

      // Resize canvas to the exact scaled dimensions (no letterboxing)
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Create MediaRecorder with appropriate settings
      const videoStream = canvas.captureStream();
      const audioStream = sourceVideo.captureStream().getAudioTracks()[0];
      if (audioStream) {
        videoStream.addTrack(audioStream);
      }

      const mimeType =
        options.format === "mp4"
          ? "video/mp4;codecs=h264,opus"
          : options.format === "mp3"
          ? "audio/mp3"
          : "video/webm;codecs=vp9,opus";

      const mediaRecorder = new MediaRecorder(videoStream, {
        mimeType,
        videoBitsPerSecond: options.bitrate * 1000000,
      });

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        URL.revokeObjectURL(sourceVideo.src);
        const blob = new Blob(chunks, {
          type:
            options.format === "mp4"
              ? "video/mp4"
              : options.format === "mp3"
              ? "audio/mp3"
              : "video/webm",
        });
        resolve({
          blob,
          fileSize: blob.size,
        });
      };

      sourceVideo.play();
      mediaRecorder.start(1000);

      let lastProcessedTime = 0;
      const videoDuration = sourceVideo.duration;

      function processFrame() {
        if (sourceVideo.ended || sourceVideo.paused) {
          mediaRecorder.stop();
          return;
        }

        // Draw video directly to fit canvas preserving aspect ratio (no padding)
        ctx.drawImage(sourceVideo, 0, 0, newWidth, newHeight);

        const currentProgress = (sourceVideo.currentTime / videoDuration) * 100;
        if (
          Math.floor(currentProgress) >
          Math.floor((lastProcessedTime / videoDuration) * 100)
        ) {
          onProgress(Math.floor(currentProgress));
          lastProcessedTime = sourceVideo.currentTime;
        }

        requestAnimationFrame(processFrame);
      }

      processFrame();
    };

    sourceVideo.onerror = () => {
      URL.revokeObjectURL(sourceVideo.src);
      reject(new Error("Error loading video file"));
    };
  });
}
