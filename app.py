import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

# Set up the page config
st.set_page_config(page_title="YouTube Analysis Dashboard", layout="wide")

# --- Title and Introduction ---
st.title("YouTube Engagement & Risk Analysis Dashboard")
st.markdown("""
This dashboard analyzes YouTube engagement metrics to understand user preference dynamics, predict the risk of negative reception (dislikes), and cluster content to optimize revenue generation.

**Business Applications:**
*   **Revenue Optimization:** Identify high-demand clusters to optimize supply.
*   **Risk Analysis:** Predict the likelihood of a video having a 'High Risk' of negative reception (Dislike Ratio > 5%) before it escalates.
""")

st.sidebar.header("Navigation")
menu = st.sidebar.radio("Go to:", ["EDA & Clustering (Demand Analysis)", "Risk Prediction (Logistic Regression)"])

# --- Cache Data Loading ---
@st.cache_data
def load_data():
    file_path = '/Users/bankimkamila/.cache/kagglehub/datasets/dmitrynikolaev/youtube-dislikes-dataset/versions/2/youtube_dislike_dataset.csv'
    try:
        df = pd.read_csv(file_path)
    except FileNotFoundError:
         # For deployment, if the file path is different, we can provide a small sample or catch the error.
         # Assuming the Kaggle dataset is pre-downloaded or available in the environment.
        st.error("Dataset not found. Please ensure the Kaggle dataset is available at the specified path.")
        return pd.DataFrame()
        
    df.dropna(subset=['comments'], inplace=True)
    df['published_at'] = pd.to_datetime(df['published_at'])
    df['total_interactions'] = df['likes'] + df['dislikes']
    df['dislike_ratio'] = np.where(df['total_interactions'] > 0, df['dislikes'] / df['total_interactions'], 0)
    df['engagement_rate'] = np.where(df['view_count'] > 0, (df['likes'] + df['comments'] + df['dislikes']) / df['view_count'], 0)
    
    threshold = 0.05
    df['High_Risk'] = (df['dislike_ratio'] > threshold).astype(int)
    return df

df = load_data()

if df.empty:
    st.stop()
    
# --- EDA & Clustering Section ---
if menu == "EDA & Clustering (Demand Analysis)":
    st.header("1. Exploratory Data Analysis (EDA)")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Distribution of Dislike Ratio")
        st.markdown("Shows the frequency of different dislike ratios across all videos. A long tail indicates outlier videos that pose a brand severity risk.")
        fig, ax = plt.subplots(figsize=(8, 5))
        sns.histplot(df['dislike_ratio'], bins=50, kde=True, ax=ax, color='salmon')
        ax.set_title('Risk Indicator Distribution')
        st.pyplot(fig)
        
    with col2:
        st.subheader("Correlation Matrix")
        st.markdown("Highlights that views, likes, and comments are highly correlated (High Demand).")
        numerical_cols = ['view_count', 'likes', 'dislikes', 'comment_count', 'dislike_ratio']
        fig2, ax2 = plt.subplots(figsize=(8, 5))
        sns.heatmap(df[numerical_cols].corr(), annot=True, cmap='coolwarm', fmt=".2f", ax=ax2)
        st.pyplot(fig2)

    st.header("2. Demand Segmentation (K-Means Clustering)")
    st.markdown("Videos are segmented based on Views, Likes, and Comments to identify 'Demand Tiers'.")
    
    # K-Means clustering
    features_cluster = df[['view_count', 'likes', 'comment_count']]
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(features_cluster)
    
    kmeans = KMeans(n_clusters=3, random_state=42)
    df['Demand_Cluster'] = kmeans.fit_predict(scaled_features)
    
    # Scatter plot
    fig3, ax3 = plt.subplots(figsize=(10, 6))
    scatter = sns.scatterplot(data=df.sample(frac=0.1, random_state=1), x='view_count', y='likes', hue='Demand_Cluster', palette='viridis', alpha=0.6, ax=ax3)
    ax3.set_xscale('log')
    ax3.set_yscale('log')
    ax3.set_title("Video Clusters: Likes vs. Views (Log Scale)")
    st.pyplot(fig3)
    
    st.markdown("""
    **Cluster Interpretations:**
    *   **Cluster 0 (Dark Purple):** Low/Niche Demand.
    *   **Cluster 1 (Yellow):** Viral/High Demand - Highest revenue generating assets.
    *   **Cluster 2 (Teal):** Steady/Medium Demand.
    """)

# --- Risk Prediction Section ---
elif menu == "Risk Prediction (Logistic Regression)":
    st.header("Risk Prediction Interface")
    st.markdown("""
    Predict whether a video is likely to have a disproportionately high dislike ratio (**> 5%**) based purely on volume metrics (Views and Comments).
    
    *If a video is predicted as 'High Risk', platforms can preemptively adjust ad-bidding strategies or flag it for review to protect brand safety.*
    """)
    
    # Train the Model
    X = df[['view_count', 'comment_count']]
    X_log = np.log1p(X)
    y = df['High_Risk']
    
    X_train, X_test, y_train, y_test = train_test_split(X_log, y, test_size=0.2, random_state=42)
    scaler_lr = StandardScaler()
    X_train_scaled = scaler_lr.fit_transform(X_train)
    
    log_model = LogisticRegression(class_weight='balanced', random_state=42)
    log_model.fit(X_train_scaled, y_train)
    
    st.subheader("Try the Model")
    col_input1, col_input2 = st.columns(2)
    
    with col_input1:
        input_views = st.number_input("Enter Estimated Views:", min_value=0, value=1000000)
    with col_input2:
        input_comments = st.number_input("Enter Estimated Comments:", min_value=0, value=50000)
        
    if st.button("Predict Risk Level"):
        # Process input
        input_data = pd.DataFrame({'view_count': [input_views], 'comment_count': [input_comments]})
        input_log = np.log1p(input_data)
        input_scaled = scaler_lr.transform(input_log)
        
        # Predict
        prediction = log_model.predict(input_scaled)[0]
        probability = log_model.predict_proba(input_scaled)[0][1]
        
        st.divider()
        if prediction == 1:
            st.error(f"⚠️ **HIGH RISK**: The model predicts this video is likely to have a dislike ratio > 5%.")
        else:
            st.success(f"✅ **LOW RISK**: The model predicts this video will have a normal/low dislike ratio.")
            
        st.info(f"Probability of being High Risk: {probability:.2%}")
