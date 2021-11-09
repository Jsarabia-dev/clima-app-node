const fs = require('fs');

const axios = require('axios')

class Busquedas {

    historial = []
    dbPath = './db/database.json'

    constructor() {
        this.leerDB()
    }

    get historialCapitalizado() {
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ')
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1))
            return palabras.join(' ')
        })

    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    getParamsOpenWeathermap(lat, lon) {
        return {
            'lat': lat,
            'lon': lon,
            'appid': process.env.OPENWEATHER_KEY,
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

            const { data } = await instance.get()

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

    agregarHistorial(lugar = '') {
        //Prevenir duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) return;

        // Grabar en array
        this.historial.unshift(lugar.toLocaleLowerCase())

        // Grabar en DB
        this.guardarDB()
    }

    guardarDB() {

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))

    }

    leerDB() {
        if (!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' })
        const data = JSON.parse(info)

        this.historial = data.historial

    }
}

module.exports = {
    Busquedas
};
