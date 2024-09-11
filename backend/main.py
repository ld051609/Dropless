from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from datetime import datetime
from twilio.rest import Client
import requests
from openai import OpenAI
from geopy.distance import geodesic

# Twilio credentials
account_sid = 'your_account_sid'
auth_token = 'your_auth_token'

# Weather API key
weather_api_key = 'your_weather_api_key'

# OpenAI API key
client = OpenAI(
    api_key='sk-lgQKvvnKzCm2BInpSnUwuCTYnAzB_sa15OHASPGjm_T3BlbkFJMyNutrbTNs7BtuAR59frymowHhtWOi-2RzfkJy1KMA'
)

# Google API key
GEOLOCATION_API_KEY = 'AIzaSyCOam2W-JWelHDN2EzHXIzyTvXu3SywZMc'

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Apply CORS to the whole app

def get_weather_data(lat, lon):
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={weather_api_key}&units=metric"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        temperature = data['main']['temp']
        weather_condition = data['weather'][0]['main']
        return temperature, weather_condition
    else: 
        return None, None

def send_sms_message(message, to_number):
    client = Client(account_sid, auth_token)
    message = client.messages.create(
        body=message,
        from_='+12018901989',
        to=to_number
    )
    return message.sid


def find_water_source(lat, lng):
    places_url_lake = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius=10000&keyword=lake&key={GEOLOCATION_API_KEY}"
    places_url_river = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius=10000&keyword=river&key={GEOLOCATION_API_KEY}"

    response_lake = requests.get(places_url_lake)
    response_river = requests.get(places_url_river)

    results_lake = response_lake.json().get('results', [])
    results_river = response_river.json().get('results', [])

    # Combine lakes and rivers results
    all_water_sources = results_lake + results_river

    # Function to calculate distance
    def calculate_distance(place):
        place_lat = place.get('geometry', {}).get('location', {}).get('lat')
        place_lng = place.get('geometry', {}).get('location', {}).get('lng')
        if place_lat and place_lng:
            return geodesic((lat, lng), (place_lat, place_lng)).km
        return float('inf')  # If location data is missing

    # Sort all water sources by distance
    all_water_sources.sort(key=calculate_distance)

    # Get top 3 closest water sources
    top_water_sources = []
    for place in all_water_sources[:3]:
        place_id = place.get('place_id')
        if place_id:
            # Construct URL to Google Maps
            maps_url = f"https://www.google.com/maps/place/?q=place_id:{place_id}"
        else:
            maps_url = "No URL available"

        top_water_sources.append({
            'name': place['name'],
            'address': place.get('vicinity', 'No address available'),
            'distance': calculate_distance(place),  # Include distance
            'url': maps_url  # Include the URL
        })
    print(top_water_sources)

    return top_water_sources



@app.route('/notify', methods=['POST'])
def notify():
    data = request.get_json()
    lat = data['lat']
    lon = data['lon']
    predicted_water_resource = data['predicted_water_resource']
    to_number = data['to_number']

    temperature, weather_condition = get_weather_data(lat, lon)

    if temperature is None or weather_condition is None:
        return jsonify({'message': 'Failed to get weather data'}), 400

    notifications = []
    if predicted_water_resource < 1000 and ((temperature > 40 or temperature < 0) or weather_condition == 'Drought'):
        notifications.append("Alert: Critical water and weather conditions detected!")
        if temperature > 40:
            notifications.append(f"High temperature detected: {temperature}°C.")
        if weather_condition == 'Drought':
            notifications.append("Drought condition detected.")
        if notifications:    
            message = '\n'.join(notifications)
            message_sid = send_sms_message(message, to_number)
            print("Notification sent:")
            return jsonify({'message': 'Notification sent'}), 200
    else:
        return jsonify({'message': 'No notification sent'}), 200

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    user_message = data.get('message')
    user_longitude = data.get('longitude')
    user_latitude = data.get('latitude')

    if not user_message:
        return jsonify({'message': 'Please provide a message'}), 400

    if not user_longitude or not user_latitude:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ]       
        )
        chatbot_response = response.choices[0].message.content
        return jsonify({'message': chatbot_response}), 200

    water_sources = find_water_source(user_latitude, user_longitude)
    if not water_sources:
        return jsonify({'message': 'No water sources found nearby'}), 200
    else:
        # Format response as a list of dictionaries
        chatbot_response_jsons = []
        for source in water_sources:
            chatbot_response_json = {
                'name': source['name'],
                'address': source['address'],
                'distance': source['distance'],
                'url': source['url']
            }
            chatbot_response_jsons.append(chatbot_response_json)
        
        return jsonify({'water_sources': chatbot_response_jsons}), 200


if __name__ == '__main__':
    app.run(debug=True)
