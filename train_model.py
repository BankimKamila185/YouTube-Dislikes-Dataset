import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
import os

print("Loading dataset...")
file_path = 'archive/youtube_dislike_dataset.csv'
df = pd.read_csv(file_path)

print("Preprocessing data...")
df.dropna(subset=['comments'], inplace=True)
df['total_interactions'] = df['likes'] + df['dislikes']
df['dislike_ratio'] = np.where(df['total_interactions'] > 0, df['dislikes'] / df['total_interactions'], 0)

threshold = 0.05
df['High_Risk'] = (df['dislike_ratio'] > threshold).astype(int)

print("Preparing features...")
X = df[['view_count', 'comment_count']]
X_log = np.log1p(X)
y = df['High_Risk']

X_train, X_test, y_train, y_test = train_test_split(X_log, y, test_size=0.2, random_state=42)

print("Scaling features...")
scaler_lr = StandardScaler()
X_train_scaled = scaler_lr.fit_transform(X_train)

print("Training Logistic Regression Model...")
log_model = LogisticRegression(class_weight='balanced', random_state=42)
log_model.fit(X_train_scaled, y_train)

print(f"Model Accuracy on Train: {log_model.score(X_train_scaled, y_train):.4f}")
X_test_scaled = scaler_lr.transform(X_test)
print(f"Model Accuracy on Test: {log_model.score(X_test_scaled, y_test):.4f}")

# Create backend directory to save models
os.makedirs('backend', exist_ok=True)

print("Saving model and scaler to backend/ directory...")
joblib.dump(scaler_lr, 'backend/scaler.pkl')
joblib.dump(log_model, 'backend/model.pkl')

print("Done! The model and scaler have been saved successfully.")
