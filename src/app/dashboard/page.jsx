"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { createClient } from '@/utils/supabase/client';
import './dashboard.css';

const SUBJECT_COLORS = ['#EF4444', '#3B82F6', '#10B981'];

export default function DashboardPage() {
    const router = useRouter();
    const [subjects, setSubjects] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [showProfile, setShowProfile] = useState(false);
    const [user, setUser] = useState(null);

    const supabase = createClient();

    useEffect(() => {
        const saved = localStorage.getItem('askmynotes_subjects');
        if (saved) {
            try { setSubjects(JSON.parse(saved)); } catch { }
        }

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth');
                return;
            }
            setUser(user);
        };
        getUser();
    }, []);

    const updateSubjects = (newSubs) => {
        setSubjects(newSubs);
        localStorage.setItem('askmynotes_subjects', JSON.stringify(newSubs));
    };

    const navigateToSubject = (title) => {
        router.push(`/subject/${encodeURIComponent(title)}`);
    };

    const canCreate = subjects.length < 3;

    const handleCreate = (e) => {
        if (e) e.preventDefault();
        if (!newName.trim() || !canCreate) return;

        const newSubject = {
            id: Date.now(),
            title: newName.trim(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            color: SUBJECT_COLORS[subjects.length],
        };
        updateSubjects([...subjects, newSubject]);
        setNewName('');
        setIsCreating(false);
    };

    const handleDelete = (id) => {
        updateSubjects(subjects.filter((s) => s.id !== id));
    };

    const openCreateForm = () => {
        if (canCreate) setIsCreating(true);
    };

    return (
        <div className="dashboard-layout">
            <Sidebar
                subjects={subjects}
                user={user}
                onProfileClick={() => setShowProfile(true)}
            />

            <div className="dash-main">
                <Header user={user} canCreate={canCreate} onCreateClick={openCreateForm} />

                <div className="dash-content">
                    {/* Page Header */}
                    <div className="dash-page-header">
                        <div>
                            <h1 className="dash-page-title">My Projects</h1>
                            <p className="dash-page-subtitle">Let&apos;s get started and take the first step towards becoming a more productive and organized you!</p>
                        </div>
                        <div className="dash-page-meta">
                            <div className="dash-meta-block">
                                <label>Visibility</label>
                                <div className="dash-meta-value">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                    Private Projects
                                </div>
                            </div>
                            <div className="dash-meta-block">
                                <label>Members</label>
                                <div className="dash-members-stack">
                                    <div className="dash-member-avatar purple">AS</div>
                                    <div className="dash-member-avatar pink">MJ</div>
                                    <div className="dash-member-avatar blue">KS</div>
                                    <div className="dash-member-avatar more">+8</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Tools */}
                    <h2 className="dash-section-title">AI Tools</h2>
                    <div className="dash-tools-grid">
                        <div className="dash-tool-card">
                            <div className="dash-tool-icon purple">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                            </div>
                            <div>
                                <div className="dash-tool-name">Notes Summarizer</div>
                                <div className="dash-tool-desc">Condense long notes</div>
                            </div>
                        </div>
                        <div className="dash-tool-card">
                            <div className="dash-tool-icon pink">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                            </div>
                            <div>
                                <div className="dash-tool-name">Flashcard Generator</div>
                                <div className="dash-tool-desc">Auto-create study cards</div>
                            </div>
                        </div>
                        <div className="dash-tool-card">
                            <div className="dash-tool-icon yellow">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            </div>
                            <div>
                                <div className="dash-tool-name">MCQ Practice</div>
                                <div className="dash-tool-desc">Generate test questions</div>
                            </div>
                        </div>
                        <div className="dash-tool-card">
                            <div className="dash-tool-icon blue">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                            </div>
                            <div>
                                <div className="dash-tool-name">Journal</div>
                                <div className="dash-tool-desc">Prompts &amp; questions</div>
                            </div>
                        </div>
                    </div>

                    {/* My Subjects / Drafts */}
                    <h2 className="dash-section-title">My drafts</h2>

                    <div className="dash-subjects-grid">
                        {/* Slot 1: Create Card or First Subject (Big) */}
                        <div className="dash-slot dash-slot-big">
                            {subjects[0] ? (
                                <div className="dash-subject-card dash-subject-big" onClick={() => navigateToSubject(subjects[0].title)}>
                                    <div className="dash-draft-tags">
                                        <span className="dash-tag purple">Subject</span>
                                    </div>
                                    <div className="dash-draft-title">{subjects[0].title}</div>
                                    <div className="dash-draft-footer">
                                        <span className="dash-draft-date">{subjects[0].date}</span>
                                        <div className="dash-card-actions">
                                            <button className="dash-draft-edit" title="Edit">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            </button>
                                            <button className="dash-card-delete" title="Delete workspace" onClick={() => handleDelete(subjects[0].id)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : isCreating ? (
                                <form className="dash-create-form dash-create-form-big" onSubmit={handleCreate}>
                                    <div>
                                        <h3>Create new workspace</h3>
                                        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Physics, Chemistry..." autoFocus />
                                    </div>
                                    <div className="dash-create-form-actions">
                                        <button type="button" className="dash-btn-cancel" onClick={() => setIsCreating(false)}>Cancel</button>
                                        <button type="submit" className="dash-btn-submit">Create</button>
                                    </div>
                                </form>
                            ) : (
                                <button className="dash-create-card dash-create-card-big" onClick={openCreateForm}>
                                    <div className="dash-create-card-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                    </div>
                                    Create Subject
                                </button>
                            )}
                        </div>

                        {/* Slot 2: Second Subject (Small) or Skeleton */}
                        <div className="dash-slot dash-slot-small">
                            {subjects[1] ? (
                                <div className="dash-subject-card" onClick={() => navigateToSubject(subjects[1].title)}>
                                    <div className="dash-draft-tags">
                                        <span className="dash-tag green">Subject</span>
                                    </div>
                                    <div className="dash-draft-title">{subjects[1].title}</div>
                                    <div className="dash-draft-footer">
                                        <span className="dash-draft-date">{subjects[1].date}</span>
                                        <div className="dash-card-actions">
                                            <button className="dash-draft-edit" title="Edit">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            </button>
                                            <button className="dash-card-delete" title="Delete workspace" onClick={() => handleDelete(subjects[1].id)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : subjects.length >= 1 && canCreate ? (
                                !isCreating ? (
                                    <button className="dash-create-card" onClick={openCreateForm}>
                                        <div className="dash-create-card-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                        </div>
                                        Create Subject
                                    </button>
                                ) : (
                                    <form className="dash-create-form" onSubmit={handleCreate}>
                                        <div>
                                            <h3>Create workspace</h3>
                                            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Subject name..." autoFocus />
                                        </div>
                                        <div className="dash-create-form-actions">
                                            <button type="button" className="dash-btn-cancel" onClick={() => setIsCreating(false)}>Cancel</button>
                                            <button type="submit" className="dash-btn-submit">Create</button>
                                        </div>
                                    </form>
                                )
                            ) : (
                                <div className="dash-skeleton-card">
                                    <div className="dash-skeleton-tag"></div>
                                    <div className="dash-skeleton-line dash-skeleton-line-lg"></div>
                                    <div className="dash-skeleton-line dash-skeleton-line-md"></div>
                                    <div className="dash-skeleton-footer">
                                        <div className="dash-skeleton-line dash-skeleton-line-sm"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Slot 3: Third Subject (Small) or Skeleton */}
                        <div className="dash-slot dash-slot-small">
                            {subjects[2] ? (
                                <div className="dash-subject-card" onClick={() => navigateToSubject(subjects[2].title)}>
                                    <div className="dash-draft-tags">
                                        <span className="dash-tag pink">Subject</span>
                                    </div>
                                    <div className="dash-draft-title">{subjects[2].title}</div>
                                    <div className="dash-draft-footer">
                                        <span className="dash-draft-date">{subjects[2].date}</span>
                                        <div className="dash-card-actions">
                                            <button className="dash-draft-edit" title="Edit">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            </button>
                                            <button className="dash-card-delete" title="Delete workspace" onClick={() => handleDelete(subjects[2].id)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : subjects.length >= 2 && canCreate ? (
                                !isCreating ? (
                                    <button className="dash-create-card" onClick={openCreateForm}>
                                        <div className="dash-create-card-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                        </div>
                                        Create Subject
                                    </button>
                                ) : (
                                    <form className="dash-create-form" onSubmit={handleCreate}>
                                        <div>
                                            <h3>Create workspace</h3>
                                            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Subject name..." autoFocus />
                                        </div>
                                        <div className="dash-create-form-actions">
                                            <button type="button" className="dash-btn-cancel" onClick={() => setIsCreating(false)}>Cancel</button>
                                            <button type="submit" className="dash-btn-submit">Create</button>
                                        </div>
                                    </form>
                                )
                            ) : (
                                <div className="dash-skeleton-card">
                                    <div className="dash-skeleton-tag"></div>
                                    <div className="dash-skeleton-line dash-skeleton-line-lg"></div>
                                    <div className="dash-skeleton-line dash-skeleton-line-md"></div>
                                    <div className="dash-skeleton-footer">
                                        <div className="dash-skeleton-line dash-skeleton-line-sm"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Modal */}
            {showProfile && (
                <div className="dash-profile-overlay" onClick={() => setShowProfile(false)}>
                    <div className="dash-profile-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="dash-profile-banner">
                            <button className="dash-profile-close" onClick={() => setShowProfile(false)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                            <div className="dash-profile-avatar-wrap">
                                <div className="dash-profile-avatar-big">KS</div>
                            </div>
                        </div>
                        <div className="dash-profile-body">
                            <div className="dash-profile-name">
                                {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                            </div>
                            <div className="dash-profile-headline">Engineering Student · AskMyNotes User</div>
                            <div className="dash-profile-info-grid">
                                <div className="dash-profile-info-item"><label>Email</label><span>{user?.email}</span></div>
                                <div className="dash-profile-info-item"><label>University</label><span>MIT</span></div>
                                <div className="dash-profile-info-item"><label>Subjects</label><span>{subjects.length} active</span></div>
                                <div className="dash-profile-info-item"><label>Notes Uploaded</label><span>12 files</span></div>
                                <div className="dash-profile-info-item"><label>Questions Asked</label><span>156</span></div>
                                <div className="dash-profile-info-item"><label>Joined</label><span>{user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2025'}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
