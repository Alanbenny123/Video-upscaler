"use client";

import { useState, useRef, useEffect } from "react";
import { Resolution, resolutionSettings } from "./utils/resolutions";
import {
  getVideoInfo,
  formatFileSize,
  upscaleVideo,
} from "./utils/video-upscaler";
import Header from "./components/Header";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [processedVideoSrc, setProcessedVideoSrc] = useState<string | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resolution, setResolution] = useState<Resolution>("1080p");
  const [bitrate, setBitrate] = useState<number>(50); // Default 50 Mbps
  const [format, setFormat] = useState<"webm" | "mp4">("mp4");
  const [videoInfo, setVideoInfo] = useState<{
    width: number;
    height: number;
    duration: number;
    fileSize: number;
  } | null>(null);
  const [processedSize, setProcessedSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortController = useRef<AbortController | null>(null);

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
    setFormat(e.target.value as "webm" | "mp4");
  };

  const startUpscaling = async () => {
    if (!selectedFile) return;

    try {
      setIsProcessing(true);
      setProgress(0);
      setError(null);

      // Create new abort controller
      abortController.current = new AbortController();

      const result = await upscaleVideo(
        selectedFile,
        { resolution, bitrate, format },
        (progress) => setProgress(progress),
        abortController.current.signal
      );

      const url = URL.createObjectURL(result.blob);
      setProcessedVideoSrc(url);
      setProcessedSize(result.fileSize);
    } catch (err: any) {
      // Only show error if not cancelled
      if (err.message !== "Operation cancelled") {
        console.error("Error during video processing:", err);
        setError(
          "An error occurred during video processing. Please try again."
        );
      }
    } finally {
      setIsProcessing(false);
      abortController.current = null;
    }
  };

  const cancelProcessing = () => {
    if (abortController.current) {
      abortController.current.abort();
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      {/* Hero section with uploader */}
      <section className="pt-10 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">Video Upscaler</h1>
            <p className="text-xl text-gray-300">
              Upscale your videos to higher resolutions using browser-native
              technology
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded">
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
                className="block w-full text-sm border border-gray-600 rounded p-2 bg-gray-700"
                disabled={isProcessing}
              />
            </div>

            {videoInfo && (
              <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">
                  Original Video Info
                </h3>
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
                  className="w-full max-h-64 rounded border border-gray-600"
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
                  className="block w-full p-2 border border-gray-600 rounded bg-gray-700"
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
                  className="block w-full p-2 border border-gray-600 rounded bg-gray-700"
                  disabled={!videoSrc || isProcessing}
                >
                  <option value="mp4">MP4 (Video)</option>
                  <option value="webm">WebM (Video)</option>
                </select>
              </div>
            </div>

            {videoSrc && (
              <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
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
                      ? (() => {
                          const target = resolutionSettings[resolution];
                          const assumedFps = 30; // rough default
                          const bitsPerPixelPerFrame = 0.1; // empirically ~0.1 for good quality VP9/H264
                          const maxReasonableBitrateMbps =
                            (target.width *
                              target.height *
                              assumedFps *
                              bitsPerPixelPerFrame) /
                            1_000_000;

                          const effectiveBitrate = bitrate;

                          const sizeBytes = Math.round(
                            (videoInfo.duration *
                              effectiveBitrate *
                              1_000_000) /
                              8
                          );

                          return formatFileSize(sizeBytes);
                        })()
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
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
            >
              {isProcessing ? `Processing... ${progress}%` : "Upscale Video"}
            </button>

            {isProcessing && (
              <button
                onClick={cancelProcessing}
                className="mt-2 w-full py-3 px-4 rounded font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Cancel Processing
              </button>
            )}

            {processedVideoSrc && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">
                    Upscaled Video ({resolution})
                  </h3>
                  {processedSize && (
                    <span className="text-lg font-bold bg-teal-900/30 p-2 rounded-md">
                      File Size: {formatFileSize(processedSize)}
                    </span>
                  )}
                </div>
                {
                  <video
                    src={processedVideoSrc}
                    controls
                    className="w-full max-h-64 rounded border border-gray-600"
                    key={format}
                  />
                }
                <div className="mt-3 flex justify-between">
                  <a
                    href={processedVideoSrc}
                    download={`upscaled-${resolution}.${format}`}
                    className="inline-block bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
                  >
                    Download Video
                  </a>
                  {videoInfo && processedSize && (
                    <div className="text-sm bg-gray-700/50 p-2 rounded">
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
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-teal-900 text-teal-300 mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400">
              Everything you need to upscale videos quickly and easily
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="w-14 h-14 bg-teal-900/50 rounded-full flex items-center justify-center mb-6 text-teal-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">100% Free</h3>
              <p className="text-gray-400">
                No hidden fees, subscriptions, or limits. Upscale unlimited
                videos without paying a cent.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="w-14 h-14 bg-teal-900/50 rounded-full flex items-center justify-center mb-6 text-teal-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Private & Secure</h3>
              <p className="text-gray-400">
                Your videos never leave your device. All processing happens
                right in your browser.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="w-14 h-14 bg-teal-900/50 rounded-full flex items-center justify-center mb-6 text-teal-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">High Quality</h3>
              <p className="text-gray-400">
                Advanced algorithms preserve detail while increasing resolution
                for stunning results.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="w-14 h-14 bg-teal-900/50 rounded-full flex items-center justify-center mb-6 text-teal-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Easy to Use</h3>
              <p className="text-gray-400">
                Simple interface with preview lets you upscale videos in just a
                few clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-20 px-4 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-teal-900 text-teal-300 mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Upscale your videos in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="w-10 h-10 flex items-center justify-center bg-teal-500 text-white rounded-full">
                  1
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-8 pt-10">
                <div className="flex justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-teal-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">
                  Upload Video
                </h3>
                <p className="text-gray-400 text-center">
                  Select a video from your device to begin the upscaling process
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="w-10 h-10 flex items-center justify-center bg-teal-500 text-white rounded-full">
                  2
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-8 pt-10">
                <div className="flex justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-teal-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">
                  Choose Settings
                </h3>
                <p className="text-gray-400 text-center">
                  Select your desired resolution, bitrate, and format
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="w-10 h-10 flex items-center justify-center bg-teal-500 text-white rounded-full">
                  3
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-8 pt-10">
                <div className="flex justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-teal-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center mb-3">Download</h3>
                <p className="text-gray-400 text-center">
                  Get your upscaled video in high quality, ready to use
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <a
              href="#"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-8 rounded-full transition-colors text-lg"
            >
              Try It Now
            </a>
          </div>
        </div>
      </section>

      {/* Trusted By Thousands Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands of satisfied users who upscale videos every day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 */}
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-4xl md:text-5xl font-bold text-teal-400 mb-2">
                10K+
              </div>
              <div className="text-gray-400">Videos Upscaled</div>
            </div>

            {/* Stat 2 */}
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-4xl md:text-5xl font-bold text-teal-400 mb-2">
                5K+
              </div>
              <div className="text-gray-400">Happy Users</div>
            </div>

            {/* Stat 3 */}
            <div className="bg-gray-800 rounded-lg p-8 text-center">
              <div className="text-4xl md:text-5xl font-bold text-teal-400 mb-2">
                4.8/5
              </div>
              <div className="text-gray-400">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-teal-900 text-teal-300 mb-4">
              Got Questions?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400">
              Find answers to common questions about our video upscaler
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg divide-y divide-gray-700">
            {/* Question 1 */}
            <details className="p-6 group">
              <summary className="flex justify-between items-center cursor-pointer">
                <h5 className="text-lg font-medium">
                  Is this service completely free?
                </h5>
                <span className="transition group-open:rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-400">
                Yes, our video upscaler is 100% free with no hidden fees or
                subscription requirements. There are no limits on the number or
                size of videos you can upscale.
              </p>
            </details>

            {/* Question 2 */}
            <details className="p-6 group">
              <summary className="flex justify-between items-center cursor-pointer">
                <h5 className="text-lg font-medium">
                  How does browser-based upscaling work?
                </h5>
                <span className="transition group-open:rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-400">
                Our upscaler uses the Canvas API to process each frame of your
                video at a higher resolution. The MediaRecorder API then
                captures this output to create your new upscaled video. All
                processing happens locally in your browser.
              </p>
            </details>

            {/* Question 3 */}
            <details className="p-6 group">
              <summary className="flex justify-between items-center cursor-pointer">
                <h5 className="text-lg font-medium">
                  What video formats are supported?
                </h5>
                <span className="transition group-open:rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-400">
                You can input most common video formats that your browser
                supports (MP4, WebM, MOV, etc.). Upscaled videos can be
                downloaded in WebM or MP4 format.
              </p>
            </details>

            {/* Question 4 */}
            <details className="p-6 group">
              <summary className="flex justify-between items-center cursor-pointer">
                <h5 className="text-lg font-medium">
                  Is there a size limit for uploads?
                </h5>
                <span className="transition group-open:rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-400">
                There's no hard limit, but browser processing is more suitable
                for shorter videos. We recommend videos under 10 minutes for the
                best experience. Larger videos might take longer to process and
                use more system resources.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-3 md:mb-0">
            © 2025 Application. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <a
              href="/terms"
              className="text-gray-400 hover:text-teal-300 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/privacy"
              className="text-gray-400 hover:text-teal-300 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/contact"
              className="text-gray-400 hover:text-teal-300 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
