import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Headphones, Image, FileText, X } from 'lucide-react';
import { Button } from '../../ui/button';

const FilePreview = ({ file, type, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const url = createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file]);

  if (!previewUrl) return null;

  const isAudio = file.type.startsWith('audio/');
  const isImage = file.type.startsWith('image/');

  return (
    <Card className="mt-2">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isAudio && <Headphones className="w-5 h-5 text-blue-500" />}
            {isImage && <Image className="w-5 h-5 text-green-500" />}
            {!isAudio && !isImage && <FileText className="w-5 h-5 text-gray-500" />}

            <div className="flex flex-col">
              <span className="text-sm font-medium truncate max-w-[200px]">
                {file.name}
              </span>
              <span className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>

          {isImage && (
            <div className="ml-4">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-16 h-16 object-cover rounded"
                onError={() => setPreviewUrl(null)}
              />
            </div>
          )}

          {isAudio && (
            <div className="ml-4">
              <audio controls className="w-48 h-8">
                <source src={previewUrl} type={file.type} onError={() => setPreviewUrl(null)}/>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={onRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
const createObjectURL = (file) => {
  if (!file) return null;
  if (typeof file === 'string' && file.startsWith('blob:')) {
    return file;
  }
  if (file instanceof File) {
    return URL.createObjectURL(file);
  }
  if (typeof file === 'string') {
    return file;
  }
  return null;
};

export default FilePreview;