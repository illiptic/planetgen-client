import React, { Component } from 'react'
import {DataTexture, RGBAFormat, UnsignedByteType} from 'three'
import { Layout, Button, Avatar, Spin } from 'antd'
const { Header, Content, Footer, Sider } = Layout

import _ from 'lodash'

import GenerationForm from './components/GenerationForm.js'
import RenderForm from './components/RenderForm.js'
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
      greyscale: false,
      sealevel: 60,
      pending: false
    }
  }

  componentDidMount () {
    this.generate({})
  }

  colorGen (low, high, sealevel, greyscale) {
    if (greyscale) {
      return (v) => {
        let scale = (v - low)/ (high -low) * 255
        return [scale,scale,scale]
      }
    } else {

      let seabound = sealevel/100
      let deepsea = seabound - 0.05
      let beachbound = seabound + 0.03

      return (v) => {
        let ratio = (v - low)/ (high -low)
        if (ratio > 0.92) { return [255, 255, 255] } // white
        else if (ratio > 0.8) { return [50, 50, 50] } // grey

        else if (ratio < deepsea) { return [0, 100, 250] } // deepblue
        else if (ratio < seabound) { return [0, 120, 255] } // blue
        else if (ratio < beachbound) { return [230, 230, 40] } // yellow
        else { return [0, 255, 30] } // green
      }
    }
  }

  createTexture ({map, low, high}, offset = 0, sealevel, greyscale) {
    let h = _.keys(map).length
    let w = _.keys(map[0]).length

    const pixelChanels = 4
    let data = new Uint8Array(h * w * pixelChanels)

    let color = this.colorGen(low, high, sealevel, greyscale)
    _.forEach(map, (T, p) => {
      let rowIndex = p * w
      _.forEach(T, (v, t) => {
        let idx = (rowIndex + ((t + offset) % w)) * pixelChanels;
        [data[idx], data[idx+1], data[idx+2]] = color(v)
        data[idx+3] = 255 // alpha
      })
    })
    let texture = new DataTexture(data, w, h, RGBAFormat, UnsignedByteType)
    texture.flipY = true
    texture.needsUpdate = true
    return texture
  }

  generate ({seed, iterations, width, smoothing}) {
    let {pending, offset, sealevel, greyscale} = this.state
    if (!pending) {
      this.setState({pending: true})
      getMap({seed, iterations, width, smoothing}).then(result => {
        let texture = this.createTexture(result, offset, sealevel, greyscale)
        this.setState({map: result.map, texture, low: result.low, high: result.high, pending: false})
      })
    }
  }

  onRenderOptionChange (changes) {
    let {greyscale, sealevel, offset} = _.merge(this.state, changes)

    if (Object.keys(changes)[0] !== 'projected') {
      let texture = this.createTexture(this.state, offset, sealevel, greyscale)
      this.setState({texture, ...changes})
    }
    this.setState(changes)
  }

  titleStyle (collapsed) {
    let style = {
      transition: 'all 0.1s linear'
    }

    if (collapsed) {
      style.transform = 'rotate(-90deg)'
      style.marginTop = '64px'
    } else {
      style.marginLeft = '10px'
    }

    return style
  }

  render() {
    let {texture, projected, offset, greyscale, sealevel, level, pending, collapsed} = this.state

    return (
      <div>
        <Layout>
          <Sider collapsible
            collapsed={collapsed}
            onCollapse={collapsed => this.setState({collapsed})}
          >
            <Avatar src="/assets/world.png" size="large" style={{margin: '12px'}} />
            <h2 style={this.titleStyle(collapsed)}>Generation</h2>
            {
              !collapsed ? (
                <div style={{marginLeft: '10px', marginRight: '10px'}}>
                  <GenerationForm onSubmit={this.generate.bind(this)} onRenderOptionChange={this.onRenderOptionChange.bind(this)} pending={pending} texture={texture} offset={offset} sealevel={sealevel} greyscale={greyscale}/>
                </div>
              ) : null
            }
          </Sider>
          <Layout>
            <Header>
              <h2>Rendering</h2>
            </Header>
            <Content>
              <Spin spinning={pending || !texture}>
                <RenderForm onChange={this.onRenderOptionChange.bind(this)} offset={offset} sealevel={sealevel} greyscale={greyscale}/>
                {
                  texture ? <World width={800} height={400} texture={texture} projected={projected}/> : <div>Loading</div>
                }
              </Spin>
            </Content>
            <Footer>
            </Footer>
          </Layout>
        </Layout>
      </div>
    )
  }
}

export default App

/*
<div style={{float: 'right'}}>
  Sea level ({sealevel}%)
  <Slider disabled={greyscale} level={sealevel} onChange={this.onSealevelChange.bind(this)} />
</div>
Project? <input type="checkbox" selected={projected} onClick={() => {this.setState({projected: !projected})}}/>
Offset <input type="number" value={offset} min={-10} max={360} step={10} onChange={this.onOffsetChange.bind(this)} />
Greyscale? <input type="checkbox" selected={greyscale} onClick={this.onGreyScaleToggle.bind(this)}/>
*/
