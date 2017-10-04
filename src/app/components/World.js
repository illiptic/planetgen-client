import React, { Component } from 'react'
import {Renderer, Scene, PerspectiveCamera, Object3D, Mesh, AmbientLight} from 'react-three'
import {Vector3, Quaternion, PlaneGeometry, MeshBasicMaterial} from 'three'

import Globe from './Globe.js'

let prevPos

class World extends Component{
  constructor (props) {
    super(props)
    this.state = {
      dragging: false,
      rotation: 0
    }
  }
  onMouseMove (e) {
    if (!this.props.projected && this.state.dragging) {
      this.setState({rotation: this.state.rotation + (e.screenX - prevPos) * 0.01})
      prevPos = e.screenX
    }
  }

  onMouseUp () {
    this.setState({dragging: false})
  }
  onMouseDown (e) {
    prevPos = e.screenX
    this.setState({dragging: true})
  }

  render() {
    let {height, width, projected, texture} = this.props
    let {dragging, rotation} = this.state

    let cameraprops = {fov : 60, aspect : width/height,
                       near : 1, far : 5000,
                       position : new Vector3(0,0,600),
                       lookat : new Vector3(0,0,0)}

    return (
      <div onMouseMove={this.onMouseMove.bind(this)} onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)}>
        <Renderer width={width} height={height} background={0x222222} >
          <Scene width={width} height={height} camera="maincamera" >
            <AmbientLight color={0xffffff} intensity={1} />
            <PerspectiveCamera name="maincamera" {...cameraprops}/>
            {
              projected ? (
                <Object3D quaternion={new Quaternion()} position={new Vector3(0,0,0)}>
                  <Mesh position={new Vector3(0,0,0)} geometry={new PlaneGeometry(800, 600, 32)} material={new MeshBasicMaterial( {map: texture, wireframe: false } )} />
                </Object3D>
              ) : (
                <Globe texture={texture} dragging={dragging} rotation={rotation} />
              )
            }
          </Scene>
        </Renderer>
      </div>
    )
  }
}

export default World
