'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const CourseVideoPlay = ({ videoUrl }) => {
    const [videoData, setVideoData] = useState({
        otp: '',
        playbackInfo: '',
    });

    useEffect(() => {        
        axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}get-vdo-cipher-otp`, {
            videoId: videoUrl,
        })
        .then((res) => {
            setVideoData(res.data);
        })
    }, [videoUrl]);

    return (
        <div style={{ paddingTop: '50%', position: 'relative', overflow: 'hidden'}}>
            {videoData.otp && videoData.playbackInfo !== '' && (
                <iframe
                    src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=j6eioHedW9b1nxkX`}
                    style={{
                        border: 0,
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                    allow="encrypted-media"
                    allowfullscreen={true}
                ></iframe>
            )}
        </div>
    );
};

export default CourseVideoPlay;
