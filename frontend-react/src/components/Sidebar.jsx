import React from 'react';
import { Activity, BarChart2, PieChart, Video, Home } from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage }) {
    const navItems = [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'eda', label: 'Exploratory Data', icon: PieChart },
        { id: 'predict', label: 'Predictive Modeling', icon: Activity },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <Video size={24} color="#ff0000" />
                <span>YT Analytics App</span>
            </div>

            <div className="nav-links">
                {navItems.map(item => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.id}
                            className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                            onClick={() => setCurrentPage(item.id)}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: 'auto', padding: '1rem', backgroundColor: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.85rem', marginBottom: 0 }}>This dashboard analyzes the <strong>YouTube Dislikes Dataset</strong>, showing premium interactive graphs and predictive modeling.</p>
            </div>
        </aside>
    );
}
