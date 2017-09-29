import _ from 'lodash'
import React, { Component } from 'react'
import {Renderer, Scene, PerspectiveCamera, Object3D, Mesh, AmbientLight} from 'react-three'
import {Vector3, Quaternion, SphereGeometry, PlaneGeometry, MeshBasicMaterial, Euler, DataTexture, RGBFormat, UnsignedByteType} from 'three'


const geometry = new SphereGeometry(200,32,32)
const vector = new Vector3(0,0,0)

class Globe extends Component {
  constructor (props) {
    super(props)
    this.state = {
      quaternion: new Quaternion()
    }
  }

  componentDidMount () {
    this.animate()
  }

  animate () {
    function spin(t) {
      let {quaternion} = this.state
      let rotationangle = t * 0.0001
      quaternion.setFromEuler(new Euler(0, rotationangle))
      this.setState({quaternion})

      if (this.looping) {
        this.animationId = requestAnimationFrame(spin.bind(this))
      }
    }

    this.looping = true
    this.animationId = requestAnimationFrame(spin.bind(this))
  }

  stopAnimate () {
    cancelAnimationFrame(this.animationId)
    this.looping = false
  }

  onMouseMove (e) {
    console.log(e)
  }

  componentWillUnmount () {
    this.stopAnimate()
  }

  render () {
    let {quaternion} = this.state
    let { texture } = this.props

    return (
      <Object3D quaternion={quaternion} position={vector} onMouseMove3D={this.onMouseMove.bind(this)}>
        <Mesh position={vector} geometry={geometry} material={new MeshBasicMaterial( {map: texture, wireframe: false } )} />
      </Object3D>
    )
  }
}

export default Globe
