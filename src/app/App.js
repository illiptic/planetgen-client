import React, { Component } from 'react'
import {DataTexture, RGBFormat, UnsignedByteType} from 'three'

import World from './components/World.js'

import {getMap} from './services/api.js'

class App extends Component{
  constructor (props) {
    super(props)
    this.state = {
      map: null,
      texture: null,
      low: null,
      high: null,
      projected: true,
      offset: 0,
      pending: false,
      seed: '',
      iterations: 200,
      randWidth: false,
      width: ''
    }
  }

  componentDidMount () {
    this.generate()
  }

  colorGen (low, high) {
    return (v) => {
      let ratio = (v - low)/ (high -low)
      if (ratio > 0.92) { return [255, 255, 255] } // white
      else if (ratio > 0.8) { return [50, 50, 50] } // grey

      else if (ratio < 0.6) { return [0, 120, 255] } // blue
      else if (ratio < 0.63) { return [230, 230, 40] } // yellow
      else { return [0, 255, 30] } // green
    }
  }

  createTexture ({map, low, high}, offset = 0) {
    let h = _.keys(map).length
    let w = _.keys(map[0]).length

    let data = new Uint8Array(h*w*3)

    let color = this.colorGen(low, high)
    let index = 0
    _.forEach(map, (T, p) => {
      let rowIndex = p * w
      _.forEach(T, (v, t) => {
        let idx = (rowIndex + ((t + offset) % w))*3;
        [data[idx], data[idx+1], data[idx+2]] = color(v)
        index += 3
      })
    })
    let texture = new DataTexture(data, w, h, RGBFormat, UnsignedByteType)
    texture.needsUpdate = true
    return texture
  }

  generate (e) {
    e && e.preventDefault()

    let {seed, iterations, width, randWidth, pending, offset} = this.state
    if (!pending) {
      this.setState({pending: true})
      width = randWidth ? 'random' : width
      getMap({seed, iterations, width}).then(result => {
        let texture = this.createTexture(result, offset)
        this.setState({map: result.map, texture, low: result.low, high: result.high, pending: false})
      })
    }

  }

  onOffsetChange (e) {
    let offset = ((parseInt(e.target.value) || 0) + 360) % 360

    let texture = this.createTexture(this.state, offset)

    this.setState({offset, texture})
  }

  render() {
    let {texture, projected, offset, pending, seed, iterations, width, randWidth} = this.state

    return (
      <div>
        <div>
          <form onSubmit={this.generate.bind(this)} >
          Seed: <input type="number" value={seed} onChange={(e) => {this.setState({seed: parseInt(e.target.value)})}} />
          Iterations: <input type="number" value={iterations} onChange={(e) => {this.setState({iterations: parseInt(e.target.value)})}} />
          Random width ? <input type="checkbox" selected={randWidth} onClick={() => {this.setState({randWidth: !randWidth})}}/>
          Width: <input disabled={randWidth} type="number" min={90} max={270} value={width} onChange={(e) => {this.setState({width: parseInt(e.target.value)})}} />
          <br />
          <button disabled={pending} type="submit">{pending ? 'Loading...' : 'Generate!'}</button>
          </form>
          <br />
          Project? <input type="checkbox" selected={projected} onClick={() => {this.setState({projected: !projected})}}/>
          Offset <input type="number" value={offset} min={-10} max={360} step={10} onChange={this.onOffsetChange.bind(this)} />
        </div>
        {
          texture ? <World width={800} height={600} texture={texture} projected={projected}/> : <div>Loading</div>
        }
      </div>
    )
  }
}

export default App
