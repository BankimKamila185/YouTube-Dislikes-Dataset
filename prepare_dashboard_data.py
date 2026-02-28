import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import json
import os

def prepare_data():
    file_path = 'archive/youtube_dislike_dataset.csv'
    
    print(f"Loading dataset from {file_path}...")
    try:
        df = pd.read_csv(file_path)
    except FileNotFoundError:
        print(f"Error: Dataset not found at {file_path}. Please run dataset download first.")
        return

    print("Preprocessing data...")
    df.dropna(subset=['comments'], inplace=True)
    df['total_interactions'] = df['likes'] + df['dislikes']
    df['dislike_ratio'] = np.where(df['total_interactions'] > 0, df['dislikes'] / df['total_interactions'], 0)
    df['engagement_rate'] = np.where(df['view_count'] > 0, (df['likes'] + df['comment_count'] + df['dislikes']) / df['view_count'], 0)
    
    dashboard_data = {}

    print("1. Computing Dislike Ratio Distribution...")
    counts, bin_edges = np.histogram(df['dislike_ratio'], bins=50)
    # Convert numpy types to native Python types for JSON serialization
    dashboard_data['dislike_ratio_dist'] = {
        'counts': counts.tolist(),
        'bins': bin_edges[:-1].tolist() # Use left edge for labels
    }

    print("2. Computing Correlation Matrix...")
    numeric_df = df[['view_count', 'likes', 'dislikes', 'comment_count', 'dislike_ratio', 'engagement_rate']]
    corr_matrix = numeric_df.corr().round(3)
    # Convert dataframe to dictionary
    dashboard_data['correlation'] = {
        'variables': corr_matrix.columns.tolist(),
        'matrix': corr_matrix.values.tolist()
    }

    print("3. Performing K-Means Clustering (Demand Segmentation)...")
    features_kmeans = df[['view_count', 'likes']]
    
    # Preprocess
    features_log = np.log1p(features_kmeans)
    scaler_kmeans = StandardScaler()
    features_scaled = scaler_kmeans.fit_transform(features_log)
    
    # Train
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    df['cluster'] = kmeans.fit_predict(features_scaled)
    
    # Downsample for the scatter plot to keep JSON small
    sampled_df = df.sample(n=1000, random_state=42)
    cluster_points = []
    
    for _, row in sampled_df.iterrows():
        cluster_points.append({
            'x': float(row['view_count']), # views
            'y': float(row['likes']),      # likes
            'cluster': int(row['cluster'])
        })
        
    dashboard_data['clusters'] = {
        'points': cluster_points
    }
    
    # Summary stats
    print("4. Computing Summary Statistics...")
    dashboard_data['summary'] = {
        'total_videos': int(len(df)),
        'avg_views': float(df['view_count'].mean()),
        'avg_likes': float(df['likes'].mean()),
        'avg_dislike_ratio': float(df['dislike_ratio'].mean())
    }

    # Save to JSON
    output_dir = 'backend/data'
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, 'dashboard_data.json')
    
    print(f"Saving dashboard data to {output_file}...")
    with open(output_file, 'w') as f:
        json.dump(dashboard_data, f)
        
    print("Dashboard data prepared successfully!")

if __name__ == "__main__":
    prepare_data()
