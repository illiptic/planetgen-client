import React, { Component } from 'react'

class Slider extends Component {
  render () {
    let {onChange, level, disabled} = this.props

    return (
      <div style={wrapperStyle}>
        <input disabled={disabled} style={inputStyle} type="range" value={level} onChange={e => onChange(e.target.value) }/>
      </div>
    )
  }
}

const wrapperStyle = {
  display: 'inline-block',
  width: '20px',
  height: '150px',
  padding: 0
}

const inputStyle = {
  width: '150px',
  height: '20px',
  margin: 0,
  transformOrigin: '75px 75px',
  transform: 'rotate(-90deg)'
}

export default Slider
