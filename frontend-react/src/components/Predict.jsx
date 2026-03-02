import React, { useState } from 'react';

export default function Predict() {
    const [views, setViews] = useState(100000);
    const [likes, setLikes] = useState(5000);
    const [comments, setComments] = useState(1000);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handlePredict = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    views: Number(views),
                    likes: Number(likes),
                    comments: Number(comments)
                }),
            });

            if (!response.ok) {
                throw new Error('Prediction request failed');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            // Fallback for local development if the serverless function isn't running
            setError('Could not connect to the Prediction API. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="predict-container">
            <h1>Predictive Modeling: High Dislike Risk</h1>
            <p>Use this tool to predict the probability that a video will have an unusually high dislike rate based on its initial engagement metrics.</p>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                <h4>Input Video Metrics</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9em', margin: 0 }}>Enter the expected early performance metrics of the video.</p>
            </div>

            <div className="form-grid">
                <div className="input-group">
                    <label>Expected View Count</label>
                    <input type="number" value={views} onChange={e => setViews(e.target.value)} min="0" />
                </div>
                <div className="input-group">
                    <label>Expected Likes</label>
                    <input type="number" value={likes} onChange={e => setLikes(e.target.value)} min="0" />
                </div>
                <div className="input-group">
                    <label>Expected Comments</label>
                    <input type="number" value={comments} onChange={e => setComments(e.target.value)} min="0" />
                </div>
            </div>

            <button className="btn-primary" onClick={handlePredict} disabled={loading}>
                {loading ? 'Analyzing metrics...' : 'Predict Risk Level'}
            </button>

            {error && (
                <div className="alert danger">
                    ⚠️ {error}
                    <br /><small style={{ display: 'block', marginTop: '10px' }}>To test predictions locally, you need to run `vercel dev` instead of `npm run dev` to serve the Python serverless function, or ensure the predictive python backend is reachable.</small>
                </div>
            )}

            {result && (
                <div className="prediction-result">
                    <h3>Prediction Result</h3>

                    <div style={{ position: 'relative', width: '200px', height: '120px', margin: '2rem auto 3rem auto', overflow: 'visible' }}>
                        {/* Gauge Arc Background */}
                        <div style={{
                            width: '200px', height: '200px',
                            borderRadius: '50%',
                            background: `conic-gradient(from 180deg, var(--success) 0deg 108deg, var(--warning) 108deg 252deg, var(--danger) 252deg 360deg)`,
                            position: 'absolute', top: 0, left: 0,
                            clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'
                        }}></div>

                        {/* Gauge Inner Cutout */}
                        <div style={{
                            width: '180px', height: '180px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--bg-card)',
                            position: 'absolute', top: '10px', left: '10px',
                            clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'
                        }}></div>

                        {/* Gauge Needle */}
                        <div style={{
                            position: 'absolute', top: '10px', left: '50%',
                            transform: `translateX(-50%) rotate(${(result.probability * 180) - 90}deg)`,
                            transformOrigin: 'bottom center',
                            width: '4px', height: '90px', backgroundColor: 'var(--text-primary)',
                            transition: 'transform 1s cubic-bezier(0.25, 1, 0.5, 1)',
                            borderRadius: '2px'
                        }}></div>

                        {/* Gauge Center Pin */}
                        <div style={{
                            position: 'absolute', top: '95px', left: '50%',
                            transform: 'translateX(-50%)',
                            width: '14px', height: '14px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--text-primary)',
                            zIndex: 2
                        }}></div>

                        {/* Text Label */}
                        <div style={{ position: 'absolute', top: '115px', left: '0', width: '100%', textAlign: 'center', fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            {(result.probability * 100).toFixed(1)}%
                        </div>
                    </div>

                    {
                        result.probability > 0.6 ? (
                            <div className="alert danger">
                                ⚠️ <strong>High Risk</strong> - The engagement pattern suggests a potentially polarizing video resulting in a high dislike rate.
                            </div>
                        ) : result.probability < 0.3 ? (
                            <div className="alert success">
                                ✅ <strong>Low Risk</strong> - The video metrics appear healthy and typical for well-received content.
                            </div>
                        ) : (
                            <div className="alert warning">
                                ⚠️ <strong>Moderate Risk</strong> - The metrics show mixed signals. Monitor community response closely.
                            </div>
                        )
                    }
                </div >
            )
            }
        </div >
    );
}
