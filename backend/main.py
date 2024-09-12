from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from datetime import datetime
from twilio.rest import Client
import requests
from openai import OpenAI
from dotenv import load_dotenv
import os
load_dotenv() 

from subtask import find_water_source, get_renewable_water, get_weather_data, send_sms_message

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Apply CORS to the whole app


@app.route('/notify', methods=['POST'])
def notify():
    data = request.get_json()
    lat = data['lat']
    lon = data['lon']
    country = data['country']
    to_number = data['to_number']

    temperature, description, weather_condition = get_weather_data(lat, lon)
    predicted_water_resource = get_renewable_water(country, datetime.now().year)

    if temperature is None or weather_condition is None or predicted_water_resource is None:
        return jsonify({'message': 'Failed to get weather data'}), 400
    
    print (temperature, weather_condition, description, predicted_water_resource)

    notifications = []
    if predicted_water_resource < 3000 and ((temperature > 37 or weather_condition) == 'Drought'):
        notifications.append("Alert: Critical water and weather conditions detected!")
        if temperature > 40:
            notifications.append(f"High temperature detected: {temperature}°C.")
        if weather_condition == 'Drought':
            notifications.append("Drought condition detected.")
        if notifications:    
            message = '\n'.join(notifications)
            send_sms_message(message, to_number)
            print("NOTIFICATION SENT")
            return jsonify({
                'temperature': temperature,
                'weather_condition': weather_condition,
                'predicted_water_resource': predicted_water_resource,
                'description': description,
                'message': 'Notification sent'

            }), 200
    else:
        return jsonify({
            'temperature': temperature,
            'weather_condition': weather_condition,
            'description': description,
            'predicted_water_resource': predicted_water_resource
        }), 200

@app.route('/chatbot', methods=['POST'])
def chatbot():
    client = OpenAI(
        api_key= os.getenv('OPENAI_API_KEY')
    )
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
