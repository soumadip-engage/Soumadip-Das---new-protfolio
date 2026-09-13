import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Pause, Play, RotateCcw, Sparkles, Mic, Upload, 
  Check, AlertCircle, FileAudio, ExternalLink, ChevronDown, ChevronUp, Radio, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { speakText, stopSpeech, pauseSpeech, resumeSpeech } from '../utils/voice';
import { getStoredVoiceAudio, saveStoredVoiceAudio, removeStoredVoiceAudio } from '../utils/mediaStorage';
import { AudioRecorder } from '../utils/audioRecorder';

interface VoicePlayerProps {
  textToSpeak?: string;
  authorName?: string;
  compact?: boolean;
}

const REFERENCE_SENTENCES = [
  "Hi, I am Soumadip Das, an Information Technology student and AI and software developer, passionate about building practical, intelligent, and impactful technology solutions.",
  "As a 1× Hackathon Winner, I enjoy turning ideas into working products through problem-solving, software development, AI, and data-driven technologies.",
  "I have hands-on experience with Python, Java, C, C++, SQL, SQLite, HTML, CSS, JavaScript, Git, GitHub, Power BI, and Generative AI.",
  "My project experience includes SecureFlow AI, an AI-powered UPI fraud detection system and prevention platform developed for a national-level hackathon.",
  "Beyond development, I have experience in AI training, research, digital marketing, community engagement, and team leadership.",
  "I am continuously learning, experimenting with new technologies, and looking for opportunities to build solutions that solve real-world problems."
];

