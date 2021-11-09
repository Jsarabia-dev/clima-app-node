require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares} = require("./helpers/inquirer");
const { Busquedas } = require("./models/busquedas");

const main = async() => {

    let opt
    const busquedas = new Busquedas()

    do {

        opt = await inquirerMenu()

        switch(opt){

            case 1:
                // Mostrar mensaje
                const lugar = await leerInput('Ciudad: ')
            
                // Buscar lugares
                const lugares = await busquedas.ciudad(lugar)

                // Seleccionar lugar
                const idSelec = await listarLugares(lugares)
                const lugarSelect = lugares.find(l => l.id === idSelec)

                // Clima
                const climaLugar = await busquedas.climaLugar(lugarSelect.lat, lugarSelect.lng)

                

                // Mostrar resultados
                console.log('\nInformacion de la ciudad\n'.green)
                console.log('Ciudad: ', lugarSelect.nombre)
                console.log('Lat: ', lugarSelect.lat)
                console.log('Lng: ', lugarSelect.lng)
                console.log('Temperatura: ', climaLugar.temp)
                console.log('Min: ', climaLugar.min)
                console.log('Max: ', climaLugar.max)
                console.log('Descripcion: ', climaLugar.desc)

            break
            
        } 

        if (opt !== 0) await pausa()
        
    } while (opt !== 0);



}

main()