import React from 'react';
import './App.css';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

class WeatherComponent extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
      <Typography variant="h2" component="div" gutterBottom>{this.props.temperature}°</Typography>
      <Typography variant="subtitle1" component="div" gutterBottom>Apparent temperature: {this.props.apparent_temperature}°</Typography>
      <Typography variant="subtitle1" component="div" gutterBottom>Precipitation: {this.props.precipitation}mm</Typography>
      <Typography variant="subtitle1" component="div" gutterBottom>Relative Humidity: {this.props.relativehumidity}%</Typography>
      </div>
    );
  }
}

class LocationInput extends React.Component {
  constructor(props) {
    super(props);
    this.loadedOptions = [];
    this.state = {options: []};
  }

  loadLocationInformation(locationName) {
     fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + locationName)
      .then(res => res.json())
      .then(
        (result) => {
          if(result.results != undefined && result.results.length != 0) {
            
            let items = [];
            result.results.forEach(function(item) {
              let objectItem = {name: item.name, country_code: item.country_code, country: item.country, latitude: item.latitude, longitude: item.longitude};
              let doesContain = false;
              
              //Check for duplicates
              for (let i = 0; i < items.length; i++) {
                if(items[i].name == objectItem.name) {
                  doesContain = true;
                  break;
                }
              }

              if(!doesContain) {
                items.push(objectItem);
              }
            });

            for (let i = 0; i < items.length; i++) {
              if(items[i].name == locationName) {
                this.props.onChange(items[i]);
                break;
              }
            }

            let options = [];
            for (let i = 0; i < items.length; i++) {
               options.push({label:items[i].name, code:items[i].country_code, country:items[i].country});
            }
            this.setState({options: options});
          }
        }
      )
  }


  onChange(value) {
    this.loadLocationInformation(value);
  }

  render() {
    return (
      //
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={this.state.options}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        onChange={(e, v) => this.onChange(v.label)}
        sx={{ width: 300 }}
        renderOption={(props, option) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            <img
              loading="lazy"
              width="20"
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
              alt=""
            />
            {option.label}, {option.country}
          </Box>
        )}
        renderInput={(params) => <TextField label="Choose a place" {...params} onChange={e => this.onChange(e.target.value)}/>}
      />
    );
  }
}

class WeatherApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {inputGiven:false, isLoading:false};
  }

  onLocationInputChange(locationData) {
    this.currentLocationData = locationData;
    this.loadWeatherData(locationData.latitude, locationData.longitude)
  }

  loadWeatherData(lat, long) {
    this.setState({inputGiven:true, isLoading:true});

    fetch("https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,weathercode")
    .then(res => res.json())
    .then(
      (result) => {
        const d = new Date();
        let hour = d.getHours();

        let temperature = result.hourly.temperature_2m[hour];
        let precipitation = result.hourly.precipitation[hour];
        let relativehumidity = result.hourly.relativehumidity_2m[hour];
        let apparent_temperature = result.hourly.apparent_temperature[hour];

        this.weatherData = {temperature: temperature, precipitation: precipitation, relativehumidity: relativehumidity, apparent_temperature: apparent_temperature};
        this.setState({inputGiven: true, isLoading:false});
      }
    )
  }
  

  render() {
      return  (
        <Card variant="outlined" id="test"style={{borderRadius:"12px"}} >
          <React.Fragment>
            <CardContent>
              <html lang="en" translate='no'>
              <link rel="stylesheet" type="text/css" href="styles.css"></link>
                <body onload="loadPage(3)">
                  <div  class="topnav" id="navbar"></div>
                  <script src="navbar.js" type="text/javascript"></script>
                  <h1>Devin's Weather Reporter</h1>
                  <LocationInput onChange={(this.onLocationInputChange).bind(this)}/>
                  <div style={{marginTop: 20}}>
                  {!this.state.isLoading && !this.state.inputGiven ? <Typography variant="subtitle1">Enter a location above to see the weather data</Typography> : null}
                  {this.state.isLoading ? <div><CircularProgress /><Typography variant="subtitle1">Loading...</Typography></div> : null}
                  {!this.state.isLoading && this.state.inputGiven ? <div>
                  <Box component="div" sx={{ '& > img': { mr: 2, flexShrink: 0 } }}>
                    <img
                      loading="lazy"
                      width="20"
                      src={`https://flagcdn.com/w20/${this.currentLocationData.country_code.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w40/${this.currentLocationData.country_code.toLowerCase()}.png 2x`}
                      alt=""
                    />
                    {this.currentLocationData.name}, {this.currentLocationData.country}
                  </Box>
                  <WeatherComponent 
                    temperature={this.weatherData.temperature} 
                    precipitation={this.weatherData.precipitation}
                    relativehumidity={this.weatherData.relativehumidity}
                    apparent_temperature={this.weatherData.apparent_temperature}/>
                    </div> : null}
                    </div>
              </body>
          </html>
            </CardContent>
            <CardActions>
              <Typography variant="subtitle1">Weather and location data provided by <Link href="https://open-meteo.com/en" variant="body2" target="_blank">Open-Meteo</Link></Typography>
            </CardActions>
          </React.Fragment>
        </Card>
      );
    }
}

function App() {
  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700display=swap"
      />
      <WeatherApp  style={{ minHeight: '100%' }}/>
    </div>
  );
}

export default App;
