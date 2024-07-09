import React, { useState } from "react";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import axios from "axios";

const VideoInfo: React.FC<{ videoData: any; videourl: any }> = ({
  videoData,
  videourl,
}) => {
  const [videoStatus, setVideoStatus] = useState(null);

  function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const hoursStr = hours.toString().padStart(2, "0");
    const minutesStr = minutes.toString().padStart(2, "0");
    const secondsStr = remainingSeconds.toString().padStart(2, "0");

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  }

  function formatFileSize(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }

  const getVideoDownload = async (itag: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_FLASK_API_URL}/download`,
        { url: videourl, itag },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "video.mp4"); // or any other extension
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 place-items-center">
      <div className="max-w-xl col-span-1 md:col-span-1">
        <Image width={300} height={200} src={videoData.thumbnail_url} />
        <h2 className="md:text-2xl">{videoData.title}</h2>
        <h2>{videoData.author}</h2>
        <h2>Duration: {formatDuration(videoData.length)}</h2>
      </div>
      <div className="col-span-1 md:col-span-2 flex flex-col gap-3 items-center">
        <div className="overflow-x-auto">
          <table className="border-collapse border bg-primary-200">
            <thead className="bg-primary-200">
              <tr>
                <th className="p-2 px-8 md:px-10 border bg-secondary-100">Quality</th>
                <th className="p-2 px-8 md:px-10 border bg-secondary-100">File Size</th>
                <th className="p-2 px-8 md:px-10 border bg-secondary-100">Download</th>
              </tr>
            </thead>
            <tbody>
              {videoData.streams.map((item: { resolution: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | null | undefined; audio_codec: null; size: number; itag: any; }, index: React.Key | null | undefined) => (
                <tr key={index}>
                  <td className="p-1 border bg-primary-50">
                    {item.resolution}
                    {item.resolution === "720p" ? " HD" : item.resolution === "1080p" ? " Full HD" : ""}
                    {item.audio_codec == null ? " 🔇" : ""}
                  </td>
                  <td className="p-1 border bg-primary-50">{formatFileSize(item.size)}</td>
                  <td className="p-1 border bg-primary-50 text-end">
                    <Button
                      onClick={() => {
                        getVideoDownload(item.itag);
                      }}
                      radius="none"
                      color="success"
                    >
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
