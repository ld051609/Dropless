from flask import Flask, request, jsonify
from time_series_model import forecast_country_data
from datetime import datetime
from flask_cors import CORS

@app.route('/forecast', methods=['POST'])
def forecast():
    data = request.get_json()
    country_name = data['country_name']
    # Current year is the default forecasted year
    forecasted_year = datetime.now().year
    forecast_df = forecast_country_data(country_name, forecasted_year)
    return forecast_df.to_json()



app = Flask(__name__)
if __name__ == '__main__':
    app.run(debug=True)