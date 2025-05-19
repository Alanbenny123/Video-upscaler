"use client";

import { useState, useRef, useEffect } from "react";
import { Resolution, resolutionSettings } from "./utils/resolutions";
import {
  getVideoInfo,
  formatFileSize,
  upscaleVideo,
} from "./utils/video-upscaler";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [processedVideoSrc, setProcessedVideoSrc] = useState<string | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resolution, setResolution] = useState<Resolution>("1080p");
  const [bitrate, setBitrate] = useState<number>(20); // Default 20 Mbps
  const [format, setFormat] = useState<"webm">("webm");
  const [videoInfo, setVideoInfo] = useState<{
    width: number;
    height: number;
    duration: number;
    fileSize: number;
  } | null>(null);
  const [processedSize, setProcessedSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = URL.createObjectURL(file);
      setSelectedFile(file);
      setVideoSrc(url);
      setProcessedVideoSrc(null);
      setProcessedSize(null);
      setError(null);

      // Get video metadata
      const info = await getVideoInfo(file);
      setVideoInfo(info);
    } catch (err) {
      setError("Error loading video file. Please try another file.");
      console.error(err);
    }
  };

  const handleResolutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setResolution(e.target.value as Resolution);
  };

  const handleBitrateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBitrate(parseInt(e.target.value));
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(e.target.value as "webm");
  };

  const startUpscaling = async () => {
    if (!selectedFile) return;

    try {
      setIsProcessing(true);
      setProgress(0);
      setError(null);

      const result = await upscaleVideo(
        selectedFile,
        { resolution, bitrate, format },
        (progress) => setProgress(progress)
      );

      const url = URL.createObjectURL(result.blob);
      setProcessedVideoSrc(url);
      setProcessedSize(result.fileSize);
    } catch (err) {
      console.error("Error during video processing:", err);
      setError("An error occurred during video processing. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gray-50">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-4">Video Upscaler</h1>
        <p className="text-center mb-8 text-gray-600">
          Upscale your videos to higher resolutions using browser-native
          technology
        </p>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Select Video File
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full text-sm border border-gray-300 rounded p-2"
              disabled={isProcessing}
            />
          </div>

          {videoInfo && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Original Video Info</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold">Resolution:</span>{" "}
                  {videoInfo.width}×{videoInfo.height}
                </div>
                <div>
                  <span className="font-semibold">Duration:</span>{" "}
                  {videoInfo.duration.toFixed(2)}s
                </div>
                <div>
                  <span className="font-semibold">File Size:</span>{" "}
                  {formatFileSize(videoInfo.fileSize)}
                </div>
                <div>
                  <span className="font-semibold">Aspect Ratio:</span>{" "}
                  {(videoInfo.width / videoInfo.height).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {videoSrc && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Original Video</h3>
              <video
                src={videoSrc}
                controls
                className="w-full max-h-64 rounded border"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Target Resolution
              </label>
              <select
                value={resolution}
                onChange={handleResolutionChange}
                className="block w-full p-2 border border-gray-300 rounded"
                disabled={!videoSrc || isProcessing}
              >
                <option value="480p">480p (SD)</option>
                <option value="720p">720p (HD)</option>
                <option value="1080p">1080p (Full HD)</option>
                <option value="1440p">1440p (QHD)</option>
                <option value="2K">2K</option>
                <option value="4K">4K (Ultra HD)</option>
                <option value="5K">5K</option>
                <option value="8K">8K</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Bitrate: {bitrate} Mbps
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={bitrate}
                onChange={handleBitrateChange}
                className="w-full"
                disabled={!videoSrc || isProcessing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Output Format
              </label>
              <select
                value={format}
                onChange={handleFormatChange}
                className="block w-full p-2 border border-gray-300 rounded"
                disabled={!videoSrc || isProcessing}
              >
                <option value="webm">WebM (Video+Audio)</option>
              </select>
            </div>
          </div>

          {videoSrc && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Target Settings</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold">Target Resolution:</span>{" "}
                  {resolutionSettings[resolution].width}×
                  {resolutionSettings[resolution].height}
                </div>
                <div>
                  <span className="font-semibold">Target Bitrate:</span>{" "}
                  {bitrate} Mbps
                </div>
                <div>
                  <span className="font-semibold">Estimated Size:</span>{" "}
                  {videoInfo
                    ? formatFileSize(
                        Math.round((videoInfo.duration * bitrate * 1000000) / 8)
                      )
                    : "-"}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={startUpscaling}
            disabled={!videoSrc || isProcessing}
            className={`w-full py-3 px-4 rounded font-medium text-white ${
              !videoSrc || isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isProcessing ? `Processing... ${progress}%` : "Upscale Video"}
          </button>

          {processedVideoSrc && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">
                  Upscaled {format === "mp3" ? "Audio" : "Video"} ({resolution})
                </h3>
                {processedSize && (
                  <span className="text-lg font-bold bg-green-100 p-2 rounded-md">
                    File Size: {formatFileSize(processedSize)}
                  </span>
                )}
              </div>
              {format !== "mp3" && (
                <video
                  src={processedVideoSrc}
                  controls
                  className="w-full max-h-64 rounded border"
                />
              )}
              {format === "mp3" && (
                <audio src={processedVideoSrc} controls className="w-full" />
              )}
              <div className="mt-3 flex justify-between">
                <a
                  href={processedVideoSrc}
                  download={`upscaled-${resolution}.webm`}
                  className="inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  Download Video
                </a>
                {videoInfo && processedSize && (
                  <div className="text-sm bg-blue-50 p-2 rounded">
                    <span className="font-semibold">Size comparison: </span>
                    Original: {formatFileSize(videoInfo.fileSize)} → New:{" "}
                    {formatFileSize(processedSize)}(
                    {processedSize > videoInfo.fileSize
                      ? `+${(
                          (processedSize / videoInfo.fileSize - 1) *
                          100
                        ).toFixed(1)}%`
                      : `-${(
                          (1 - processedSize / videoInfo.fileSize) *
                          100
                        ).toFixed(1)}%`}
                    )
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
