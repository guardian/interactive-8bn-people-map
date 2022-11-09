import * as d3 from 'd3'
import world from "assets/world-growth.json"
import { geoGilbert } from "d3-geo-projection"
import { $, $$, wait, duplicate } from 'shared/js/util'


const isMobile = window.matchMedia('(max-width: 720px)').matches;

const atomEl = d3.select('.dorling-interactive-wrapper').node();

const width = atomEl.getBoundingClientRect().width;
const height = isMobile ? (window.innerHeight / 2) : window.innerHeight;

const projection = geoGilbert()

const extent = {
    type: "Sphere",

    coordinates: [
        [-180, -90],
        [180, -90],
        [180, 90],
        [-180, 90]
    ]
}

projection
.fitExtent([[20, 0], [width - 30, height]], extent);

const path = d3.geoPath(projection);

const svg = d3.select('.dorling-interactive-wrapper')
    .append('svg')
    .attr('class', 'dorling-svg')
    .attr('width', width)
    .attr('height', height)



let max = d3.max(world.features.map(f => +f.properties["growth_2050"]));
let max2 = d3.max(world.features.map(f => +f.properties["growth_2100"]));

const radius = d3.scaleSqrt()
    .domain([0, max])
    .range([0, 60])

const radius2 = d3.scaleSqrt()
    .domain([0, max2])
    .range([0, 60])

let array = []
let array2 = []

world.features.forEach(w => array.push({coordinates: w.geometry.coordinates, properties:w.properties}) )
world.features.forEach(w => array2.push({coordinates: w.geometry.coordinates, properties:w.properties}) )

console.log(array)
console.log(array2)


const simulation = d3.forceSimulation()
    .nodes(array)
    .force("x", d3.forceX(d => projection(d.coordinates)[0]))
    .force("y", d3.forceY(d => projection(d.coordinates)[1]))
    .force("collide", d3.forceCollide(d => 1 + radius(d.properties.growth_2050)))
    .stop()

const simulation2 = d3.forceSimulation()
    .nodes(array2)
    .force("x", d3.forceX(d => projection(d.coordinates)[0]))
    .force("y", d3.forceY(d => projection(d.coordinates)[1]))
    .force("collide", d3.forceCollide(d => 1 + radius2(d.properties.growth_2100)))
    .stop()


for (let i = 0; i < 300; i++) {
    simulation.tick();
    simulation2.tick();
}

svg.selectAll("circle")
    .data(array2)
    .enter().append("circle")
    .attr('class', d => d.properties.NAME)
    .attr("r", d => radius2(d.properties.growth_2100))
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("fill", "steelblue")
    .attr("fill-opacity", 0.3)
    .attr("stroke", "steelblue");



const years = ['2050', '2100']


const update = (year) => {

    console.log(year)


    svg.selectAll("circle")
    .attr("r", d => radius(d.properties["growth_" + year]))
    .attr("y", d => console.log(array.find(f => f.properties.ISO_A3 === d.properties.ISO_A3).x))
    .attr('x', d => array.find(f => f.properties.ISO_A3 === d.properties.ISO_A3).y)
    
    
}

let year = 2022

years.forEach(y => {
    d3.select('.buttons-wrapper')
    .append('button')
    .attr('class', 'button-' + y)
    .html(y)

    $('.button-' + y).addEventListener('click', () => update(y))
})

// const watchScroll = () => {
//     if (atomEl.getBoundingClientRect().top < window.innerHeight * 0.4) {

//         wait(300).then(() => update(year, true))

//         console.log(year)

//     } else {
//         window.requestAnimationFrame(watchScroll)
//     }
// }

// window.requestAnimationFrame(watchScroll)
