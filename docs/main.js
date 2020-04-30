const colors = [
  { name: "red", hex: "#DB2828" },
  { name: "orange", hex: "#F2711C" },
  { name: "yellow", hex: "#FBBD08" },
  { name: "olive", hex: "#B5CC18" },
  { name: "green", hex: "#21BA45" },
  { name: "teal", hex: "#00B5AD" },
  { name: "blue", hex: "#2185D0" },
  { name: "violet", hex: "#6435C9" },
  { name: "purple", hex: "#A333C8" },
  { name: "pink", hex: "#E03997" },
  { name: "brown", hex: "#A5673F" },
//  { name: "grey", hex: "#767676" },
//  { name: "black", hex: "#1B1C1D" },
]

let data

let deptColors = {}

let age, ages, series

let world, countries, path

let filter = undefined

// Convert from generation-oriented format to iteration-oriented format
function cleanData() {
  data.depts = Object.keys(data.depts)
    .sort((a, b) => data.depts[a].name.localeCompare(data.depts[b].name))
    .map(i => ({
      ...data.depts[i],
      //country: Object.keys(data.depts[i].country).map(i => ({ name: i, value: +data.country[i] })),
      //age: Object.keys(data.depts[i].age).map(i => ({ name: i, value: +data.age[i] })),
      unit_code: i
    }))

  data.depts.forEach((d, i) => {
    deptColors[d.name] = colors[i % colors.length]
  })
  
  //data.country = Object.keys(data.country)
  //  .map(i => ({ name: i, value: +data.country[i] }))
  
  data.age = Object.keys(data.age)
    .map(i => ({ name: +i, value: +data.age[i] }))
}

function hover(d, i, nodes) {
  //if(window.location.hash.includes('hover')) {
    filter = d.key || d.data?.name || d.name
    update()
  //}
}

function leave(d, i, nodes) {
  filter = undefined
  update()
}

function stats() {
  dataset = (filter ? data.depts.filter(i => i.name === filter)[0] : data)

  d3.select('#stat--total').text(`${new Intl.NumberFormat('en-US', {notation: 'compact', compactDisplay: 'short'}).format(dataset.total || dataset.count)}`)
  d3.select('#stat--countries').text(`${Object.keys(dataset.country).length}`)
  const oldest = d3.min(Array.isArray(dataset.age) ? dataset.age.map(i => +i.name) : Object.keys(dataset.age).map(i => +i))
  d3.select('#stat--oldest').text(`${Math.abs(oldest)}s${ oldest <= 0 ? ' BCE' : ''}`)
}

function legend() {
  let div = d3.select('#legend')

  const items = div
    .selectAll('div')
    .data(data.depts, d => d.unit_code)
    .join('div')
      .append('div')
      .attr('class', 'item')
      .html(d => `<span class="ui ${!filter || filter == d.name ? deptColors[d.name].name : 'grey'} empty circular horizontal label"></span> ${d.name}`)
      .on('mouseover', hover)
      .on('mouseout', leave)
}

function initMap() {
  countries = topojson.feature(world, world.objects.countries)

  const svg = d3.select(`#map`)
  const outline = {type: 'Sphere'}
  const width = svg.node().clientWidth
  projection = d3.geoEqualEarth()
  const height = (() => {
    const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline)
    const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy)
    projection.scale(projection.scale() * (l - 1) / l).precision(0.2)
    return dy
  })()
  path = d3.geoPath(projection)

  color = d3.scaleSequentialLog()
    .domain(d3.extent(Object.values(data.country)))
    .interpolator(d3.interpolateRgb('#ccc','#000'))
    .unknown('#ccc')
  
  svg.style("display", "block")
    .attr("viewBox", [0, 0, width, height])

  const defs = svg.append("defs")

  defs.append("path")
    .attr("id", "outline")
    .attr("d", path(outline))

  defs.append("clipPath")
      .attr("id", "clip")
    .append("use")
      .attr("xlink:href", new URL("#outline", location))

  const g = svg.append("g")
    .attr('id', 'map-paths')
    .attr("clip-path", `url(${new URL("#clip", location)})`)

  g.append("use")
    .attr("xlink:href", new URL("#outline", location))
    .attr("fill", "white")

  g.append("g")
    .attr('id', 'mappaths')
    .selectAll("path")
    .data(countries.features)
    .join("path")
      .attr("fill", d => color(data.country[d.properties.name]))
      .attr("d", path)
    .append("title")
      .text(d => `${d.properties.name}
${Object.keys(data.country).includes(d.properties.name) ? data.country[d.properties.name] : "N/A"}`)

  g.append("path")
    .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-linejoin", "round")
    .attr('stroke-width', 0.5)
    .attr("d", path)

  svg.append("use")
    .attr("xlink:href", new URL("#outline", location))
    .attr("fill", "none")
    .attr("stroke", "black")
}

