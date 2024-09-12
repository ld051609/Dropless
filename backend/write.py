import csv
import json
from collections import defaultdict

# Path to the input CSV file and the output JSON file
csv_file_path = './dataset/COUNTRY.csv'
json_file_path = './data.json'

# Initialize a defaultdict of lists to store the data
data = defaultdict(list)

# Read the CSV file and process the data
with open(csv_file_path, mode='r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        country = row['Country']
        year = row['Year']
        water_resources = float(row['Total renewable water resources per capita (m3/inhab/year)'])
        data[country].append({
            year: year,
            water_resources: water_resources
        })

# Write the transformed data to a JSON file
with open(json_file_path, mode='w') as file:
    json.dump(data, file, indent=4)

print(f"Data has been successfully written to {json_file_path}")
