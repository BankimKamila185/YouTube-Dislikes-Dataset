import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, TrendingUp, PlaySquare } from 'lucide-react';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
            {/* Background Effects */}
            <div style={{
                position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '120%', pointerEvents: 'none',
                background: 'radial-gradient(circle at 50% 0%, rgba(255, 0, 0, 0.1) 0%, transparent 50%)'
            }} />
            <div style={{
                position: 'absolute', bottom: '0', right: '0', width: '50vw', height: '50vh', pointerEvents: 'none',
                background: 'radial-gradient(circle at 100% 100%, rgba(255, 77, 77, 0.05) 0%, transparent 60%)'
            }} />

            <nav style={{ padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.25rem', color: 'white' }}>
                    <PlaySquare color="var(--accent-red)" size={28} />
                    <span>YouTube Insight</span>
                </div>
                <div>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'transparent', color: 'white', border: '1px solid var(--border-color)', padding: '0.5rem 1.5rem', borderRadius: '40px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                        onMouseOver={(e) => { e.target.style.borderColor = 'var(--text-primary)'; }}
                        onMouseOut={(e) => { e.target.style.borderColor = 'var(--border-color)'; }}
                    >
                        Launch App
                    </button>
                </div>
            </nav>

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(255, 0, 0, 0.1)', borderRadius: '40px', border: '1px solid rgba(255, 0, 0, 0.2)', color: 'var(--accent-red-hover)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '2rem' }}
                >
                    New: Predictive Modeling Engine Available
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ fontSize: '5rem', lineHeight: '1.1', letterSpacing: '-0.04em', background: 'linear-gradient(to right, #ffffff, #8b949e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 1.5rem 0' }}
                >
                    Decode the Algorithm. <br />
                    <span style={{ background: 'linear-gradient(to right, #ff0000, #ff4d4d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Optimize Engagement.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem' }}
                >
                    An enterprise-grade analytical experience designed to uncover hidden trends in YouTube data and predict video outcomes using machine learning.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'flex', gap: '1rem' }}
                >
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'var(--accent-red)', color: 'white', border: 'none', padding: '1rem 2.5rem', borderRadius: '40px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s', boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)' }}
                        onMouseOver={(e) => { e.target.style.background = 'var(--accent-red-hover)'; }}
                        onMouseOut={(e) => { e.target.style.background = 'var(--accent-red)'; }}
                    >
                        Enter Dashboard <ArrowRight size={20} />
                    </button>
                </motion.div>

                {/* Feature Cards Showcase */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '6rem', width: '100%' }}>
                    <FeatureCard delay={0.4} icon={<Activity size={24} color="var(--accent-red)" />} title="Exploratory Analysis" desc="Interactive visual correlations between views, likes, and comments across top tier channels." />
                    <FeatureCard delay={0.5} icon={<TrendingUp size={24} color="var(--accent-red)" />} title="Predictive AI" desc="Utilise our Scikit-Learn Logistic Regression model to classify high-risk video engagement before they happen." />
                    <FeatureCard delay={0.6} icon={<PlaySquare size={24} color="var(--accent-red)" />} title="Notebook Integration" desc="View exactly how the python scripts were written directly alongside dynamic Plotly-style charts." />
                </div>
            </main>
        </div>
    );
}

function FeatureCard({ delay, icon, title, desc }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: delay, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: 'rgba(33, 38, 45, 0.3)', border: '1px solid rgba(48, 54, 61, 0.5)', borderRadius: '16px', padding: '2rem', textAlign: 'left', backdropFilter: 'blur(10px)', transition: 'transform 0.3s' }}
            whileHover={{ y: -5, background: 'rgba(33, 38, 45, 0.8)' }}
        >
            <div style={{ background: 'rgba(255, 0, 0, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'white' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>{desc}</p>
        </motion.div>
    )
}
