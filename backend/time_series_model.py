import pmdarima as pm
import pandas as pd

def forecast_country_data(country_name, forecasted_year):
    file_path = f'dataset/{country_name}.csv'
    df = pd.read_csv(file_path)
    # Prepare the data
    y = df['Total_Renewable_Water_Resources']
    years = df['Year']
    
    # Fit ARIMA model
    model = pm.auto_arima(y, seasonal=False, stepwise=True, trace=True)
    
    # Calculate how far into the future we need to forecast
    last_year = years.max()
    n_periods = forecasted_year - last_year
    
    if n_periods <= 0:
        print(f"The forecasted year {forecasted_year} is already in the dataset or earlier.")
        return
    
    # Forecast for the number of periods (years) needed
    forecast, conf_int = model.predict(n_periods=n_periods, return_conf_int=True)
    forecast_years = list(range(last_year + 1, last_year + 1 + n_periods))
    
    # Create DataFrame for the forecast results
    forecast_df = pd.DataFrame({
        'Year': forecast_years,
        'Forecasted_Total_Renewable_Water_Resources': forecast
    })
    
    # Retrieve the forecasted value for the specific year
    if forecasted_year in forecast_years:
        forecast_value = forecast_df.loc[forecast_df['Year'] == forecasted_year, 'Forecasted_Total_Renewable_Water_Resources'].values[0]
        print(f"Forecasted Total Renewable Water Resources for {country_name} in {forecasted_year}: {forecast_value}")
    else:
        print(f"Could not forecast for the year {forecasted_year}")
    
    # Optionally, return the forecast DataFrame
    return forecast_df
