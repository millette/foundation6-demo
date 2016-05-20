$(() => {
  'use strict'

  const wow = new WOW()
  wow.init()
  $(document).foundation()

  console.log('fetching!')
  fetch('assets/repos.json')
    .then(function(response) {
      return response.json()
    }).then(function(json) {
      console.log('parsed json', json.length)
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    })

  const embed_spec = {
    mode: 'vega-lite',
    actions: false,
    background: 'white',
    renderer: 'svg',
    spec: {
      "description": "A simple bar chart with embedded data.",
      "data": {
        "values": [
          {"a": "A","b": 28}, {"a": "B","b": 55}, {"a": "C","b": 43},
          {"a": "D","b": 91}, {"a": "E","b": 81}, {"a": "F","b": 53},
          {"a": "G","b": 19}, {"a": "H","b": 87}, {"a": "I","b": 52}
        ]
      },
      "mark": "bar",
      "encoding": {
        "x": {"field": "a", "type": "ordinal"},
        "y": {"field": "b", "type": "quantitative"}
      }
    }
  }

  // vg.embed('#viz', embed_spec, function(error, result) {})

  const vegaEl = document.createElement('div')
  vg.embed(vegaEl, embed_spec, (err, result) => {
    const elEl = document.querySelector('#viz')
    if (err) {
      if (elEl) {
        const preEl = document.createElement('pre')
        preEl.innerHTML = err
        elEl.appendChild(preEl)
      }
      return
    }
    elEl.appendChild(vegaEl)
    const svg = result.view._el.firstChild
    const width = svg.getAttribute('width')
    const height = svg.getAttribute('height')
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
  })
})
