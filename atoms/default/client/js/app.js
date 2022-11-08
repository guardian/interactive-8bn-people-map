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

const radius = d3.scaleSqrt()
    .domain([0, 336621])
    .range([0, 100])


const simulation = d3.forceSimulation(world.features)
    .force("x", d3.forceX(d => projection(d.geometry.coordinates)[0]))
    .force("y", d3.forceY(d => projection(d.geometry.coordinates)[1]))
    .force("collide", d3.forceCollide(d => 1 + radius(d.properties.growth_2022)))
    .stop();


for (let i = 0; i < 300; i++) {
    simulation.tick();
}

svg.selectAll("circle")
    .data(world.features)
    .enter().append("circle")
    .attr('class', d => d.properties.NAME)
    .attr("r", d => radius(d.properties.growth_2022))
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("fill", "steelblue")
    .attr("fill-opacity", 0.3)
    .attr("stroke", "steelblue");


const update = (year, triggerNext) => {

    simulation
    .force("collide", d3.forceCollide(d => 1 + radius(d.properties["growth_" + year])))

    for (let i = 0; i < 300; i++) {
        simulation.tick();
    }

    d3.select('.year').html(year)

    svg.selectAll("circle")
    .transition()
    .duration(500)
    .attr("cy", d => d.y + 'px')
    .attr('cx', d => d.x + 'px')
    .attr("r", d => radius(d.properties["growth_" + year]))

    if(triggerNext && (year < 2100)) {

        wait(75).then(() => update(year + 1, true))

    }
    
}

let year = 2022

const watchScroll = () => {
    if (atomEl.getBoundingClientRect().top < window.innerHeight * 0.4) {

        wait(300).then(() => update(year, true))

        console.log(year)

    } else {
        window.requestAnimationFrame(watchScroll)
    }
}

window.requestAnimationFrame(watchScroll)
