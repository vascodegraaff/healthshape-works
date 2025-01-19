import { Camera, RotateCcw, Video, Square, Trash2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useCamera } from "@/hooks/useCamera";
import { useEffect, useRef, useState } from "react";
import { formatTime } from "@/lib/utils";
import { Textarea } from "./ui/textarea";

interface FormCheckCameraProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseName: string;
}

const FormCheckCamera = ({ open, onOpenChange, exerciseName }: FormCheckCameraProps) => {
  const { startCamera, stopCamera } = useCamera();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  const [improvementText, setImprovementText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    let mounted = true;

    const setupCamera = async () => {
      if (!open) return;
      if (recordedVideoUrl) return;

      // Wait for video element to be available
      const waitForVideo = () => {
        if (!videoRef.current) {
          if (mounted) {
            requestAnimationFrame(waitForVideo);
          }
          return;
        }

        try {
          console.log('Setting up camera...');
          startCamera(videoRef.current);
          console.log('Camera started successfully');
        } catch (error) {
          console.error('Camera setup failed:', error);
        }
      };

      waitForVideo();
    };

    setupCamera();

    return () => {
      mounted = false;
      console.log('Cleaning up camera...');
      if (videoRef.current) {
        stopCamera(videoRef.current);
        console.log('Camera stopped');
      }
      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
      }
    };
  }, [open, startCamera, stopCamera, recordedVideoUrl]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    if (!videoRef.current?.srcObject) return;
    setRecordingTime(0);
    setRecordedVideoUrl(null);

    const stream = videoRef.current.srcObject as MediaStream;
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      chunksRef.current = [];
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsAnalyzing(true);
      
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 2000);
    }
  };

  const handleDiscardRecording = async () => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
      setRecordedVideoUrl(null);
      if (videoRef.current) {
        await startCamera(videoRef.current);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 py-2 border-b">
          <DialogTitle>
            Form Check: {exerciseName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="w-full bg-black p-2">
            <div className="relative mx-auto" style={{ width: '75vw', maxWidth: '400px' }}>
              <div className="relative pt-[133.33%] rounded-2xl overflow-hidden bg-black/50">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted={!recordedVideoUrl}
                  controls={!!recordedVideoUrl}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl scale-x-[-1]"
                  src={recordedVideoUrl || undefined}
                />
                
                {isRecording && (
                  <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white flex items-center z-10">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
                    {formatTime(recordingTime)}
                  </div>
                )}

                {!recordedVideoUrl && (
                  <div className="absolute bottom-4 inset-x-4 flex justify-center gap-2 z-10">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                      onClick={() => {/* Handle flip camera */}}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Flip Camera
                    </Button>
                    <Button 
                      variant="secondary"
                      size="sm" 
                      className={`${
                        isRecording 
                          ? 'bg-red-500/50 hover:bg-red-500/70' 
                          : 'bg-black/50 hover:bg-black/70'
                      } backdrop-blur-sm`}
                      onClick={isRecording ? handleStopRecording : handleStartRecording}
                    >
                      {isRecording ? (
                        <>
                          <Square className="w-4 h-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4 mr-2" />
                          Record
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {recordedVideoUrl && (
                  <div className="absolute bottom-4 inset-x-4 flex justify-center gap-2 z-10">
                    <Button 
                      variant="secondary"
                      size="sm" 
                      className="bg-red-500/50 hover:bg-red-500/70 backdrop-blur-sm"
                      onClick={handleDiscardRecording}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Discard
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Suggestions Area */}
          <div className="flex-1 bg-background border-t overflow-y-auto">
            {isAnalyzing ? (
              <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-accent mb-4" />
                <h3 className="text-lg font-medium">Analyzing Form</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Our AI is reviewing your deadlift technique...
                </p>
              </div>
            ) : recordedVideoUrl ? (
              <div className="p-4 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">AI Form Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                      <div>
                        <p className="font-medium">Good Hip Hinge</p>
                        <p className="text-sm text-muted-foreground">
                          Your hip hinge movement is solid, maintaining a neutral spine throughout the lift
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                      <div>
                        <p className="font-medium">Bar Path</p>
                        <p className="text-sm text-muted-foreground">
                          Keep the barbell closer to your shins and thighs during the movement. The bar is drifting slightly forward
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                      <div>
                        <p className="font-medium">Setup Position</p>
                        <p className="text-sm text-muted-foreground">
                          Good shoulder position over the bar. Remember to engage your lats by "protecting your armpits"
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                      <div>
                        <p className="font-medium">Lockout</p>
                        <p className="text-sm text-muted-foreground">
                          Complete the lockout by squeezing your glutes at the top. Avoid overextending your lower back
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                      <div>
                        <p className="font-medium">Breathing</p>
                        <p className="text-sm text-muted-foreground">
                          Good bracing. Continue taking a big breath at the bottom and maintaining tension throughout the lift
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Personal Notes</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your own observations or things to improve for next time
                  </p>
                  <Textarea
                    value={improvementText}
                    onChange={(e) => setImprovementText(e.target.value)}
                    placeholder="Example: Need to work on maintaining form during the last few reps..."
                    className="min-h-[100px] resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        console.log('Saving notes:', improvementText);
                      }}
                    >
                      Save Notes
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-4 text-center text-muted-foreground">
                <div className="max-w-md space-y-2">
                  <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <h3 className="text-lg font-medium text-foreground">
                    Record Your Form
                  </h3>
                  <p className="text-sm">
                    Record a video of your exercise form and get AI-powered feedback and suggestions for improvement
                  </p>
                  <p className="text-xs bg-muted/50 p-2 rounded-lg">
                    Tip: Try to record from an angle that shows your full range of motion
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormCheckCamera; 