"use client";

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import './subject.css';

export default function SubjectPage() {
    const params = useParams();
    const router = useRouter();
    const subjectName = decodeURIComponent(params.id || 'Subject');

    const [materialUploaded, setMaterialUploaded] = useState(false);
    const [showUploadOptions, setShowUploadOptions] = useState(false);
    const [showTextModal, setShowTextModal] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [materialType, setMaterialType] = useState('');

    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleTextUpload = () => {
        if (!textInput.trim()) return;
        setMaterialType('text');
        setMaterialUploaded(true);
        setShowTextModal(false);
        setMessages([{
            id: 1,
            role: 'ai',
            text: `I've processed your text notes for **${subjectName}**. I'm now trained on your material and ready to answer questions. Ask me anything!`
        }]);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setMaterialType('pdf');
        setMaterialUploaded(true);
        setShowUploadOptions(false);
        setMessages([{
            id: 1,
            role: 'ai',
            text: `I've processed your file **"${file.name}"** for **${subjectName}**. I'm now trained on your material and ready to answer questions. Ask me anything!`
        }]);
    };

    const handleSend = () => {
        if (!prompt.trim() || isLoading) return;
        const userMsg = { id: Date.now(), role: 'user', text: prompt };
        setMessages((prev) => [...prev, userMsg]);
        setPrompt('');
        setIsLoading(true);

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        setTimeout(() => {
            const responses = [
                `Based on your uploaded notes for **${subjectName}**, here's what I found:\n\nThis topic covers several key concepts. The material emphasizes understanding fundamentals before moving to advanced applications. Let me know if you'd like me to elaborate on any specific section.`,
                `Great question! From your **${subjectName}** notes, the answer involves multiple factors:\n\n1. The primary concept relates to the core principles discussed in your material\n2. There are practical applications mentioned in your notes\n3. The key takeaway is the relationship between theory and practice\n\nWould you like me to generate flashcards on this topic?`,
                `According to your **${subjectName}** material, this is an important concept. Your notes cover this in detail, highlighting the key definitions and examples. I can help you create practice questions if you'd like to test your understanding.`,
            ];
            const aiMsg = {
                id: Date.now() + 1,
                role: 'ai',
                text: responses[Math.floor(Math.random() * responses.length)]
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsLoading(false);
        }, 1500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleTextareaInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
        if (!isRecording) {
            setTimeout(() => {
                setIsRecording(false);
                setPrompt('What are the key concepts in this subject?');
            }, 3000);
        }
    };

    const handleSuggestion = (text) => {
        setPrompt(text);
        textareaRef.current?.focus();
    };

    return (
        <div className="subject-layout">
            {/* Top bar */}
            <div className="subject-topbar">
                <div className="subject-topbar-left">
                    <Link href="/dashboard" className="subject-back-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                    </Link>
                    <span className="subject-name">{subjectName}</span>
                </div>
                <div className="subject-topbar-right">
                    {materialUploaded && (
                        <div className="subject-status-chip">
                            <span className="subject-status-dot"></span>
                            Material loaded
                        </div>
                    )}
                </div>
            </div>

            {/* Main body */}
            <div className="subject-body">
                {!materialUploaded ? (
                    /* ── Upload State ── */
                    <div className="subject-upload-area">
                        {!showUploadOptions ? (
                            <>
                                <button className="subject-upload-box" onClick={() => setShowUploadOptions(true)}>
                                    <div className="subject-upload-icon">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                                    </div>
                                    Upload Material
                                </button>
                                <div>
                                    <div className="subject-upload-title">Upload your study material</div>
                                    <div className="subject-upload-subtitle">Upload text notes or PDF files to train AskMyNotes on your {subjectName} content</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="subject-upload-title">Choose upload type</div>
                                <div className="subject-upload-subtitle">Select how you want to provide your study material</div>
                                <div className="subject-upload-options">
                                    <button className="subject-upload-option" onClick={() => { setShowTextModal(true); setShowUploadOptions(false); }}>
                                        <div className="subject-upload-option-icon text">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                                        </div>
                                        Paste Text
                                    </button>
                                    <button className="subject-upload-option" onClick={() => fileInputRef.current?.click()}>
                                        <div className="subject-upload-option-icon pdf">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M9 15h6" /><path d="M12 12v6" /></svg>
                                        </div>
                                        Upload PDF
                                    </button>
                                    <input ref={fileInputRef} type="file" accept=".pdf,.txt,.doc,.docx" style={{ display: 'none' }} onChange={handleFileUpload} />
                                </div>
                                <button
                                    style={{ background: 'none', border: 'none', color: 'var(--txt-muted)', cursor: 'pointer', fontSize: '0.8rem', marginTop: '8px', fontFamily: 'var(--font-sans)' }}
                                    onClick={() => setShowUploadOptions(false)}
                                >
                                    ← Back
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    /* ── Chat State ── */
                    <div className="subject-chat-container">
                        {messages.length <= 1 && (
                            <div className="subject-chat-greeting">
                                <div className="subject-material-badge">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                    Material uploaded · {materialType === 'pdf' ? 'PDF file' : 'Text notes'}
                                </div>
                                <div className="subject-chat-sparkle">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                    Trained on your {subjectName} notes
                                </div>
                                <h1 className="subject-chat-heading">I&apos;m ready to help you study</h1>
                                <p className="subject-chat-subtext">Ask me questions about your uploaded material</p>
                            </div>
                        )}

                        <div className="subject-messages">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`subject-msg ${msg.role}`}>
                                    <div className={`subject-msg-avatar ${msg.role === 'ai' ? 'ai' : 'human'}`}>
                                        {msg.role === 'ai' ? '✦' : 'U'}
                                    </div>
                                    <div className="subject-msg-bubble">{msg.text}</div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="subject-msg ai">
                                    <div className="subject-msg-avatar ai">✦</div>
                                    <div className="subject-loading-dots">
                                        <span className="subject-loading-dot"></span>
                                        <span className="subject-loading-dot"></span>
                                        <span className="subject-loading-dot"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {messages.length <= 1 && (
                            <div className="subject-suggestions">
                                <button className="subject-suggestion-chip" onClick={() => handleSuggestion('Summarize the key concepts')}>📝 Summarize key concepts</button>
                                <button className="subject-suggestion-chip" onClick={() => handleSuggestion('Generate flashcards from my notes')}>🃏 Generate flashcards</button>
                                <button className="subject-suggestion-chip" onClick={() => handleSuggestion('Create practice MCQs')}>❓ Practice MCQs</button>
                                <button className="subject-suggestion-chip" onClick={() => handleSuggestion('Explain the most important topics')}>💡 Explain key topics</button>
                            </div>
                        )}

                        {/* Prompt bar */}
                        <div className="subject-prompt-wrap">
                            <div className="subject-prompt-bar">
                                <textarea
                                    ref={textareaRef}
                                    className="subject-prompt-input"
                                    placeholder={`Ask about ${subjectName}...`}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onInput={handleTextareaInput}
                                    rows={1}
                                />
                                <div className="subject-prompt-actions">
                                    <div className="subject-prompt-left">
                                        <button className="subject-prompt-icon-btn" title="Attach file" onClick={() => fileInputRef.current?.click()}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                        </button>
                                    </div>
                                    <div className="subject-prompt-right">
                                        <button className={`subject-prompt-mic ${isRecording ? 'recording' : ''}`} onClick={toggleRecording} title={isRecording ? 'Stop recording' : 'Voice input'}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                                        </button>
                                        <button className="subject-prompt-send" onClick={handleSend} disabled={!prompt.trim() || isLoading}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Text input modal */}
            {showTextModal && (
                <div className="subject-text-modal-overlay" onClick={() => setShowTextModal(false)}>
                    <div className="subject-text-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Paste your study notes</h3>
                        <textarea
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder={`Paste your ${subjectName} notes here...`}
                            autoFocus
                        />
                        <div className="subject-text-modal-actions">
                            <button className="dash-btn-cancel" onClick={() => setShowTextModal(false)}>Cancel</button>
                            <button className="dash-btn-submit" onClick={handleTextUpload}>Upload Notes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
