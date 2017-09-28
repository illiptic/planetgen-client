import _ from 'lodash'
import React, { Component } from 'react'
import {Renderer, Scene, PerspectiveCamera, Object3D, Mesh, AmbientLight} from 'react-three'
import {Vector3, Quaternion, SphereGeometry, PlaneGeometry, MeshBasicMaterial, Euler} from 'three'

import Globe from './Globe.js'

class World extends Component{
  render() {
    let {height, width, projected, texture} = this.props

    let cameraprops = {fov : 75, aspect : width/height,
                       near : 1, far : 5000,
                       position : new Vector3(0,0,600),
                       lookat : new Vector3(0,0,0)}

    return (
      <div>
        <Renderer width={width} height={height} background={0x222222}>
          <Scene width={width} height={height} camera="maincamera">
            <AmbientLight color={0xffffff} intensity={1} />
            <PerspectiveCamera name="maincamera" {...cameraprops} />
            {
              projected ? (
                <Object3D quaternion={new Quaternion()} position={new Vector3(0,0,0)}>
                  <Mesh position={new Vector3(0,0,0)} geometry={new PlaneGeometry(800, 600, 32)} material={new MeshBasicMaterial( {map: texture, wireframe: false } )} />
                </Object3D>
              ) : (
                <Globe texture={texture} />
              )
            }
          </Scene>
        </Renderer>
      </div>
    )
  }
}

export default World
