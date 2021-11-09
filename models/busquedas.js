const axios = require('axios')

class Busquedas {

    historial = ["A", "B", "C"]

    constructor() {
        // Leer de DB
    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

     getParamsOpenWeathermap(lat, lon){
        return {
            'lat' : lat,
            'lon' : lon,
            'appid' : process.env.OPENWEATHER_KEY,
            'lang': 'es',
            'units': 'metric'
        }
    }

    async ciudad(lugar = '') {

        try {
            // Crear Axios instance
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBox
            })

            // Peticion http
            const resp = await instance.get()

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))

        } catch (error) {
            return []
        }

    }

    async climaLugar(lat, lon) {
        try {
            // Crear Axios instance
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: this.getParamsOpenWeathermap(lat, lon)
            })

            const {data} = await instance.get()

            return {
                desc: data.weather[0].description,
                min: data.main.temp_min,
                max: data.main.temp_max,
                temp: data.main.temp
            }

        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = {
    Busquedas
};
