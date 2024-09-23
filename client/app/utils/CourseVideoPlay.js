'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const CourseVideoPlay = ({ videoUrl }) => {
    const [videoData, setVideoData] = useState({
        otp: '',
        playbackInfo: '',
    });

    useEffect(() => {
        axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}getVdoCipherOtp`, {
            videoId: videoUrl,
        })
        .then((res) => {
            setVideoData(res.data);
        })
        .catch((err) => {
            console.error("Error fetching OTP and playbackInfo:", err);
        });
    }, [videoUrl]);

    return (
        <div style={{ paddingTop: '50%', position: 'relative', overflow: 'hidden'}}>
            {videoData.otp && videoData.playbackInfo !== '' && (
                <iframe
                    src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=bCOfBDVJgrAB82Er`}
                    style={{
                        border: 0,
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                    allow="encrypted-media"
                    allowFullScreen={true}
                ></iframe>
            )}
        </div>
    );
};

export default CourseVideoPlay;
