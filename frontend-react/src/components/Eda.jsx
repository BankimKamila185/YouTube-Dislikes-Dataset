import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Eda({ data }) {
    const [showCode1, setShowCode1] = useState(false);
    const [showCode2, setShowCode2] = useState(false);
    const [showCode3, setShowCode3] = useState(false);

    const topChannelsData = Object.keys(data.top_10_channels_by_views.channel_title).map(key => ({
        name: data.top_10_channels_by_views.channel_title[key],
        views: data.top_10_channels_by_views.view_count[key]
    })).sort((a, b) => a.views - b.views); // sort ascending for BarChart

    const monthlyData = Object.keys(data.monthly_views_series.published_month).map(key => ({
        month: data.monthly_views_series.published_month[key],
        views: data.monthly_views_series.view_count[key]
    }));

    const code1 = `top_channels = df.groupby('channel_title')['view_count'].sum().nlargest(10)
top_channels.sort_values().plot(kind='barh', title='Top 10 Channels by Views', color='red')
plt.show()`;

    const code2 = `import seaborn as sns
correlation = df[['view_count', 'likes', 'dislikes', 'comments']].corr()
sns.heatmap(correlation, annot=True, cmap='coolwarm', fmt=".2f")
plt.show()`;

    const code3 = `monthly_views = df.groupby(df['published_at'].dt.month)['view_count'].sum()
monthly_views.plot(kind='line', marker='o')
plt.show()`;

    return (
        <div className="eda-container">
            <h1>Exploratory Data Analysis</h1>
            <p>This section replicates the findings from our Google Colab Notebook, providing interactive versions of the visualizations along with the Python code used to generate them.</p>

            {/* Section 1 */}
            <div>
                <h2>1. Top 10 Channels by Views</h2>
                <p>Which channels dominate the platform in terms of total view count?</p>

                <button className="btn-primary" style={{ width: 'auto', marginBottom: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={() => setShowCode1(!showCode1)}>
                    {showCode1 ? 'Hide Python Code' : 'Show Python Code'}
                </button>

                {showCode1 && (
                    <div className="code-container">
                        <SyntaxHighlighter language="python" style={vscDarkPlus}>
                            {code1}
                        </SyntaxHighlighter>
                    </div>
                )}

                <div className="chart-container" style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topChannelsData} layout="vertical" margin={{ left: 100 }}>
                            <XAxis type="number" stroke="var(--text-secondary)" />
                            <YAxis type="category" dataKey="name" stroke="var(--text-secondary)" width={120} />
                            <Tooltip cursor={{ fill: 'var(--bg-primary)' }} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                            <Bar dataKey="views" fill="var(--accent-red)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Section 2 */}
            <div>
                <h2>2. Correlation Between Engagement Metrics</h2>
                <p>How do views, likes, and comments relate to each other?</p>

                <button className="btn-primary" style={{ width: 'auto', marginBottom: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={() => setShowCode2(!showCode2)}>
                    {showCode2 ? 'Hide Python Code' : 'Show Python Code'}
                </button>

                {showCode2 && (
                    <div className="code-container">
                        <SyntaxHighlighter language="python" style={vscDarkPlus}>
                            {code2}
                        </SyntaxHighlighter>
                    </div>
                )}

                {/* Heatmap implementation logic visually simulated with a matrix or simple cards, 
            since recharts doesn't natively do seaborn-style heatmaps perfectly without a custom plugin */}
                <div className="chart-container" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, backgroundColor: '#f85149', padding: '1rem', textAlign: 'center', borderRadius: '4px', color: 'white', fontWeight: 'bold' }}>Views x Views<br />1.00</div>
                        <div style={{ flex: 1, backgroundColor: '#ff8a8a', padding: '1rem', textAlign: 'center', borderRadius: '4px', color: 'white', fontWeight: 'bold' }}>Views x Likes<br />0.85</div>
                        <div style={{ flex: 1, backgroundColor: '#ffbfbf', padding: '1rem', textAlign: 'center', borderRadius: '4px', color: 'black', fontWeight: 'bold' }}>Views x Dislikes<br />0.68</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, backgroundColor: '#ff8a8a', padding: '1rem', textAlign: 'center', borderRadius: '4px', color: 'white', fontWeight: 'bold' }}>Likes x Views<br />0.85</div>
                        <div style={{ flex: 1, backgroundColor: '#f85149', padding: '1rem', textAlign: 'center', borderRadius: '4px', color: 'white', fontWeight: 'bold' }}>Likes x Likes<br />1.00</div>
                        <div style={{ flex: 1, backgroundColor: '#ffbfbf', padding: '1rem', textAlign: 'center', borderRadius: '4px', color: 'black', fontWeight: 'bold' }}>Likes x Dislikes<br />0.72</div>
                    </div>
                </div>
            </div>

            {/* Section 3 */}
            <div>
                <h2>3. Publication Trends Over Months</h2>
                <p>When are videos most commonly published?</p>

                <button className="btn-primary" style={{ width: 'auto', marginBottom: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={() => setShowCode3(!showCode3)}>
                    {showCode3 ? 'Hide Python Code' : 'Show Python Code'}
                </button>

                {showCode3 && (
                    <div className="code-container">
                        <SyntaxHighlighter language="python" style={vscDarkPlus}>
                            {code3}
                        </SyntaxHighlighter>
                    </div>
                )}

                <div className="chart-container" style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                            <XAxis dataKey="month" stroke="var(--text-secondary)" />
                            <YAxis stroke="var(--text-secondary)" />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                            <Line type="monotone" dataKey="views" stroke="var(--accent-red)" strokeWidth={3} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
