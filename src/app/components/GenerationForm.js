import React, { Component } from 'react'
import { Form, Button, Input, InputNumber, Switch, Menu, Dropdown, Icon } from 'antd'
const FormItem = Form.Item

import _ from 'lodash'

import { load as loadConfigs, save as saveConfig } from '../services/persist.js'

class GenerationForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      configs: [],
      varyWidth: false
    }
  }

  componentDidMount () {
    this.setState({configs: loadConfigs()})
  }

  save () {
    let {seed, iterations, width} = this.props.form.getFieldsValue(['seed', 'iterations', 'width'])
    width = this.state.varyWidth ? 'random' : width

    let id = [seed,iterations,width].join('-')

    if (_.some(loadConfigs(), {id})) {
      console.log('already saved')
    } else {
      saveConfig({id ,seed, iterations, width, timestamp: (new Date()).toISOString()})
      this.setState({configs: loadConfigs()})
    }
  }

  reload (e) {
    let {seed, iterations, width} = e.item.props
    if (width === 'random') {
      this.setState({varyWidth: true})
      this.props.form.setFieldsValue({seed, iterations})
    } else {
      this.setState({varyWidth: false})
      this.props.form.setFieldsValue({seed, iterations, width})
    }
    this.onSubmit()
  }

  onSubmit (e) {
    e && e.preventDefault()

    this.props.form.validateFields((err, values) => {
      values.width = this.state.varyWidth ? 'random' : values.width
      if (!err) {
        this.props.onSubmit(values)
      }
    })
  }

  onSwitch (varyWidth) {
    this.setState({varyWidth})
  }

  render() {
    const { pending } = this.props
    const { getFieldDecorator, getFieldsValue } = this.props.form
    let { varyWidth, configs } = this.state

    return (
      <Form onSubmit={this.onSubmit.bind(this)} layout="vertical">
        <FormItem label="Seed">
          {getFieldDecorator('seed', {
            initialValue: 10,
            rules: [{
              type: 'number', message: 'Invalid number',
            }],
          })(
            <InputNumber min={0} max={99999999} style={{width: '100%'}} />
          )}
        </FormItem>
        <FormItem label="Iterations">
          {getFieldDecorator('iterations', {
            initialValue: 250,
            rules: [{
              type: 'number', message: 'Invalid number',
            }],
          })(
            <InputNumber min={10} max={10000} style={{width: '100%'}} />
          )}
        </FormItem>
        <Switch checkedChildren="Varying" unCheckedChildren="Fixed" value={varyWidth} onChange={this.onSwitch.bind(this)} style={{float:'right',zIndex: 2}} />
        <FormItem label="Width">
          {getFieldDecorator('width', {
            initialValue: 180
          })(
            <InputNumber disabled={varyWidth} min={90} max={270} style={{width: '100%'}} />
          )}
        </FormItem>
        <FormItem>
          <Button disabled={pending} type="primary" htmlType="submit" loading={pending}>{pending ? 'Loading' : 'Generate'}</Button>
        </FormItem>
        <FormItem>
          <Button onClick={this.save.bind(this)}> Save configuration</Button>
        </FormItem>
        <FormItem>
          <Dropdown overlay={(
            <Menu onClick={this.reload.bind(this)}>
              { configs && configs.map((props) => (
                <Menu.Item key={props.id} {...props}>{props.seed} - {props.iterations} - {props.width} </Menu.Item>
              ))}
            </Menu>
          )}>
            <a href="#">
              Reload a configuration <Icon type="down" />
            </a>
          </Dropdown>
        </FormItem>
      </Form>
    )
  }

}

export default Form.create()(GenerationForm)
