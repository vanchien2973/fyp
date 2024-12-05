import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { TvMinimalPlay } from 'lucide-react';

const CourseContentList = ({ 
  data, 
  activeVideo, 
  setActiveVideo, 
  activeSection, 
  setActiveSection, 
  isDemo
}) => {
  const [openSections, setOpenSections] = useState([]);

  const toggleSection = (sectionIndex) => {
    setOpenSections((prev) =>
      prev.includes(sectionIndex)
        ? prev.filter((i) => i !== sectionIndex)
        : [...prev, sectionIndex]
    );
  };

  const handleVideoClick = (sectionIndex, videoIndex) => {
    setActiveSection(sectionIndex);
    setActiveVideo(videoIndex);
  };

  return (
    <ScrollArea className={`mt-6 w-full ${!isDemo && 'sticky top-24 left-0 z-30'} max-h-[calc(100vh-200px)]`}>
      <Accordion type="multiple" value={openSections} onValueChange={setOpenSections} className="w-full">
        {data?.map((section, sectionIndex) => {
          const sectionVideos = section.content;
          const sectionVideoCount = sectionVideos.length;
          const sectionVideoLength = sectionVideos.reduce(
            (totalLength, item) => totalLength + item.videoLength, 0
          );
          const sectionContentHours = sectionVideoLength / 60;

          return (
            <AccordionItem 
              key={section._id} 
              value={sectionIndex.toString()}
              className="border-b border-gray-200 dark:border-gray-700"
            >
              <AccordionTrigger
                onClick={() => toggleSection(sectionIndex)}
                className="hover:no-underline"
              >
                <div className="w-full text-left">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{section.videoSection}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {sectionVideoCount} Lessons · {' '}
                    {sectionVideoLength < 60
                      ? sectionVideoLength
                      : sectionContentHours.toFixed(2)}{' '}
                    {sectionVideoLength > 60 ? 'hours' : 'minutes'}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {sectionVideos.map((video, videoIndex) => {
                  const globalVideoIndex = sectionIndex * 100 + videoIndex; // Unique index for each video
                  const contentLength = video.videoLength / 60;
                  return (
                    <Button
                      key={video._id}
                      variant="ghost"
                      className={`w-full justify-start text-left mb-2 ${
                        globalVideoIndex === activeVideo ? 'bg-gray-100 dark:bg-gray-800' : ''
                      }`}
                      onClick={() => handleVideoClick(sectionIndex, videoIndex)} // Set the global video index
                    >
                      <TvMinimalPlay size={20} className="mr-3 text-blue-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">{video.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {video.videoLength > 60
                            ? `${contentLength.toFixed(2)} hours`
                            : `${video.videoLength} minutes`}
                        </p>
                      </div>
                    </Button>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </ScrollArea>
  );
};

export default CourseContentList;
