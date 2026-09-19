import React, { useState, useEffect, useRef } from 'react';
import { Mail, MapPin, Send, CheckCircle2, Copy, Check, Mic, MicOff, AlertCircle, ExternalLink, RotateCcw, Github, Linkedin, Twitter, Radio, Sparkles, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioData } from '../types';
import { createSpeechRecognizer } from '../utils/voice';

interface ContactProps {
  data: PortfolioData;
}

export const Contact: React.FC<ContactProps> = ({ data }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSubmittedMessage, setLastSubmittedMessage] = useState<typeof formData | null>(null);

  // Voice Typing States
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const recipientEmail = data.email || 'soumadipd43@gmail.com';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSpeech = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      setVoiceSupported(hasSpeech);
    }
  }, []);

  const handleCopyEmail = () => {
    if (!recipientEmail) return;
    navigator.clipboard.writeText(recipientEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const toggleVoiceTyping = () => {
    setVoiceError(null);

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setFormData((prev) => ({
          ...prev,
          message: prev.message ? `${prev.message} ${transcript}`.trim() : transcript.trim(),
        }));
      },
      (error) => {
        setVoiceError(`Voice typing: ${error}. Check mic permissions.`);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (recognizer) {
      recognitionRef.current = recognizer;
      try {
        recognizer.start();
        setIsListening(true);
      } catch (e: any) {
        setVoiceError('Could not start voice recognizer.');
        setIsListening(false);
      }
    } else {
      setVoiceError('Speech recognition is not supported in this browser environment.');
    }
  };

  // Generate Mailto URL
  const getMailtoUrl = () => {
    const subject = encodeURIComponent(
      formData.subject
        ? `[Portfolio] ${formData.subject}`
        : `[Portfolio Inquiry] From ${formData.name || 'Visitor'}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    return `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const endpoint = `https://formsubmit.co/ajax/${recipientEmail}`;
      const payload = {
        name: formData.name,
        email: formData.email,
        _subject: `[Portfolio Inquiry from ${formData.name}] ${formData.subject || 'Project / Opportunity'}`,
        message: formData.message,
        _replyto: formData.email,
        _template: 'table',
        _captcha: 'false',
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result = await response.json();
      if (result.success === 'false' || result.success === false) {
        throw new Error(result.message || 'Failed to deliver message');
      }

      setLastSubmittedMessage({ ...formData });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.warn('FormSubmit dispatch notice:', err);
      setLastSubmittedMessage({ ...formData });
      setSubmitError(
        'Direct server dispatch was intercepted by network security. You can deliver this note directly via your Email client below with 1 click!'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmitError(null);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 border-t border-white/10 bg-[#050811] text-white relative overflow-hidden">
      {/* Background Ambient Cosmic Mesh */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden">
        <div className="w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full translate-x-48" />
        <div className="w-[450px] h-[450px] bg-indigo-600/10 blur-[150px] rounded-full -translate-x-48" />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-semibold mb-3">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>05 // COMMS TERMINAL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Initiate Contact
          </h2>
          <p className="text-sm sm:text-base text-stone-300 mt-2 max-w-xl">
            Have an engineering role, AI research collaboration, or hackathon project? Send a transmission below or use <strong>Voice Dictation</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Direct Verified Channels */}
          <div className="lg:col-span-5 space-y-4">
            {/* Primary Email Card */}
            <div className="p-5 rounded-2xl bg-white/5 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] backdrop-blur-md flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">Direct Verified Email</span>
                  <a
                    href={`mailto:${recipientEmail}`}
                    className="text-sm font-bold text-white hover:text-cyan-300 block mt-0.5 break-all font-mono"
                  >
                    {recipientEmail}
                  </a>
                  <p className="text-xs text-stone-400 mt-1">
                    Direct personal inbox. Responses typically within 24 hours.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCopyEmail}
                  className="p-2 text-stone-400 hover:text-cyan-300 hover:bg-white/10 rounded-xl transition-colors cursor-pointer border border-white/10"
                  title="Copy Email address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* GitHub Repository Card */}
            {data.social.github && (
              <a
                href={data.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10 text-white">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-stone-400">GitHub Codebase</div>
                    <div className="text-sm font-semibold text-white group-hover:text-cyan-300 font-mono">
                      @soumadip-engage
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-cyan-400 transition-colors" />
              </a>
            )}

            {/* LinkedIn Card */}
            {data.social.linkedin && (
              <a
                href={data.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/50 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-950/70 text-sky-400 border border-sky-500/30">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-stone-400">LinkedIn Network</div>
                    <div className="text-sm font-semibold text-white group-hover:text-sky-300 font-mono">
                      soumadip-das
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-sky-400 transition-colors" />
              </a>
            )}

            {/* Twitter / X Card */}
            {data.social.twitter && (
              <a
                href={data.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10 text-stone-300">
                    <Twitter className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-stone-400">X (Twitter)</div>
                    <div className="text-sm font-semibold text-white group-hover:text-cyan-300 font-mono">
                      @das_debu72623
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-cyan-400 transition-colors" />
              </a>
            )}

            {/* Location & Coordinates */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/10 text-cyan-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-stone-400">Base Coordinates</span>
                <p className="text-sm font-medium text-white font-mono mt-0.5">
                  {data.location || 'Haldia, West Bengal, India (22.06°N 88.06°E)'}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Open for remote engineering roles & global on-site relocation.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form Terminal */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#090d1a] border border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">
                      Transmission Dispatched!
                    </h3>
                    <p className="text-sm text-stone-300 max-w-md">
                      Your note has been transmitted to <strong>{recipientEmail}</strong>.
                    </p>
                  </div>

                  {lastSubmittedMessage && (
                    <div className="w-full max-w-md p-4 rounded-2xl bg-black/40 border border-white/10 text-left text-xs space-y-1.5 font-mono">
                      <div className="text-cyan-400 uppercase text-[10px]">Transmission Payload:</div>
                      <p className="text-stone-200"><strong>From:</strong> {lastSubmittedMessage.name} ({lastSubmittedMessage.email})</p>
                      {lastSubmittedMessage.subject && (
                        <p className="text-stone-200"><strong>Subject:</strong> {lastSubmittedMessage.subject}</p>
                      )}
                      <p className="text-stone-400 italic line-clamp-3">"{lastSubmittedMessage.message}"</p>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                    <button
                      onClick={resetForm}
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Transmit Another Note</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-semibold">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Transmission Notice</span>
                      </div>
                      <p className="text-amber-300 leading-relaxed">{submitError}</p>
                      <div className="pt-1 flex flex-wrap gap-2">
                        <a
                          href={getMailtoUrl()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white font-semibold text-xs hover:bg-white/20"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Open in Direct Email App</span>
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-cyan-300 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Elena Rostova"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono placeholder:text-stone-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-cyan-300 mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="elena@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono placeholder:text-stone-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-cyan-300 mb-1.5">
                      Subject / Topic
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. AI Security Architecture / Hackathon Lead / Opportunity"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono placeholder:text-stone-500"
                    />
                  </div>

                  {/* Message Field with Voice Typing Feature */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono text-cyan-300">
                        Message Payload *
                      </label>

                      {/* Voice Typing Button */}
                      <button
                        type="button"
                        onClick={toggleVoiceTyping}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isListening
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-white/10 hover:bg-white/15 text-cyan-300 border border-cyan-400/30'
                        }`}
                        title={isListening ? 'Click to stop dictation' : 'Click to voice type your message'}
                      >
                        {isListening ? (
                          <>
                            <MicOff className="w-3.5 h-3.5" />
                            <span>Listening... (Stop)</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Voice Dictate</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={
                          isListening
                            ? 'Speak now! Voice recognition converting audio stream into text...'
                            : 'Type your message or click "Voice Dictate" to speak...'
                        }
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white/5 border text-white text-sm focus:outline-none transition-all resize-y placeholder:text-stone-500 font-mono ${
                          isListening
                            ? 'border-cyan-400 ring-2 ring-cyan-400/40'
                            : 'border-white/15 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                        }`}
                      />

                      {isListening && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded-md border border-cyan-400/40">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                          <span className="text-[10px] font-mono text-cyan-300">STREAMING MIC</span>
                        </div>
                      )}
                    </div>

                    {voiceError && (
                      <p className="text-[11px] text-amber-400 mt-1 font-mono">
                        {voiceError}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Dispatching Transmission...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Transmit Message</span>
                        </>
                      )}
                    </button>

                    <a
                      href={getMailtoUrl()}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-stone-200 text-xs font-mono font-medium transition-all"
                      title="Open in default mail client"
                    >
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Open in Mail Client</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
