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

    // Data prep for Heatmap (ScatterChart)
    const correlationMatrix = data.correlation.matrix;
    const correlationVariables = data.correlation.variables;
    const heatmapData = [];

    correlationMatrix.forEach((row, rowIndex) => {
        row.forEach((value, colIndex) => {
            heatmapData.push({
                x: rowIndex,
                y: colIndex,
                z: value,
                xLabel: correlationVariables[rowIndex],
                yLabel: correlationVariables[colIndex]
            });
        });
    });

    // Helper for Heatmap Color
    const getColor = (value) => {
        // Simple Coolwarm (Blue to Red) interpolator for -1 to 1
        return value > 0
            ? `rgba(248, 81, 73, ${value})` // Red for positive
            : `rgba(88, 166, 255, ${Math.abs(value)})`; // Blue for negative
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

                <div className="chart-container" style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                            <XAxis
                                type="number"
                                dataKey="x"
                                stroke="var(--text-secondary)"
                                domain={[0, correlationVariables.length - 1]}
                                tickFormatter={(tick) => correlationVariables[tick]}
                                interval={0}
                            />
                            <YAxis
                                type="number"
                                dataKey="y"
                                stroke="var(--text-secondary)"
                                domain={[0, correlationVariables.length - 1]}
                                tickFormatter={(tick) => correlationVariables[tick]}
                                interval={0}
                            />
                            <ZAxis type="number" dataKey="z" range={[500, 500]} />
                            <Tooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                formatter={(value, name, props) => {
                                    if (name === 'z') return [value.toFixed(2), 'Correlation'];
                                    return [];
                                }}
                                labelFormatter={() => ''}
                            />
                            <Scatter data={heatmapData} shape="square">
                                {heatmapData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={getColor(entry.z)} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
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
            </div>
        </div>
    );
}
