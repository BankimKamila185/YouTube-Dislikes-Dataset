# YouTube Engagement & Risk Analysis Project

## Business Problem Statement
This project analyzes YouTube engagement metrics (views, likes, comments, and dislikes) to understand the dynamics of user preference, predict the risk of negative reception, and cluster content to optimize revenue generation based on demand. 

As a platform or content creator, identifying which videos will likely face a high dislike ratio is crucial for proactive risk management, brand safety, and potential ad monetization decisions.

## Economic Concepts Applied
1. **Demand-Supply / Revenue Optimization:** 
   Video views, likes, and comments act as proxies for "consumer demand". By identifying high-demand clusters (using K-Means clustering), content creators and platforms can optimize ad-placement strategies and supply more of what consumers want, thus maximizing revenue.
2. **Risk Analysis:** 
   A high number of dislikes relative to likes poses a reputation risk. Predicting this risk (using Logistic Regression) allows for proactive management of brand safety and helps avoid issues such as ad demonetization based on controversial content.
3. **Pricing Strategy**:
   By knowing the risk category of a video before or shortly after publishing, platforms can dynamically adjust ad-bidding strategies based on the video's demand tier and risk profile.

## AI Techniques Used
- **Data Cleaning and Preprocessing:** Handling missing values, datetime conversions, and feature engineering (calculating engagement and risk ratios).
- **Exploratory Data Analysis (EDA):** Visualizing distributions and correlations using Seaborn and Matplotlib to identify trends.
- **K-Means Clustering:** An unsupervised learning algorithm used for Demand Segmentation, creating tiers of videos (e.g., Niche, Steady, Viral).
- **Logistic Regression:** A supervised classification model used for Risk Prediction, predicting if a video will have a disproportionately high dislike ratio based on its engagement volume.

## Dataset Link
[YouTube Dislikes Dataset (Kaggle)](https://www.kaggle.com/datasets/dmitrynikolaev/youtube-dislikes-dataset)

## Screenshots of Outputs and Model Results
*(Add screenshots of your Colab Notebook and deployed Streamlit App here)*

* Example 1: Dislike Ratio Distribution
* Example 2: Correlation Matrix
* Example 3: Streamlit Interactive Dashboard

## Running the Project Locally

### 1. Jupyter Notebook
You can view the full analysis in the `youtube_analysis.ipynb` file.

### 2. Streamlit Web App
To run the dashboard locally:
```bash
pip install -r requirements.txt
streamlit run app.py
```
