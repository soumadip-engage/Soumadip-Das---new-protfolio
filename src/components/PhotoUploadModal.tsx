import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Check, X, RefreshCw, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { optimizeImageFile } from '../utils/mediaStorage';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl: string;
  onSaveAvatar: (newAvatarUrl: string) => void;
  onResetDefault?: () => void;
  isCustomAvatar: boolean;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  onSaveAvatar,
  onResetDefault,
  isCustomAvatar,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPEG, PNG, WEBP, or HEIC).');
      return;
    }

    // Limit to 15MB before optimization
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 15MB. Please choose a smaller image.');
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const optimizedUrl = await optimizeImageFile(file);
      setPreviewUrl(optimizedUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process image file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmSave = () => {
    if (previewUrl) {
      onSaveAvatar(previewUrl);
      onClose();
    }
  };

  const handleReset = () => {
    if (onResetDefault) {
      onResetDefault();
      setPreviewUrl(null);
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Update Profile Picture
                </h3>
                <p className="text-xs text-stone-500">
                  Upload directly from your files (one-time permanent save)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Error banner */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />

            {/* Preview or Upload Zone */}
            {previewUrl ? (
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-md border-2 border-emerald-500 shrink-0">
                  <img
                    src={previewUrl}
                    alt="New profile preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                    New
                  </div>
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="text-sm font-bold text-stone-900">
                    {selectedFile?.name || 'Selected Image'}
                  </div>
                  <p className="text-xs text-stone-500">
                    Optimized for crystal-clear display on both desktop and mobile screens.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer pt-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Choose another file</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                    : 'border-stone-300 hover:border-emerald-500 bg-stone-50/70 hover:bg-stone-50'
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-stone-200 flex items-center justify-center text-emerald-600">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-stone-900">
                      Click to browse or drag & drop photo
                    </p>
                    <p className="text-xs text-stone-500">
                      Supports JPG, PNG, WEBP, HEIC from your files
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Select File</span>
                  </span>
                </div>
              </div>
            )}

            {/* Permanent Storage Notice */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-stone-700 space-y-1">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>One-Time Permanent Storage</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Once saved, your uploaded photo will be permanently stored in your browser and used across your entire portfolio, including the hero card, navbar, and video showcase.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-stone-50/80 border-t border-stone-100">
            <div>
              {isCustomAvatar && (
                <button
                  onClick={handleReset}
                  className="text-xs font-semibold text-stone-500 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Reset to Original Photo
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={!previewUrl || isProcessing}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save as Permanent Photo</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
