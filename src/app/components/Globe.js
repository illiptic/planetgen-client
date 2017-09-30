import _ from 'lodash'
import React, { Component } from 'react'
import {Renderer, Scene, PerspectiveCamera, Object3D, Mesh, AmbientLight} from 'react-three'
import {Vector3, Quaternion, SphereGeometry, PlaneGeometry, MeshBasicMaterial, Euler, DataTexture, RGBFormat, UnsignedByteType} from 'three'


const geometry = new SphereGeometry(200,32,32)
const vector = new Vector3(0,0,0)

const quaternion = new Quaternion()

class Globe extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rotationangle: 0
    }
  }

  componentDidMount () {
    this.animate()
  }

  animate () {
    function spin(t) {
      if (!this.props.dragging) {
        let {rotationangle} = this.state
        rotationangle += 0.005
        this.setState({rotationangle})
      }

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

  componentWillUnmount () {
    this.stopAnimate()
  }

  render () {
    let { rotationangle } = this.state
    let { texture, dragging, rotation } = this.props

    quaternion.setFromEuler(new Euler(0, rotationangle + rotation))

    return (
      <Object3D quaternion={quaternion} position={vector}>
        <Mesh position={vector} geometry={geometry} material={new MeshBasicMaterial( {map: texture, wireframe: false } )} />
      </Object3D>
    )
  }
}

export default Globe
