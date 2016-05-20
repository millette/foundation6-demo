'use strict'

$(() => {
  // Not so friendly with the bottom sticky footer (aka top-bar)
  // const wow = new WOW()
  // wow.init()
  $(document).foundation()

  $('[data-sticky-container]').on('sticky.zf.stuckto:bottom', () => {
    console.log('sticking')
  })

  $('[data-sticky-container]').on('sticky.zf.unstuckfrom:bottom', () => {
    console.log('unsticking')
  })

  var initalized = false

  const vegaEmbed = (spec, el) => {
    const embed_spec = {
      mode: 'vega-lite',
      actions: false,
      renderer: 'svg',
      spec: spec
    }

    const vegaEl = document.createElement('div')
    vg.embed(vegaEl, embed_spec, (err, result) => {
      const elEl = document.querySelector(el)
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
      if (!initalized) {
        initalized = true
        Foundation.reInit($('#grid'));
      }
    })
  }

  fetch('assets/repos.json')
    .then((response) => response.json())
    .then((json) => {
      const spec = {
        description: 'A simple bar chart with embedded data.',
        data: {
          values: json
        },
        transform: {filter: 'datum.public_repos > 20'},
        mark: 'bar',
        encoding: {
          x: {
            field: 'public_repos',
            bin: { maxbins: 40 },
            type: 'quantitative'
            // type: 'ordinal'
          },
          y: {
            aggregate: 'count', field: '*', type: 'quantitative'
          }
        }
      }

      const spec2 = {
        description: 'A simple bar chart with embedded data.',
        data: {
          values: json
        },
        transform: {filter: 'datum.members > 5'},
        mark: 'bar',
        encoding: {
          x: {
            field: 'members',
            // bin: { maxbins: 20 },
            // type: 'quantitative'
            type: 'ordinal'
          },
          y: {
            aggregate: 'count',
            field: '*',
            type: 'quantitative'
          }
        }
      }

      vegaEmbed(spec, '#viz')
      vegaEmbed(spec2, '#viz2')
    })
    .catch(function(ex) {
      console.log('parsing failed', ex)
    })
})