export const VoicePlayer: React.FC<VoicePlayerProps> = ({ 
  textToSpeak, 
  authorName = 'Soumadip Das',
  compact = false
}) => {
  const fullText = textToSpeak || REFERENCE_SENTENCES.join(' ');

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(0);
  const [showStudioModal, setShowStudioModal] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  // Custom Audio State
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(65); // ~65 seconds based on reference video
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedPreviewUrl, setRecordedPreviewUrl] = useState<string | null>(null);
  const [recorderError, setRecorderError] = useState<string | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<any>(null);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom voice audio from storage on mount
  useEffect(() => {
    getStoredVoiceAudio().then((stored) => {
      if (stored) {
        setCustomAudioUrl(stored);
      }
    });

    return () => {
      stopSpeech();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Update audio playback rate if custom audio is active
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, [rate]);

  // Main Toggle Play / Pause
  const handlePlayToggle = () => {
    if (isPlaying) {
      if (isPaused) {
        if (customAudioUrl && audioRef.current) {
          audioRef.current.play();
        } else {
          resumeSpeech();
        }
        setIsPaused(false);
      } else {
        if (customAudioUrl && audioRef.current) {
          audioRef.current.pause();
        } else {
          pauseSpeech();
        }
        setIsPaused(true);
      }
    } else {
      // Start fresh playback
      setIsPlaying(true);
      setIsPaused(false);

      if (customAudioUrl) {
        // Play authentic recorded voice audio
        if (!audioRef.current) {
          audioRef.current = new Audio(customAudioUrl);
        } else {
          audioRef.current.src = customAudioUrl;
        }

        audioRef.current.playbackRate = rate;
        audioRef.current.currentTime = 0;

        audioRef.current.ontimeupdate = () => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            const total = audioRef.current.duration || 65;
            setDuration(total);

            // Approximate sentence tracking
            const progress = audioRef.current.currentTime / total;
            const sIdx = Math.min(
              REFERENCE_SENTENCES.length - 1,
              Math.floor(progress * REFERENCE_SENTENCES.length)
            );
            setActiveSentenceIndex(sIdx);
          }
        };

        audioRef.current.onended = () => {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentTime(0);
          setActiveSentenceIndex(0);
        };

        audioRef.current.play().catch((err) => {
          console.warn('Audio play failed, falling back to speech synthesis:', err);
          fallbackToSpeechSynthesis();
        });
      } else {
        fallbackToSpeechSynthesis();
      }
    }
  };

  const fallbackToSpeechSynthesis = () => {
    speakText(
      fullText,
      rate * 0.94,
      0.92,
      () => {
        setIsPlaying(false);
        setIsPaused(false);
        setActiveSentenceIndex(0);
      },
      () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      (charIndex, totalLength) => {
        const progress = charIndex / (totalLength || 1);
        const sIdx = Math.min(
          REFERENCE_SENTENCES.length - 1,
          Math.floor(progress * REFERENCE_SENTENCES.length)
        );
        setActiveSentenceIndex(sIdx);
      }
    );
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    stopSpeech();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
    setActiveSentenceIndex(0);
  };

  const handleSpeedToggle = () => {
    const newRate = rate === 1.0 ? 1.2 : rate === 1.2 ? 0.9 : 1.0;
    setRate(newRate);
    if (isPlaying && !customAudioUrl) {
      stopSpeech();
      fallbackToSpeechSynthesis();
    }
  };

  // Upload Voice Audio File (.mp3, .m4a, .wav, .webm, or video)
  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRecorderError(null);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        await saveStoredVoiceAudio(dataUrl);
        setCustomAudioUrl(dataUrl);
        setRecordedPreviewUrl(null);
        setShowStudioModal(false);
      };
      reader.onerror = () => {
        setRecorderError('Failed to read the audio file.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Mic Recording
  const startRecording = async () => {
    setRecorderError(null);
    try {
      const recorder = new AudioRecorder();
      recorderRef.current = recorder;
      await recorder.start();
      setIsRecording(true);
      setRecordSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      setRecorderError(err.message || 'Microphone access denied.');
    }
  };

  // Stop Mic Recording
  const stopRecording = async () => {
    if (!recorderRef.current) return;
    try {
      clearInterval(timerRef.current);
      const dataUrl = await recorderRef.current.stop();
      setIsRecording(false);
      setRecordedPreviewUrl(dataUrl);
    } catch (err: any) {
      setRecorderError(err.message || 'Recording failed.');
      setIsRecording(false);
    }
  };

  // Save Recorded Voice Permanently
  const handleSaveRecording = async () => {
    if (recordedPreviewUrl) {
      await saveStoredVoiceAudio(recordedPreviewUrl);
      setCustomAudioUrl(recordedPreviewUrl);
      setRecordedPreviewUrl(null);
      setShowStudioModal(false);
    }
  };

  // Reset Voice to Default Synthesis
  const handleResetVoice = async () => {
    handleStop();
    await removeStoredVoiceAudio();
    setCustomAudioUrl(null);
    setRecordedPreviewUrl(null);
  };

  // Format seconds as MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      {/* Primary Voice Player Bar */}
      <div className="inline-flex flex-wrap items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-white/95 border border-stone-200/90 shadow-xs backdrop-blur-md">
        {/* Play/Pause Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handlePlayToggle}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
            isPlaying && !isPaused
              ? 'bg-emerald-600 text-white shadow-emerald-200'
              : 'bg-stone-900 hover:bg-stone-800 text-white'
          }`}
          title={isPlaying && !isPaused ? 'Pause Voice Intro' : 'Listen to Soumadip’s Voice Intro'}
        >
          {isPlaying && !isPaused ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{customAudioUrl ? "Hear My Voice" : "Hear Bio Aloud"}</span>
            </>
          )}
        </motion.button>

        {/* Animated Sound Waves */}
        <div className="flex items-center gap-0.5 px-2 h-5">
          {[40, 80, 100, 60, 95, 50, 75].map((height, idx) => (
            <motion.div
              key={idx}
              animate={
                isPlaying && !isPaused
                  ? {
                      height: ['25%', `${height}%`, '30%'],
                    }
                  : { height: '25%' }
              }
              transition={
                isPlaying && !isPaused
                  ? {
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      delay: idx * 0.08,
                    }
                  : { duration: 0.3 }
              }
              className={`w-1 rounded-full transition-colors ${
                isPlaying && !isPaused ? 'bg-emerald-600' : 'bg-stone-300'
              }`}
            />
          ))}
        </div>

        {/* Badge: Authentic vs Studio */}
        <div className="hidden sm:flex items-center">
          {customAudioUrl ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/80">
              <Check className="w-2.5 h-2.5 text-emerald-600" />
              <span>Authentic Voice</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium border border-stone-200">
              <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
              <span>Voice Intro</span>
            </span>
          )}
        </div>

        {/* Studio / Custom Voice Manager Button */}
        <button
          onClick={() => setShowStudioModal(true)}
          className="p-1.5 rounded-xl text-stone-500 hover:text-emerald-700 hover:bg-stone-100 transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer border border-transparent hover:border-stone-200"
          title="Voice Options & Authentic Audio Setup"
        >
          <Mic className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden md:inline text-[11px]">Voice Studio</span>
        </button>

        {/* Transcript toggle */}
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg transition-colors cursor-pointer"
          title={showTranscript ? "Hide Transcript" : "View Live Spoken Transcript"}
        >
          {showTranscript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Playback Controls (Speed & Reset) */}
        {isPlaying && (
          <div className="flex items-center gap-1 border-l border-stone-200 pl-1.5">
            <button
              onClick={handleSpeedToggle}
              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
              title="Toggle playback speed"
            >
              {rate}x
            </button>
            <button
              onClick={handleStop}
              className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded cursor-pointer"
              title="Stop voice"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Expandable Live Subtitle / Transcript Viewer */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mt-2 p-4 rounded-2xl bg-white border border-stone-200 shadow-sm text-xs space-y-2 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Reference Spoken Transcript
                </span>
                <span className="text-stone-400 text-[11px]">
                  Soumadip Das (65s)
                </span>
              </div>
              <button
                onClick={() => setShowStudioModal(true)}
                className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>Upload My Voice File</span>
              </button>
            </div>

            <div className="space-y-1.5 pt-1 text-stone-600 leading-relaxed max-h-48 overflow-y-auto pr-1">
              {REFERENCE_SENTENCES.map((sentence, idx) => (
                <p
                  key={idx}
                  className={`p-2 rounded-xl transition-all ${
                    isPlaying && activeSentenceIndex === idx
                      ? 'bg-emerald-50 text-emerald-950 font-medium border-l-2 border-emerald-600 shadow-2xs'
                      : 'hover:bg-stone-50'
                  }`}
                >
                  {sentence}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Studio Modal: Upload Audio or Record Authentic Voice */}
      <AnimatePresence>
        {showStudioModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isRecording) setShowStudioModal(false);
              }}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">
                      Authentic Voice Integration
                    </h3>
                    <p className="text-xs text-stone-500">
                      Use your genuine human voice instead of AI synthesis
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowStudioModal(false)}
                  disabled={isRecording}
                  className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer disabled:opacity-30"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                {/* Error Banner */}
                {recorderError && (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>{recorderError}</span>
                  </div>
                )}

                {/* Current Voice Status */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-stone-400 uppercase">Current Voice Mode</span>
                    <p className="text-sm font-bold text-stone-900 mt-0.5">
                      {customAudioUrl ? 'Authentic Human Recording (Active)' : 'Natural Studio Speech Cadence'}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {customAudioUrl
                        ? 'Visitors hear your genuine voice recording across your portfolio.'
                        : 'Currently using speech synthesis. Upload your audio file or record below to make it 100% authentic!'}
                    </p>
                  </div>
                  {customAudioUrl && (
                    <button
                      onClick={handleResetVoice}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-rose-600 bg-white border border-stone-200 hover:border-rose-200 transition-colors cursor-pointer shrink-0 ml-3"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Option 1: Upload Audio File */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Option A: Upload Audio Track (.mp3, .m4a, .wav)
                    </span>
                    <span className="text-[11px] text-stone-400">Fastest</span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="audio/*,video/*"
                    onChange={handleAudioFileUpload}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-2xl p-5 text-center cursor-pointer bg-stone-50/60 hover:bg-emerald-50/40 transition-all flex flex-col items-center justify-center space-y-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-stone-200 flex items-center justify-center text-emerald-600">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">
                        Choose voice audio or video file from your computer/phone
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Extracts audio directly from MP3, M4A, WAV, or MP4
                      </p>
                    </div>
                  </div>
                </div>

                {/* Option 2: Record Live with Microphone */}
                <div className="space-y-3 border-t border-stone-100 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Option B: Record Authentic Voice Live
                    </span>
                    <span className="text-[11px] text-stone-400">Direct Mic</span>
                  </div>

                  {isRecording ? (
                    <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-3">
                      <div className="flex items-center justify-center gap-2 text-rose-700 font-bold text-sm">
                        <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                        <span>Recording in progress... {formatTime(recordSeconds)}</span>
                      </div>
                      <p className="text-xs text-stone-600">
                        Read through the bio intro at a steady, natural pace.
                      </p>
                      <button
                        onClick={stopRecording}
                        className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
                      >
                        <Pause className="w-4 h-4 fill-current" />
                        <span>Stop & Preview Recording</span>
                      </button>
                    </div>
                  ) : recordedPreviewUrl ? (
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900">
                          Recording Ready ({formatTime(recordSeconds)})
                        </span>
                        <button
                          onClick={startRecording}
                          className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline cursor-pointer"
                        >
                          Re-record
                        </button>
                      </div>

                      <audio
                        src={recordedPreviewUrl}
                        controls
                        className="w-full h-10 rounded-xl"
                      />

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => setRecordedPreviewUrl(null)}
                          className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                        >
                          Discard
                        </button>
                        <button
                          onClick={handleSaveRecording}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save as Permanent Voice</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-stone-900">
                          Record with your device microphone
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Speaks directly into the browser and saves permanently.
                        </p>
                      </div>
                      <button
                        onClick={startRecording}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer shrink-0"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Start Recording</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Reference Script to Read */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                  <div className="font-bold text-stone-900">Reference Spoken Script:</div>
                  <p className="text-stone-600 italic leading-relaxed text-[11px]">
                    "{fullText}"
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end">
                <button
                  onClick={() => setShowStudioModal(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
