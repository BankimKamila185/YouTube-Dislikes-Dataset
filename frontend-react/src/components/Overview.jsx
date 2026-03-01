import React from 'react';

export default function Overview({ data }) {
    return (
        <div className="overview-container">
            <h1>YouTube Dislikes Analysis Dashboard</h1>
            <p>Welcome to the interactive exploration of YouTube metrics. Explore the raw data, view business analytics, and predict video performance.</p>

            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-label">Total Videos Analyzed</div>
                    <div className="metric-value">37,422</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Total Views</div>
                    <div className="metric-value">1.52B</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Avg Likes/Video</div>
                    <div className="metric-value">166,814</div>
                </div>
                <div className="metric-card">
                    <div className="metric-label">Avg Dislikes/Video</div>
                    <div className="metric-value">3,000</div>
                </div>
            </div>

            <h2>Sample Data</h2>
            <div style={{ overflowX: 'auto', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Title</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Channel</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Views</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Likes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>I ASKED HER TO BE MY GIRLFRIEND...</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Brawadis</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>1,514,614</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>156,908</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Apex Legends | Stories from the Outlands</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>Apex Legends</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>2,381,688</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>146,739</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>I left youtube for a month and THIS is what happened.</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>jacksepticeye</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>2,038,853</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>353,787</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>XXL 2020 Freshman Class Revealed</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>XXL</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>3,497,305</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>153,385</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
