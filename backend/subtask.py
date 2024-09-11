from geopy.distance import geodesic
import requests
import pandas as pd
from twilio.rest import Client

from dotenv import load_dotenv
import os
load_dotenv() 

# .env variables
GEOLOCATION_API_KEY = os.getenv('GEOLOCATION_API_KEY')
OPEN_WEATHER_API_KEY = os.getenv('OPEN_WEATHER_API_KEY')
account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
twilio_number = os.getenv('TWILIO_PHONE_NUMBER')

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

def get_renewable_water(country, year):
    # Convert country name to lowercase for consistency
    country = country.lower()

    # Read csv file
    df = pd.read_csv('./dataset/COUNTRY.csv')
    # Convert country names in the dataframe to lowercase
    df['Country'] = df['Country'].str.lower()
    # Filter by country and year
    data = df[(df['Country'] == country) & (df['Year'] == year)]
    # Get the renewable water resources
    renewable_water = data['Total renewable water resources per capita (m3/inhab/year)']
    if not renewable_water.empty:
        # Convert to float
        renewable_water = float(renewable_water.iloc[0])
        return renewable_water
    else:
        return None

def get_weather_data(lat, lon):
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPEN_WEATHER_API_KEY}&units=metric"
    response = requests.get(url)
    print(f'Weather API response: {response.json()}')
    if response.status_code == 200:
        data = response.json()
        temperature = data['main']['temp']
        weather_condition = data['weather'][0]['main']
        description = data['weather'][0]['description']
        return temperature, description, weather_condition
    else: 
        return None, None



def send_sms_message(message, to_number):
    client = Client(account_sid, auth_token)
    message = client.messages.create(
        body=message,
        from_=twilio_number,
        to=to_number
    )
    return message.sid

