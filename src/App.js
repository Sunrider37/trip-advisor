import React, { useEffect, useState } from 'react'
import { CssBaseline, Grid } from '@material-ui/core'
import Header from './components/header/Header'
import List from './components/list/List'
import Map from './components/map/Map'

import getPlacesData, {getWeatherData} from './api/index'

const App = () => {

    const [places, setPlaces] = useState([])
    const [weatherData, setWeatherData] = useState([])
    const [type, setType] = useState('restaraunts')
    const [rating, setRating] = useState('')
    const [filteredPlaces, setFilteredPlaces] = useState([])

    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState({})

    const [childClicked, setChildClicked] = useState(null)

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { longitude, latitude } }) => {
            setCoordinates({ lat: latitude, lng: longitude })
        })
    }, [])

    useEffect(() => {
       const filteredPlaces = places.filter((place) => place.rating > rating)
       setFilteredPlaces(filteredPlaces)
    }, [rating])

    useEffect(() => {
        if(bounds.sw && bounds.ne){
        setLoading(true)
        
        getWeatherData(coordinates.lat, coordinates.lng).then((data) => setWeatherData(data))

        getPlacesData(type,bounds?.sw, bounds?.ne)
            .then((data) => {
                setPlaces(data?.filter((place) => place.name && place.num_reviews > 0))
                setFilteredPlaces([])
                setLoading(false)

            })}
    }, [ bounds, type])

    return (
        <>
            <CssBaseline />
            <Header setCoordinates={setCoordinates} />
            <Grid container spacing={3} style={{ width: '100%' }} >
                <Grid item xs={12} md={4}  >
                    <List places={filteredPlaces.length ? filteredPlaces : places}
                        childClicked={childClicked}
                        loading={loading}
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                    />
                </Grid>
                <Grid item xs={12} md={8}  >
                    <Map
                        setCoordinates={setCoordinates}
                        setBounds={setBounds}
                        coordinates={coordinates}
                        places={filteredPlaces.length ? filteredPlaces : places}
                        setChildClicked={setChildClicked}
                        weatherData={weatherData}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default App
