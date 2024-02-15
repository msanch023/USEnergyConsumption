import pandas as pd
import geopandas as gpd

energy = pd.read_csv('/Users/marcosanchez/energyconsumption/owid-energy-data.csv')

americasjson = gpd.read_file('/Users/marcosanchez/energyconsumption/custom.geo.json')

americasenergy = energy[energy['iso_code'].isin(americasjson['gu_a3'])]

americasjson = americasjson[['sovereignt', 'gu_a3','filename', 'geometry']]

americasenergy = americasenergy[['country', 'year', 'iso_code', 'biofuel_consumption', 'coal_consumption', 'fossil_fuel_consumption', 'gas_consumption', 
                                 'hydro_consumption', 'low_carbon_consumption', 'nuclear_consumption', 'oil_consumption', 'other_renewable_consumption', 
                                 'primary_energy_consumption', 'renewables_consumption', 'solar_consumption', 'wind_consumption']]

merged = americasjson.merge(americasenergy, left_on = 'gu_a3', right_on = 'iso_code', how = 'left')

merged.to_file('data.json', driver = 'GeoJSON')
