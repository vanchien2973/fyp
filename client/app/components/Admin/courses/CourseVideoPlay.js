'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const CourseVideoPlay = ({ videoUrl, title }) => {
    const [videoData, setVideoData] = useState({
        otp: '',
        playbackInfo: '',
    });

    useEffect(() => {
        axios.post(`http://localhost:4000/api/v1/getVdoCipherOtp`, {
            videoUrl: videoUrl,
        }).then((res) => {
            setVideoData(res.data);
        })
    }, [videoUrl]);

    return (
        <div style={{ paddingTop: '41%', position: 'relative' }}>
            {
                videoData.otp && videoData.playbackInfo !== '' && (
                    <iframe
                        src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData?.playbackInfo}&player=bCOfBDVJgrAB82Er`}
                        style={{
                            border: 0,
                            width: '90%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        }}
                        allow="encrypted-media"
                        allowfullscreen={true}
                    ></iframe>
                )
            }
        </div>
    )
}

export default CourseVideoPlay;
