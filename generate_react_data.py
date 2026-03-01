import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import json

def generate_react_data():
    try:
        df = pd.read_csv('archive/youtube_dislike_dataset.csv')
    except Exception as e:
        print("Dataset not found:", e)
        return

    df.dropna(subset=['comments'], inplace=True)
    df['total_interactions'] = df['likes'] + df['dislikes']
    df['dislike_ratio'] = np.where(df['total_interactions'] > 0, df['dislikes'] / df['total_interactions'], 0)
    df['engagement_rate'] = np.where(df['view_count'] > 0, (df['likes'] + df['comment_count'] + df['dislikes']) / df['view_count'], 0)

    # 1. Top 10 Channels
    top_channels = df.groupby('channel_title')['view_count'].sum().nlargest(10).reset_index()
    
    # 2. Monthly Views
    df['published_at'] = pd.to_datetime(df['published_at'])
    monthly_views = df.groupby(df['published_at'].dt.month)['view_count'].sum().reset_index()
    monthly_views.rename(columns={'published_at': 'published_month'}, inplace=True)

    # 3. Dislike Ratio Distribution
    counts, bin_edges = np.histogram(df['dislike_ratio'], bins=50)

    # 4. Correlation Matrix
    numeric_df = df[['view_count', 'likes', 'dislikes', 'comment_count', 'dislike_ratio', 'engagement_rate']]
    corr_matrix = numeric_df.corr().round(3)

    # 5. K-Means
    features_kmeans = df[['view_count', 'likes']]
    features_log = np.log1p(features_kmeans)
    scaler_kmeans = StandardScaler()
    features_scaled = scaler_kmeans.fit_transform(features_log)
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    df['cluster'] = kmeans.fit_predict(features_scaled)
    sampled_df = df.sample(n=1000, random_state=42)
    cluster_points = []
    for _, row in sampled_df.iterrows():
        cluster_points.append({
            'x': float(row['view_count']),
            'y': float(row['likes']),
            'cluster': int(row['cluster'])
        })
    
    data = {
        'top_10_channels_by_views': {
            'channel_title': top_channels['channel_title'].to_list(),
            'view_count': top_channels['view_count'].to_list()
        },
        'monthly_views_series': {
            'published_month': monthly_views['published_month'].to_list(),
            'view_count': monthly_views['view_count'].to_list()
        },
        'dislike_ratio_dist': {
            'counts': counts.tolist(),
            'bins': bin_edges[:-1].tolist()
        },
        'correlation': {
            'variables': corr_matrix.columns.tolist(),
            'matrix': corr_matrix.values.tolist()
        },
        'clusters': {
            'points': cluster_points
        }
    }
    
    with open('frontend-react/src/data/dashboard_data.json', 'w') as f:
        json.dump(data, f)
    
    print("Successfully generated frontend-react/src/data/dashboard_data.json!")

if __name__ == "__main__":
    generate_react_data()
