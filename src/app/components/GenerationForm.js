import React, { Component } from 'react'
import { Form, Button, Input, InputNumber, Switch, Menu, Dropdown, Icon, Table, Popconfirm, Modal } from 'antd'
const FormItem = Form.Item

import _ from 'lodash'

import { load as loadConfigs, save as saveConfigs } from '../services/persist.js'

class GenerationForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      configs: [],
      varyWidth: false,
      visible: false
    }
  }

  componentDidMount () {
    this.setState({configs: loadConfigs()})
  }

  getTextureMiniature () {
    let {texture} = this.props
    let cvs = document.createElement('canvas')
    let ctx = cvs.getContext('2d')
    ctx.putImageData(new ImageData(Uint8ClampedArray.from(texture.image.data), texture.image.width, texture.image.height), 0, 0)
    return cvs.toDataURL()
  }

  save () {
    let {configs} = this.state
    let {offset, sealevel, greyscale} = this.props
    let {seed, iterations, width} = this.props.form.getFieldsValue(['seed', 'iterations', 'width'])
    width = this.state.varyWidth ? 'random' : width

    let id = [seed, iterations, width, offset, sealevel, greyscale].join('-')

    configs.push({id, seed, iterations, width, offset, sealevel, greyscale, timestamp: (new Date()).toISOString(), preview: this.getTextureMiniature()})
    saveConfigs(configs)
    this.setState({configs})
  }

  delete (config) {
    let {configs} = this.state
    configs = _.reject(configs, {id: config.id})
    saveConfigs(configs)
    this.setState({configs})
  }

  reload (config, e) {
    let {seed, iterations, width, offset, sealevel, greyscale} = config
    if (width === 'random') {
      this.setState({varyWidth: true, visible: false})
      this.props.form.setFieldsValue({seed, iterations})
    } else {
      this.setState({varyWidth: false, visible: false})
      this.props.form.setFieldsValue({seed, iterations, width})
    }
    this.props.onRenderOptionChange({offset, sealevel, greyscale})
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
    const { pending, offset, sealevel, greyscale } = this.props
    const { getFieldDecorator, getFieldsValue } = this.props.form
    let { varyWidth, configs } = this.state

    let configSaved = () => {
      let currentConfig = _.merge({offset, sealevel, greyscale}, getFieldsValue(['seed', 'iterations', 'width']))
      currentConfig.width = varyWidth ? 'random' : currentConfig.width
      return _.some(configs, currentConfig)
    }

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
        <Switch checkedChildren="Varying" unCheckedChildren="Fixed" checked={varyWidth} onChange={this.onSwitch.bind(this)} style={{float:'right',zIndex: 2}} />
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
          <Button disabled={configSaved()} onClick={this.save.bind(this)}> Save configuration</Button>
        </FormItem>
        <FormItem>
          <Button onClick={() => this.setState({visible: true})}>Load configuration</Button>
          <Modal
            title="Load configuration"
            visible={this.state.visible}
            onCancel={() => this.setState({visible: false})}
            footer={<Button onClick={() => this.setState({visible: false})}>Close</Button>}
          >
            <Table locale={{emptyText: 'No saved configurations'}} rowKey="id" pagination={false} bordered size="small" scroll={{y: '200px'}} showHeader={false} dataSource={configs} columns={[{
              dataIndex: 'id',
              key: 'id',
              onCellClick: this.reload.bind(this)
            }, {
              dataIndex: 'preview',
              key: 'preview',
              width: '100px',
              onCellClick: this.reload.bind(this),
              render: (data) => <img height="45" src={data} />
            }, {
              key: 'action',
              width: '30px',
              render: (text, record) => (
                <Popconfirm title="Delete this configuration?" onConfirm={this.delete.bind(this, record)} okText="Yes" cancelText="No">
                  <Button type="danger" icon="delete" shape="circle" size="small" />
                </Popconfirm>
              ),
            }]} />
          </Modal>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(GenerationForm)
