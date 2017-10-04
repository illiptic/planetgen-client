import React, { Component } from 'react'
import { Form, Button, Input, InputNumber, Checkbox, Switch } from 'antd'
const FormItem = Form.Item

class GenerationForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      varyWidth: false
    }
  }

  onSubmit (e) {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      values.width = this.state.varyWidth ? 'random' : values.width
      if (!err) {
        this.props.onSubmit(values)
      }
    })
  }

  onSwitch (varyWidth) {
    console.log(varyWidth)
    this.setState({varyWidth})
  }

  render() {
    const { pending } = this.props
    const { getFieldDecorator } = this.props.form
    let { varyWidth } = this.state

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
      </Form>
    )
  }

}

export default Form.create()(GenerationForm)
