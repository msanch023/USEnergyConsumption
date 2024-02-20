import pandas as pd
import geopandas as gpd
import numpy as np
from scipy.stats import zscore


energy = pd.read_csv('/Users/marcosanchez/energyconsumption/owid-energy-data.csv')

worldjson = gpd.read_file('/Users/marcosanchez/energyconsumption/geo.json')


energy[energy['country'] == 'USSR'] = energy[(energy['country'] == 'USSR') & (energy['year'] >= 1980) & (energy['year'] <= 1984)]
energy.loc[(energy['country'] == 'USSR') & (energy['iso_code'].isna()), 'iso_code'] = 'RUS'



worldenergy = energy[energy['iso_code'].isin(worldjson['gu_a3'])]

worldjson = worldjson[['sovereignt', 'gu_a3','filename', 'geometry']]

worldenergy = worldenergy[['country', 'year', 'iso_code', 'biofuel_consumption', 'coal_consumption', 'fossil_fuel_consumption', 'gas_consumption', 
                                 'hydro_consumption', 'low_carbon_consumption', 'nuclear_consumption', 'oil_consumption', 'other_renewable_consumption', 
                                 'primary_energy_consumption', 'renewables_consumption', 'solar_consumption', 'wind_consumption']]

merged = worldjson.merge(worldenergy, left_on = 'gu_a3', right_on = 'iso_code', how = 'left')

merged = merged[(merged['year'] >= 1980) & (merged['year'] <= 2020)]

columns_to_sum = ['biofuel_consumption', 'coal_consumption', 'fossil_fuel_consumption', 'gas_consumption', 'hydro_consumption', 'nuclear_consumption', 'oil_consumption', 'solar_consumption', 'wind_consumption']
merged['total_consumption'] = merged[columns_to_sum].fillna(0).sum(axis=1)

merged.loc[merged['country'] == 'USSR', 'sovereignt'] = 'USSR'

merged['total_consumption_zscore'] = zscore(merged['total_consumption'])

merged.to_file('data.json', driver = 'GeoJSON')

