modal嵌套form之后,在form里的input输入时,会出现modal闪现(瞬间消失,并重新出现,失去焦点)

```jsx
<div>
    <Button type="primary" onClick={this.showModal}>修改</Button>
    <Modal
        width={600}
        title="参数修改"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        footer={null}>
        <Form
            onSubmit={this.handleOnSubmit.bind(this, index)}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}>

            <Form.Item label="参数类别">{getFieldDecorator('ParamType', {
                    initialValue: record.ParamType,
                    rules: [
                        {
                            required: true,
                            message: '请填写参数类别!'
                        }
                    ]
                })(<Input style={{ width: '100%' }} />)}</Form.Item>
            <Form.Item label="参数类别名称">{getFieldDecorator('ParamTypeName', {
                    initialValue: record.ParamTypeName,
                    rules: [
                        {
                            required: true,
                            message: '请填写参数类别名称!'
                        }
                    ]
                })(<Input style={{ width: '100%' }} />)}</Form.Item>
            <Form.Item label="参数编号">{getFieldDecorator('ParaId', {
                    initialValue: record.ParaId,
                    rules: [
                        {
                            required: true,
                            message: '请填写参数编号!'
                        }
                    ]
                })(<Input style={{ width: '100%' }} />)}</Form.Item>
            <Form.Item label="字段名称">{getFieldDecorator('Paraname', {
                    initialValue: record.Paraname,
                    rules: [
                        {
                            required: true,
                            message: '请填写字段名称!'
                        }
                    ]
                })(<Input style={{ width: '100%' }} />)}</Form.Item>
            <Form.Item label="是否选中">{getFieldDecorator('Selected', {
                    initialValue: record.Selected,
                    rules: [
                        {
                            required: true,
                            message: '请填写是否选中!'
                        }
                    ]
                })(<Input style={{ width: '100%' }} />)}</Form.Item>
            <Form.Item label="阈值参数属性">{getFieldDecorator('thresholdProperty', {
                    initialValue: record.thresholdProperty,
                    rules: [
                        {
                            required: true,
                            message: '请填写阈值参数属性!'
                        }
                    ]
                })(<Input style={{ width: '100%' }} />)}</Form.Item>
            <Form.Item label="阈值参数可能取值范围">{getFieldDecorator('ValueList', {
                    initialValue: record.ValueList,
                    rules: [
                        {
                            required: true,
                            message: '请填写阈值参数可能取值范围!'
                        }
                    ]
                })(<Input style={{ width: '100%' }} />)}</Form.Item>
            <Form.Item label="阈值参数最小值">{getFieldDecorator('MinparamValue', {
                    initialValue: record.MinparamValue,
                    rules: [
                        {
                            required: true,
                            message: '请填写阈值参数最小值!'
                        }
                    ]
                })(<Input style={{ width: '100%' }} />)}</Form.Item>
            <Form.Item label="阈值参数最大值">{getFieldDecorator('MaxparamValue', {
                    initialValue: record.MaxparamValue,
                    rules: [
                        {
                            required: true,
                            message: '请填写阈值参数最大值!'
                        }
                    ]
                })(<Input style={{ width: '100%' }} />)}</Form.Item>
            <Form.Item label="频度">{getFieldDecorator('FreqPercent', {
                    initialValue: record.FreqPercent,
                    rules: [
                        {
                            required: true,
                            message: '请填写频度!'
                        }
                    ]
                })(<Input style={{ width: '100%' }} />)}</Form.Item>

            <Button type="primary" style={{ width: '100%' }} htmlType="submit">确认修改</Button>
        </Form>
    </Modal>
</div>
```

