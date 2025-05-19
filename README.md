# Video Upscaler

A web application that allows users to upscale videos to various resolutions (480p to 8K) directly in the browser using HTML5 Canvas and MediaRecorder APIs.

## Features

- Upload videos from your device
- Display original video information (resolution, size, duration)
- Choose from multiple target resolutions (480p, 720p, 1080p, 1440p, 2K, 4K, 5K, 8K)
- Adjust bitrate for quality/size control (5-100 Mbps)
- See estimated file size before processing
- Real-time progress tracking during upscaling
- Compare original and processed file sizes
- Download the upscaled video in WebM format

## Technology

- Next.js 15 (React framework)
- TypeScript
- HTML5 Canvas API for frame-by-frame video processing
- MediaRecorder API for capturing processed frames
- Tailwind CSS for styling

## How It Works

This application uses a browser-native approach to video upscaling:

1. The original video is played in a hidden `<video>` element
2. Each frame is drawn to a Canvas at the target resolution
3. The Canvas output is captured as a MediaStream
4. A MediaRecorder records this stream to create the new upscaled video
5. All processing happens locally in the browser - no server uploads required

## How to Run

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Click "Select Video File" to upload a video
2. View the original video information and preview
3. Choose your desired resolution and bitrate
4. Click "Upscale Video" to begin processing
5. Monitor the progress as the video is upscaled
6. Once complete, preview the result and compare file sizes
7. Download the upscaled video

## Notes

- Processing happens entirely in the browser, so performance depends on your device
- Higher resolutions and bitrates will produce larger output files
- The output format is WebM with VP9 codec, which has good browser compatibility
- For best results, use a source video with decent quality

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000] with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
