//Dimensions
const width = 1000, height = 1000;
const projection = d3.geoNaturalEarth1().scale(width / 4).translate([width / 1.45, height / 2.3]);
const path = d3.geoPath().projection(projection);

const svg = d3.select("svg").attr("width", width).attr("height", height);
function resize() {
  const width = window.innerWidth, height = window.innerHeight;
  const scale = Math.min(width) / 6;
  projection.scale(scale).translate([width / 2, height / 1.79]);
  svg.attr('width', width).attr('height', height);
  svg.selectAll('path').attr('d', path);
}
window.addEventListener('resize', resize);

//Data Loading
d3.json("data.json").then(function(data) {
  window.geojson = data;
  const initialYear = parseFloat(d3.select('#yearSlider').node().value);
  updateHeatmap(initialYear);
});

//Color Scale
let colorArray = ["#f7fcf5","#e8f6e3","#d3eecd","#b7e2b1","#97d494","#73c378","#4daf62","#2f984f","#157f3b","#036429","#00441b"];

//Heatmap Domain
let colorScale = d3.scaleLinear()
    .domain([-0.25, -0.2, -0.15, -0.1, -0.05, 0.0, 0.33333333, 0.66666667, 1.0, 5.0, 9.0, 13.0])
    .range(colorArray);

function updateHeatmap(selectedYear) {
  const filteredData = geojson.features.filter(d => Math.round(d.properties.year) === selectedYear);

  const consumptionValues = filteredData.map(d => d.properties.total_consumption_zscore).filter(v => v != null);
  const colorDomain = d3.extent(consumptionValues);
  colorScale.domain([-0.25, -0.2, -0.15, -0.1, -0.05, 0.0, 0.33333333, 0.66666667, 1.0, 5.0, 9.0, 13.0]);

  const countries = svg.selectAll("path.country")
    .data(filteredData, d => d.properties.gu_a3);

  countries.enter().append("path")
    .merge(countries)
    .attr("class", "country")
    .attr("d", path)
    .attr("fill", d => colorScale(d.properties.total_consumption_zscore))
    .on("click", function(event, d) {
      event.stopPropagation();
        var selectedYear = parseFloat(d3.select('#yearSlider').node().value);
        var countryData = geojson.features.find(feature => 
          feature.properties.sovereignt === d.properties.sovereignt && 
          feature.properties.year === selectedYear);
      
        var [x, y] = d3.pointer(event, svg.node());

        var tempTooltip = d3.select('#info')
        .style('left', x + 'px')
        .style('top', y + 'px')
        .style('opacity', 0)
        .style('display', 'block');

        var tooltipWidth = tempTooltip.node().getBoundingClientRect().width;
        var tooltipHeight = tempTooltip.node().getBoundingClientRect().height;

        if (x + tooltipWidth > window.innerWidth) {
          x -= tooltipWidth;
        }
        if (y + tooltipHeight > window.innerHeight) {
          y -= tooltipHeight;
        }

        tempTooltip.style('left', x + 'px')
        .style('top', y + 'px')
        .style('opacity', 1)
        
        d3.select('#info')
          .style('left', x + 'px')
          .style('top', y + 'px')
          .style('display', 'block')
          .html(`Country: ${d.properties.sovereignt}<br>Year: ${selectedYear}<br>` +
                `Biofuel Consumption: ${countryData ? countryData.properties.biofuel_consumption || 'N/A' : 'N/A'}<br>` +
                `Coal Consumption: ${countryData ? countryData.properties.coal_consumption || 'N/A' : 'N/A'}<br>` + 
                `Fossil Fuel Consumption: ${countryData ? countryData.properties.fossil_fuel_consumption || 'N/A' : 'N/A'}<br>` +
                `Gas Consumption: ${countryData ? countryData.properties.gas_consumption || 'N/A' : 'N/A'}<br>` +
                `Hydro Consumption: ${countryData ? countryData.properties.hydro_consumption || 'N/A' : 'N/A'}<br>` +
                `Nuclear Consumption: ${countryData ? countryData.properties.nuclear_consumption || 'N/A' : 'N/A'}<br>` +
                `Oil Consumption: ${countryData ? countryData.properties.oil_consumption || 'N/A' : 'N/A'}<br>` +
                `Solar Consumption: ${countryData ? countryData.properties.solar_consumption || 'N/A' : 'N/A'}<br>` +
                `Wind Consumption: ${countryData ? countryData.properties.wind_consumption || 'N/A' : 'N/A'}<br><br>` +
                `Low Carbon Consumption: ${countryData ? countryData.properties.low_carbon_consumption || 'N/A' : 'N/A'}<br>` +
                `Primary Energy Consumption: ${countryData ? countryData.properties.primary_energy_consumption || 'N/A' : 'N/A'}<br>` +
                `Renewables Consumption: ${countryData ? countryData.properties.renewables_consumption || 'N/A' : 'N/A'}<br>` +
                `Other Renewable Consumption: ${countryData ? countryData.properties.other_renewable_consumption || 'N/A' : 'N/A'}<br>` +
                `Total Consumption: ${countryData ? countryData.properties.total_consumption || 'N/A' : 'N/A'}<br>` + 
                `Total Consumption Z-Score: ${countryData ? countryData.properties.total_consumption_zscore || 'N/A' : 'N/A'}`);
    });
  countries.exit().remove();
}

//Tooltip
svg.on("click", function(event) {
  // Check if the clicked element is not a country path
  if (!event.target.closest("path")) {
    d3.select('#info').style('display', 'none'); // Hide the tooltip
  }
});

//Year Slider
d3.select('#yearSlider').on('input', function() {
  const year = parseFloat(this.value);
  d3.select('#yearLabel').text(year); // Update year label
  updateHeatmap(year); // Redraw map for selected year
});

const initialYear = parseInt(d3.select('#yearSlider').attr("value"), 10);
d3.select('#yearLabel').text(initialYear);
updateHeatmap(initialYear);