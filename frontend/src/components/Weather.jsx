import { useEffect, useState } from "react";
import { IconButton, TextField, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";

function Weather() {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const [cityWeather, setCityWeather] = useState(null);
  const [selectedCity, setSelectedCity] = useState("Helsinki");

  

  const fetchWeatherData = (city, setWeather) => {
    console.log('apia kutsuttu', city)
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lang=fi&q=${city}&units=metric&APPID=${apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        setWeather(data);         
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchWeatherData(selectedCity, setCityWeather);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);

  const renderWeatherInfo = (weather) => {
    console.log(weather)
    if (weather && weather.weather) {
      return (
        <Card sx={{ display:'flex', p:2, mt:2 }}>
          <CardMedia
            component="img"
            sx={{ height: 100, width: 100 }}
            image={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather Icon"
          />
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {weather.name}
            </Typography>
            <Typography component="div" variant="subtitle1">
              {weather.main.temp > 0 ? `+${weather.main.temp.toFixed(1)}`:`${weather.main.temp.toFixed(1)}`} &#8451;
            </Typography>
          </CardContent>
        </Card>
      );
    } else {
      return <Typography>Couldn&apos;t retrieve weather</Typography>; //https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unescaped-entities.md
    }
  };

  const findMyCity = () => {
    const success = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const geoApiUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${apiKey}`;

      fetch(geoApiUrl)
        .then((res) => res.json())
        .then((data) => {
          const cityName = data[0].name || "city not found";
          setSelectedCity(cityName);
          fetchWeatherData(cityName, setCityWeather);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };

    const error = (error) => {
      console.error("Error getting geolocation:", error);
    };

    const watchId = navigator.geolocation.watchPosition(success, error);

    // Clear the watch position after a short delay
    setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
    }, 1000);
  };

return (
  <Box sx={{ display: "flex", justifyContent: "center" }}>
    <Stack sx={{ bgcolor:"secondary.light", p: 2 }} direction="row" spacing={2} m={3}>
      <Box>{renderWeatherInfo(cityWeather)}</Box>
      <Stack direction="column" spacing={0}>
        <TextField
          label="Another city"
          margin="normal"
          variant="filled"
          value={selectedCity}
          onChange={(event) => setSelectedCity(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              fetchWeatherData(selectedCity, setCityWeather);
            }
          }}
        />
        <IconButton
          aria-label="search"
          size="large"
          color="primary"
          onClick={() => fetchWeatherData(selectedCity, setCityWeather)}
        >
          <SearchSharpIcon fontSize="inherit" />
        </IconButton>
        <Button variant="contained" color="primary" onClick={findMyCity}>
          Find My City
        </Button>
      </Stack>
    </Stack>
  </Box>
);
}

export default Weather;