function updateMap() {
  dataset = (filter ? data.depts.filter(i => i.name === filter)[0] : data)
  const g = d3.select('#map-paths')

  color = d3.scaleSequentialLog()
    .domain(d3.extent(Object.values(dataset.country)))
    .interpolator(d3.interpolateRgb('#ccc','#000'))
    .unknown('#ccc')

  d3.select('#mappaths')
    .selectAll("path")
    .data(countries.features)
    .join(
      enter => enter.append('path')
        .attr("d", path)
        .attr("fill", d => color(dataset.country[d.properties.name]))
        .append("title")
          .text(d => `${d.properties.name}
${Object.keys(dataset.country).includes(d.properties.name) ? dataset.country[d.properties.name] : "N/A"}`),
      update => update
        .attr("fill", d => color(dataset.country[d.properties.name]))
        .select("title")
          .text(d => `${d.properties.name}
${Object.keys(dataset.country).includes(d.properties.name) ? dataset.country[d.properties.name] : "N/A"}`)
    )
}

function initAge() {
  const svg = d3.select('#ages')

  const w = 600
  const h = w / 16 * 9

  bars = svg.append('g')
    .attr('class', 'bars')
  
  xAxisGroup = svg.append('g')
    .attr('class', 'xaxisg')
    .attr('transform', `translate(0, ${h - 20})`)
    
  yAxisGroup = svg.append('g')
    .attr('class', 'yaxisg')
    .attr('transform', `translate(60, 0)`)

  age = data.age.filter(i => +i.name >= 1820)

  ages = data.age.filter(i => +i.name >= 1820).map(i => {
    const depts = {}

    data.depts.forEach(j => {
      if(Object.keys(j.age).includes(`${i.name}`)) {
        depts[j.name] = j.age[`${i.name}`]
      } else {
        depts[j.name] = 0
      }
    })

    return {
      name: i.name,
      total: i.value,
      ...depts
    }
  })
  ages.columns = data.depts.map(i => i.name)
  series = d3.stack()
    .keys(ages.columns)(ages)
    .map(d => (d.forEach(v => v.key = d.key), d))
}

function updateAge() {
  const svg = d3.select('#ages')
  const xAxisGroup = d3.select('#ages .xaxisg')
  const yAxisGroup = d3.select('#ages .yaxisg')

  const w = 600
  const h = w / 16 * 9

  svg.style("display", "block")
    .attr("viewBox", [0, 0, w, h])

  xScale = d3.scaleTime()
      .domain([
          new Date(d3.min(age.map(d => +d.name)), 0, 1),
          d3.timeYear.offset(new Date(d3.max(age.map(d => +d.name)), 0, 1), 10)
      ])
      .range([60, w-60])

  yScale = d3.scaleLog()
      .domain([1, d3.max(age.map(d => +d.value))])
      .rangeRound([h - 20, 20])

  x = d3.scaleBand()
    .domain(ages.map(d => d.name))
    .range([60, w-60])
    .padding(0.1)
  y = d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .rangeRound([h - 20, 0])
  
  svg.select('.bars')
    .selectAll('g')
    .data(series)
    .join('g')
      .attr('fill', d => (!filter || filter === d.key ? deptColors[d.key].hex : '#ccc'))
    .selectAll('rect')
    .data(d => d)
    .enter()
      .append('rect')
      .attr('x', (d, i) => x(d.data.name))
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth())
      .on('mouseover', hover)
      .on('mouseout', leave)
      .append('title')
        .text(d => `${d.data.name}
${d.key}
${d.data[d.key]}`)

  xAxis = d3.axisBottom(xScale)
  yAxis = d3.axisLeft(yScale)

  xAxisGroup
      .transition()
      .call(xAxis)

  yAxisGroup
      .transition()
      .call(yAxis)
}

function makePie(_data, selector) {
  const svg = d3.select(selector)

  const w = 300
  const h = w

  svg.style("display", "block")
    .attr("viewBox", [-w/2, -h/2, w, h])

  const pie = d3.pie()
    .padAngle(0.005)
    .sort(null)
    .value(d => d.value)

  const arc = (() => {
    const radius = Math.min(w, h) / 2
    return d3.arc().innerRadius(radius * 0.6).outerRadius(radius * 0.9)
  })()

  const arcs = pie(_data)

  svg.selectAll('path')
    .data(arcs)
    .join(
      enter => enter
        .append('path')
        .attr('fill', d => `${!filter || filter === d.data.name ? deptColors[d.data.name].hex : '#ccc'}`)
        .attr('d', arc)
        .on('mouseover', hover)
        .on('mouseout', leave)
        .append('title')
          .text(d => `${d.data.name}
${d.value}`),
      update => update.attr('fill', d => `${!filter || filter === d.data.name ? deptColors[d.data.name].hex : '#ccc'}`)
    )
}

function updateUnits() {
  const units = Object.keys(data.depts)
    .map(i => ({ name: data.depts[i].name, value: data.depts[i].count }))

  makePie(units, '#units')
}

function updateOnExhibit() {
  const onex = Object.keys(data.depts)
    .map(i => ({ name: data.depts[i].name, value: data.depts[i].on_exhibit }))
    .sort((a, b) => a.value - b.value)
  console.dir(onex)

  makePie(onex, '#onexhibit')
}

function init() {
  initAge()
  initMap()
}

function update() {
  stats()
  legend()

  updateUnits()
  //updateOnExhibit()
  updateAge()
  updateMap()
}

async function main() {
  data = await fetch('stats.json')
    .then(res => res.json())

  cleanData()

  world = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(res => res.json())

  init()
  update()
}

main()