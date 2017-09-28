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
      pending: false,
      seed: ''
    }
  }

  componentDidMount () {
    this.generate()
  }

  colorGen (low, high) {
    return (v) => {
      let ratio = (v - low)/ (high -low)
      if (ratio > 0.9) { return [255, 255, 255] } // white
      else if (ratio > 0.8) { return [50, 50, 50] } // grey

      else if (ratio < 0.6) { return [0, 120, 255] } // blue
      else if (ratio < 0.63) { return [230, 230, 40] } // yellow
      else { return [0, 255, 30] } // green
    }
  }

  createTexture ({map, low, high}) {
    let h = _.keys(map).length
    let w = _.keys(map[0]).length

    let data = new Uint8Array(w*h*3)

    let color = this.colorGen(low, high)
    let index = 0
    _.forEach(map, (T, p) => {
      _.forEach(T, (v, t) => {
        [data[index], data[index+1], data[index+2]] = color(v)
        index += 3
      })
    })
    let texture = new DataTexture(data, w, h, RGBFormat, UnsignedByteType)
    texture.needsUpdate = true
    return texture
  }

  generate (e) {
    if (!this.state.pending) {
      this.setState({pending: true})
      getMap(this.state.seed).then(result => {
        let texture = this.createTexture(result)
        this.setState({texture, low: result.low, high: result.high, pending: false})
      })
    }

  }

  render() {
    let {texture, projected, pending, seed} = this.state

    return (
      <div>
        <div>
          <input type="number" value={seed} onChange={(e) => {this.setState({seed: parseInt(e.target.value)})}} /> <button disabled={pending} onClick={this.generate.bind(this)}>{pending ? 'Loading...' : 'Generate!'}</button>
          <br />
          Project? <input type="checkbox" selected={projected} onClick={() => {this.setState({projected: !projected})}}/>
        </div>
        {
          texture ? <World width={800} height={600} texture={texture} projected={projected}/> : <div>Loading</div>
        }
      </div>
    )
  }
}

export default App
