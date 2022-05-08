import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import {Fontisto} from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "88d9f2d4d1362390066949c155d2593f";

const icons = {
  Clouds : "cloudy",
  Clear : "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow : "snow",
  Rain : "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync(({accuracy: 5}));
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        { days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" style={{marginTop: 10, marginRight: 10}} size="large"/>
          </View>
         ) : (
           days.map((day, index) =>
           <View key={index} style={styles.day}>
             <View style={{ alignItems: "center", width: "100%", justifyContent: "space-between"}}>
             <Fontisto name={icons[day.weather[0].main]} size={100} color="white" />
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
             </View>
             <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
           </View>
           )
         )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  city: {
    flex: 1.2,
    justifyContent: "center",   // 세로 가운데 정렬
    alignItems: "center",   // 가로 가운데 정렬
  },
  cityName: {
    fontSize: 45,
    fontWeight: "500",
    color: "white",
  },
  weather: {
  },
  day: {
    alignItems: "center",
    width: SCREEN_WIDTH,
  },
  temp: {
    fontSize: 120,
    color: "white",
  },
  description: {
    marginTop: -15,
    fontSize: 40,
    color: "white",
    marginLeft: 10,
  },
  tinyText: {
    fontSize: 18,
    color: "white",
    marginLeft: 10,
  }
});
