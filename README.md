🎬 Movie Recommendation System

A content-based movie recommendation system built using Flask and Scikit-learn. This web app suggests similar movies based on user input and displays relevant details like genre, cast, rating, and more.

🚀 Features

🎥 Movie Recommendations – Get similar movies based on user selection

📊 Machine Learning – Uses TF-IDF and cosine similarity for recommendations

🌐 Flask Web App – Interactive UI for an easy experience

🖼 Movie Images – Displays posters for recommended movies

📝 JSON API Support – Returns recommendations as JSON

📂 Project Structure
```
movie-recommendation/
│
├── data/
│   ├── movies.pkl      # Movie dataset
│   ├── indexed.pkl     # Indexed movie titles
│   ├── vectors.pkl     # TF-IDF vectors
│
├── static/
│   ├── images/         # Folder containing movie posters
│   ├── js/             # JavaScript files
│   ├── css/            # CSS stylesheets
│
├── templates/
│   ├── index.html      # Web UI
│
├── app.py              # Flask application
├── requirements.txt    # Dependencies
├── README.md           # Project documentation
```


🔧 Installation
```
1️⃣ Clone the Repository

$ git clone https://github.com/yourusername/movie-recommendation.git
$ cd movie-recommendation

2️⃣ Install Dependencies

$ pip install -r requirements.txt

3️⃣ Run the Application

$ python app.py

4️⃣ Open in Browser

http://127.0.0.1:5000/
```


🎯 How It Works

Select a movie from the dropdown list.

Choose the number of recommendations (default: 5).

Click Recommend to get a list of similar movies.

See details like IMDb ID, Rating, Genre, Cast, Crew, and Movie Poster.

📸 Screenshots

(Add screenshots here if available)

📜 License

This project is open-source, feel free to use, modify, and contribute!

🤝 Contributing

Have suggestions or improvements? Feel free to open an issue or submit a pull request!

🔗 Connect with Me

## Connect with me  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/babajimudhiraj/)

🚀 Happy Coding!
