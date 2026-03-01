import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend, ScatterChart, Scatter, ZAxis, Cell } from 'recharts';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Eda({ data }) {
    const [showCode1, setShowCode1] = useState(false);
    const [showCode2, setShowCode2] = useState(false);
    const [showCode3, setShowCode3] = useState(false);
    const [showCode4, setShowCode4] = useState(false);
    const [showCode5, setShowCode5] = useState(false);

    const topChannelsData = Object.keys(data.top_10_channels_by_views.channel_title).map(key => ({
        name: data.top_10_channels_by_views.channel_title[key],
        views: data.top_10_channels_by_views.view_count[key]
    })).sort((a, b) => a.views - b.views); // sort ascending for BarChart

    const monthlyData = Object.keys(data.monthly_views_series.published_month).map(key => ({
        month: data.monthly_views_series.published_month[key],
        views: data.monthly_views_series.view_count[key]
    }));

    const histogramData = data.dislike_ratio_dist.counts.map((count, index) => {
        const binStart = data.dislike_ratio_dist.bins[index].toFixed(2);
        const binEnd = (data.dislike_ratio_dist.bins[index + 1] || 1.0).toFixed(2);
        return {
            range: `${binStart}-${binEnd}`,
            count: count
        };
    });

    const clusterData = data.cluster_averages.map(c => ({
        name: c.cluster,
        view_count: c.avg_views,
        likes: c.avg_likes,
        comment_count: c.avg_comments
    }));

    // Data prep for Heatmap (CSS Grid approach)
    const correlationMatrix = data.correlation.matrix;
    const correlationVariables = data.correlation.variables;

    // Helper for Heatmap Color (CSS Grid)
    const getHeatmapColor = (value) => {
        // Simple Coolwarm (Blue to Red) interpolator for -1 to 1
        return value > 0
            ? `rgba(248, 81, 73, ${value * 0.8 + 0.2})` // Red for positive, min opacity 0.2
            : `rgba(88, 166, 255, ${Math.abs(value) * 0.8 + 0.2})`; // Blue for negative
    };

    const code1 = `top_channels = df.groupby('channel_title')['view_count'].sum().nlargest(10)
        top_channels.sort_values().plot(kind = 'barh', title = 'Top 10 Channels by Views', color = 'red')
        plt.show()`;

    const code2 = `import seaborn as sns
        correlation = df[['view_count', 'likes', 'dislikes', 'comments']].corr()
        sns.heatmap(correlation, annot = True, cmap = 'coolwarm', fmt = ".2f")
        plt.show()`;

    const code3 = `monthly_views = df.groupby(df['published_at'].dt.month)['view_count'].sum()
        monthly_views.plot(kind = 'line', marker = 'o')
        plt.show()`;

    const code4 = `import seaborn as sns
        plt.figure(figsize = (10, 6))
        sns.histplot(df['dislike_ratio'], bins = 50, kde = True)
        plt.title('Distribution of Dislike Ratio (Risk Indicator)')
        plt.show()`;

    const code5 = `from sklearn.cluster import KMeans
kmeans = KMeans(n_clusters = 3, random_state = 42)
        df['Demand_Cluster'] = kmeans.fit_predict(scaled_features)

        cluster_analysis = df.groupby('Demand_Cluster')[['view_count', 'likes', 'comment_count']].mean()
        cluster_analysis.plot(kind = 'bar', figsize = (10, 6), logy = True, cmap = 'Set2')
        plt.title('Average Engagement Metrics Per Demand Cluster (K-Means)')
        plt.xlabel('Cluster Segment (0 = Niche, 1 = Viral, 2 = Steady)')
        plt.ylabel('Average Count')
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

                <div className="explanation-block" style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', borderLeft: '4px solid var(--accent-red)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>📈 What does this chart tell us?</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>
                        This chart visualizes the absolute titans of our dataset. It aggregates the total view count across all videos published by each channel in the dataset and displays the top 10 highest-performing creators.<br /><br />
                        <strong>Key Takeaway:</strong> We often see major corporate entertainment channels (like T-Series, Cocomelon, or SET India) or massive individual creators (like MrBeast) dominating this list. The disparity between the #1 spot and the #10 spot is usually massive, highlighting a "winners take all" power-law distribution in YouTube viewership.
                    </p>
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

                <div className="chart-container" style={{ padding: '2rem', overflowX: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${correlationVariables.length}, 1fr)`, gap: '4px', minWidth: '600px' }}>
                        {/* Header Row */}
                        <div style={{ visibility: 'hidden' }}></div>
                        {correlationVariables.map((variable, i) => (
                            <div key={`header-${i}`} style={{ textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 'bold', paddingBottom: '0.5rem' }}>
                                {variable}
                            </div>
                        ))}

                        {/* Matrix Rows */}
                        {correlationMatrix.map((row, rowIndex) => (
                            <React.Fragment key={`row-${rowIndex}`}>
                                {/* Row Label */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '1rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                                    {correlationVariables[rowIndex]}
                                </div>
                                {/* Row Data Cells */}
                                {row.map((val, colIndex) => (
                                    <div
                                        key={`cell-${rowIndex}-${colIndex}`}
                                        style={{
                                            backgroundColor: getHeatmapColor(val),
                                            padding: '1.5rem 1rem',
                                            textAlign: 'center',
                                            borderRadius: '6px',
                                            color: Math.abs(val) > 0.5 ? 'white' : 'var(--text-primary)',
                                            fontWeight: 'bold',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            cursor: 'pointer'
                                        }}
                                        title={`Correlation Matrix: \n${correlationVariables[rowIndex]} x ${correlationVariables[colIndex]}\nValue: ${val.toFixed(2)}`}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
                                            e.currentTarget.style.zIndex = 10;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.zIndex = 1;
                                        }}
                                    >
                                        {val.toFixed(2)}
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="explanation-block" style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', borderLeft: '4px solid var(--accent-red)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>📈 What does this correlation mean?</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>
                        This heatmap reveals the linear relationship between our core YouTube metrics. A value of <strong>1.00</strong> means perfect positive correlation, while values closer to <strong>0</strong> mean no relationship.<br /><br />
                        Notice the strong dark red square between <strong>Views and Likes (0.85)</strong>. This indicates a <em>very</em> strong positive correlation: as views increase, likes reliably increase in a predictable pattern. This suggests that viewer engagement scales naturally with reach. Conversely, the relationship between Views and Dislikes is notably weaker at <strong>0.68</strong>, suggesting that videos going viral do not automatically result in proportional negative feedback.
                    </p>
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

                <div className="explanation-block" style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', borderLeft: '4px solid var(--accent-red)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>📈 What does this trend indicate?</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>
                        This line chart tracks aggregate viewership based on the month a video was published. <br /><br />
                        <strong>Key Takeaway:</strong> You will typically notice distinct peaks (seasonality). For example, viewership often spikes in late summer or during the holiday season (November/December) when younger demographics are out of school and spend more time on the platform. Dips usually correlate with back-to-school months. This seasonality is crucial for creators planning their upload schedules for maximum reach.
                    </p>
                </div>
            </div>

            {/* Section 4 */}
            <div>
                <h2>4. Distribution of Dislike Ratio (Risk Indicator)</h2>
                <p>Are videos generally liked, or is there a high baseline of dislikes across the platform?</p>

                <button className="btn-primary" style={{ width: 'auto', marginBottom: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={() => setShowCode4(!showCode4)}>
                    {showCode4 ? 'Hide Python Code' : 'Show Python Code'}
                </button>

                {showCode4 && (
                    <div className="code-container">
                        <SyntaxHighlighter language="python" style={vscDarkPlus}>
                            {code4}
                        </SyntaxHighlighter>
                    </div>
                )}

                <div className="chart-container" style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={histogramData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="range" stroke="var(--text-secondary)" angle={-45} textAnchor="end" height={60} />
                            <YAxis stroke="var(--text-secondary)" />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                            <Bar dataKey="count" fill="var(--accent-red)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="explanation-block" style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', borderLeft: '4px solid var(--accent-red)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>📈 Why is Dislike Ratio important?</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>
                        The "Dislike Ratio" is calculated as <code>Dislikes / (Likes + Dislikes)</code>. It acts as a primary <strong>Risk Indicator</strong> for content. <br /><br />
                        <strong>Key Takeaway:</strong> The distribution is heavily right-skewed. The vast majority of videos sit firmly on the left side (0.00 - 0.05), meaning they have overwhelmingly positive reception (less than 5% dislikes). A long tail stretches out to the right, showing isolated "controversial" or "clickbait" videos that angered viewers. This confirms that YouTube viewers primarily use the "Like" button to curate their feed, and rarely use "Dislike" unless they feel actively deceived.
                    </p>
                </div>
            </div>

            {/* Section 5 */}
            <div>
                <h2>5. Demand Segmentation (K-Means Clustering)</h2>
                <p>Using K-Means Clustering on View Count and Likes to understand different tiers of video performance (Niche, Steady, Viral).</p>

                <button className="btn-primary" style={{ width: 'auto', marginBottom: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={() => setShowCode5(!showCode5)}>
                    {showCode5 ? 'Hide Python Code' : 'Show Python Code'}
                </button>

                {showCode5 && (
                    <div className="code-container">
                        <SyntaxHighlighter language="python" style={vscDarkPlus}>
                            {code5}
                        </SyntaxHighlighter>
                    </div>
                )}

                <div className="chart-container" style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={clusterData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                            <XAxis dataKey="name" name="Cluster Segment (0 = Niche, 1 = Viral, 2 = Steady)" stroke="var(--text-secondary)" />
                            <YAxis scale="log" domain={['auto', 'auto']} name="Average Count" stroke="var(--text-secondary)" tickFormatter={(tick) => tick.toExponential(0)} />
                            <Tooltip cursor={{ fill: 'var(--bg-primary)' }} contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                            <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
                            <Bar dataKey="view_count" name="view_count" fill="#75b79e" />
                            <Bar dataKey="likes" name="likes" fill="#e89372" />
                            <Bar dataKey="comment_count" name="comment_count" fill="#93a0c1" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="explanation-block" style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', borderLeft: '4px solid var(--accent-red)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>📈 Understanding the K-Means Output</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>
                        We used an Unsupervised Machine Learning algorithm (K-Means) to automatically group videos into 3 distinct "Demand Tiers" based on their views and likes, processed through a logarithmic scaler to handle massive outliers.<br /><br />
                        <strong>Key Takeaway:</strong> Note the logarithmic scale on the Y-Axis! The algorithm successfully separated the dataset into:<br />
                        1. <strong>Niche/Low Demand:</strong> Hundreds of thousands of views, but much lower engagement.<br />
                        2. <strong>Steady/Medium Demand:</strong> Solid performers in the millions, forming the middle class of YouTube.<br />
                        3. <strong>Viral/High Demand (Outliers):</strong> Videos achieving tens or hundreds of millions of views with engagement stats that astronomically dwarf the other two clusters.
                    </p>
                </div>
            </div>
        </div>
    );
}
