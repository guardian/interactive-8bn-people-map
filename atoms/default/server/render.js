import mainHTML from "./atoms/default/server/templates/main.html!text"
import request from "request-promise"
import world from "assets/centroids.json"
import fs from "fs"

export async function render() {

    const data = await request({"uri":'https://interactive.guim.co.uk/docsdata-test/1sQRzi5Xuc2OcsbjMoUw_4Ev1so9OPcRNAjQW1j-4gzk.json', json:true});

    const population = data.sheets.Population.filter(f => f['ISO3 Alpha-code'] != '')

    //const data = await request({"uri":'https://interactive.guim.co.uk/docsdata-test/11BbJld8ASzzeKKduE9Rp6Tq4rJUJl49IP-uGxmvhtg4.json', json:true});

    // const population = data.sheets.population.filter(f => f['ISO3 Alpha-code'] != '')
    // const estimate = data.sheets.estimates.filter(f => f['ISO3 Alpha-code'] != '')

    world.features.forEach(element => {

        let id = element.properties.ISO_A3;

        let countryPop = population.filter(f => f['ISO3 Alpha-code'] === id)
        //let countryEst = estimate.filter(f => f['ISO3 Alpha-code'] === id)

        if(countryPop.length > 0)
        {

            //console.log(element.properties.NAME)
            countryPop.forEach(f => {

                element.properties['growth_' + f.Year] = f['Growth from 2021']
                //console.log(f.Year, f['Growth from 2021'])
            })
            // for(let i = 1950; i <= 2021; i ++)
            // {
            
            //     let pop = countryPop.find(f => Number(f.Year) === i)['Total Population, as of 1 January (thousands)']

            //     element.properties['pop_' + i] = pop;
            // }
        }

        // if(countryEst.length > 0)
        // {
        //     for (let index = 2022; index < 2100; index++) {


        //         let est = countryEst.find(f => Number(f.Year) === index)['Total Population, as of 1 January (thousands)']

        //         element.properties['pop_' + index] = est;
                
        //     }
        // }
    });

    //fs.writeFileSync(`assets/world-growth.json`, JSON.stringify(world));

    

    //fs.writeFileSync(`assets/population.json`, JSON.stringify(population));



    return mainHTML;
} 