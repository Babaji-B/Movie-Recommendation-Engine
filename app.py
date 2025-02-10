from flask import Flask, request, jsonify, render_template
import pandas as pd
from sklearn.metrics.pairwise import linear_kernel
import pickle
import os

# Initialize the Flask app and configure it to serve static files
app = Flask(__name__, static_url_path='/static')

# Set up the path for images
IMAGES_FOLDER = os.path.join(app.root_path, 'images')

# Load the data from pickle files
movies = pd.read_pickle('data/movies.pkl')
indexed = pd.read_pickle('data/indexed.pkl')
with open('data/vectors.pkl', 'rb') as f:
    vectors = pickle.load(f)

# Home route to render the main page
@app.route('/')
def home():
    return render_template("index.html")

# Route to get the movie titles for the dropdown
@app.route('/get_movie_titles')
def get_movie_titles():
    movie_titles = movies['Movie Title'].tolist()
    return jsonify(movie_titles)

# Route to get movie recommendations
@app.route('/recommend', methods=['POST'])
def recommend():
    movie_name = request.form.get('movie_name')
    num_recommendations = int(request.form.get('num_recommendations', 5))

    recommendations = movie_recommendation(movie_name, num_recommendations)

    # Replace NaN values with an empty string to prevent issues in JSON conversion
    recommendations = recommendations.fillna('')

    # Convert the recommendations to a list of dictionaries and return as JSON
    recommendations_list = recommendations.to_dict(orient='records')
    return jsonify(recommendations_list)

# Function to generate movie recommendations
def movie_recommendation(name, n):
    # Check if the movie name is in the indexed dictionary
    index = indexed.get(name)
    if index is None:
        return pd.DataFrame()  # Return an empty DataFrame if the movie is not found

    # Compute similarity scores using the linear kernel
    dis = linear_kernel(vectors[index], vectors)
    scores = pd.DataFrame(dis).T
    scores.columns = ['score']
    scores = scores.sort_values("score", ascending=False)

    # Collect the top N recommendations
    lst = []
    for i in range(1, n + 1):
        imdb_id = movies['IMDB ID'][scores.index[i]]
        image_path = os.path.join('images', f'{imdb_id}.jpg')  # Assuming image names are IMDb IDs with .jpg extension
        image_url = f"/static/{image_path}" if os.path.exists(image_path) else None

        s = {
            "Movie Title": movies['Movie Title'][scores.index[i]],
            "IMDB ID": imdb_id,
            "Rating": movies['Ratinng'][scores.index[i]],
            "Genre": movies['Genre'][scores.index[i]],
            "Cast": movies['Cast'][scores.index[i]],
            "Duration": movies['Duration'][scores.index[i]],
            "Crew": movies['crew'][scores.index[i]],
            "Image URL": image_url  # Add the image URL to the response
        }
        lst.append(s)

    return pd.DataFrame(lst)

# Run the app in debug mode for development
if __name__ == '__main__':
    app.run(debug=True)
