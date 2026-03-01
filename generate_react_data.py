import pandas as pd
import json

def generate_react_data():
    try:
        df = pd.read_csv('archive/youtube_dislike_dataset.csv')
    except Exception as e:
        print("Dataset not found:", e)
        return

    # 1. Top 10 Channels
    top_channels = df.groupby('channel_title')['view_count'].sum().nlargest(10).reset_index()
    
    # 2. Monthly Views
    df['published_at'] = pd.to_datetime(df['published_at'])
    monthly_views = df.groupby(df['published_at'].dt.month)['view_count'].sum().reset_index()
    monthly_views.rename(columns={'published_at': 'published_month'}, inplace=True)
    
    data = {
        'top_10_channels_by_views': {
            'channel_title': top_channels['channel_title'].to_list(),
            'view_count': top_channels['view_count'].to_list()
        },
        'monthly_views_series': {
            'published_month': monthly_views['published_month'].to_list(),
            'view_count': monthly_views['view_count'].to_list()
        }
    }
    
    with open('frontend-react/src/data/dashboard_data.json', 'w') as f:
        json.dump(data, f)
    
    print("Successfully generated frontend-react/src/data/dashboard_data.json!")

if __name__ == "__main__":
    generate_react_data()
