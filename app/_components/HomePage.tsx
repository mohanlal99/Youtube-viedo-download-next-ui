"use client";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";
import React, { useEffect, useState } from "react";
import VideoInfo from "./VideoInfo";
import axios from "axios";

const HomePage: React.FC = () => {
  const [url, setUrl] = useState("");
  const [videoData, setVideoData] = useState(null)


  useEffect(() => {
    if(url){
        getVideoInformation();
    }
  }, [url]);    

  const getVideoInformation  = async ()=>{
    const response = await axios.post('http://127.0.0.1:5000/video_info', {
        url: url
      });
      if (response.status === 200) {
        console.log(response.data);
        setVideoData(response.data)
      }
  }

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setUrl(e.target.value);
    console.log(e.target.value);
  };

  return (
    <div>
      <div className=" min-h-[100vh]">
        <h2 className="font-medium text-primary-700 text-center mt-4 sm:text-2xl md:text-4xl xl:text-5xl p-2 mb-2">
          Youtube Video Downloader
        </h2>
        <div className=" flex justify-center items-center">
          <Input
            onChange={handleChange}
            color="primary"
            variant="underlined"
            type="text"
            value={url}
            autoFocus
            placeholder="Enter YouTube Video URL"
            endContent={
              <Button radius="none" color="success" type="button">
                Download
              </Button>
            }
            className=" max-w-[350] sm:min-w-[320px] md:min-w-[600px] mt-4"
          />
        </div>
        <div className="md:max-w-5xl mx-auto bg-primary-50 ">
          {videoData&& <VideoInfo videoData={videoData} videourl={url}/>
          }
          
        </div>
      </div>
      <div className="bg-primary-50 p-2 ">
        <h2 className="text-center mt-3 p-5 text-xl sm:text-2xl md:text-3xl ">
          Sported Platform{" "}
        </h2>
        <div className="flex justify-center items-center">
          <Image width={200} alt="NextUI hero Image" src="/youtube.png" />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
