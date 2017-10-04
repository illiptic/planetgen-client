import React, { Component } from 'react'
import { Form, Button, Slider, Checkbox, Switch, Row, Col } from 'antd'
const FormItem = Form.Item

import _ from 'lodash'

/*
 * Function bound to form by Form.create()
 * See bottom of file
 */
function onFieldsChange (props, changedFields) {
  props.onChange(_.mapValues(changedFields, field => field.value))
}

class RenderForm extends Component {
  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form

    return (
      <Form layout="horizontal" style={{margin: '20px'}}>
        <Row>
          <Col span={12}>
            <FormItem labelCol={{span: 6}} wrapperCol={{span: 12}} label="Projection">
              {getFieldDecorator('projected', {
                initialValue: true
              })(
                <Switch checkedChildren="Surface" unCheckedChildren="Sphere" />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem labelCol={{span: 12}} wrapperCol={{span: 12}}>
              {getFieldDecorator('greyscale', {
                initialValue: false
              })(
                <Checkbox>Greyscale</Checkbox>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem labelCol={{span: 3}} wrapperCol={{span: 21}} label="Offset">
              {getFieldDecorator('offset')(
                <Slider disabled={!getFieldValue('projected')} min={0} max={360} marks={{0: '0°', 360: '360°'}} included={false}/>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem labelCol={{span: 3}} wrapperCol={{span: 21}} label="Sealevel">
              {getFieldDecorator('sealevel')(
                <Slider min={0} max={100} marks={{0: '0%', 50: '50%', 60: '60%', 100: '100%' }}/>
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create({onFieldsChange})(RenderForm)
