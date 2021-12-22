import React, { useState, useContext, useEffect, useCallback } from 'react'
import { Form, Input, Switch, Select } from 'antd'
import { IntervalField } from './dataField/interval'
import { ChartTypeField } from './dataField/chartType'
import SettingStore from '../../store/globalSettings'
import { set } from 'timm'
import SymbolStore from '../../store/symbol/index'
import { observer } from 'mobx-react-lite'

const { Option } = Select

const PDAInputText = (props) => (
    <Input value={props.value} onChange={props.onChange} />
)

const PDAInputSelect = (props) => (
    <Select
        value={props.value}
        showSearch
        style={{ width: '100%' }}
        onChange={props.onChange}
    >
        {props.list.map((symbol) => (
            <Option key={symbol.code}>
                {symbol.code} | {symbol.name}
            </Option>
        ))}
    </Select>
)

export const SymbolForm = observer((props) => {
    const settingStore = useContext(SettingStore)
    const [symbolList, setSymbolList] = useState([])
    const symbolStore = useContext(SymbolStore)

    const updateForm = useCallback(
        (key, newValue) => {
            const newData =
                key === 'chartType'
                    ? set(
                          set(symbolStore.newData, key, newValue),
                          'interval',
                          undefined
                      )
                    : set(symbolStore.newData, key, newValue)
            // setData(() => newData)
            symbolStore.newData = newData // props.updateData(newData)
        },
        [symbolStore]
    )

    useEffect(() => {
        setSymbolList(() => settingStore.settings.symbolCodeList)
        if (props.isNew) updateForm('isVisible', true)
    }, [settingStore, props, updateForm])

    const validate = (key) =>
        props.errorField && props.errorField[key] ? props.errorField[key] : ''
    return (
        <Form>
            <Form.Item extra={validate('name')} required>
                <label>Moneda</label>

                <PDAInputSelect
                    value={symbolStore.newData.name}
                    onChange={(v) => {
                        updateForm('name', v)
                    }}
                    list={symbolList}
                />
            </Form.Item>
            <Form.Item extra={validate('descrption')}>
                <label>Observaciones</label>
                <PDAInputText
                    value={symbolStore.newData.description}
                    onChange={(newValue) =>
                        updateForm('description', newValue.target.value)
                    }
                />
            </Form.Item>
            <Form.Item extra={validate('chartType')} required>
                <label>Estilo de gráfica</label>
                <ChartTypeField
                    value={symbolStore.newData.chartType}
                    onChange={(newValue) => updateForm('chartType', newValue)}
                />
            </Form.Item>
            <Form.Item extra={validate('interval')} required>
                <label>Intervalo de tiempo</label>
                <IntervalField
                    value={symbolStore.newData.interval}
                    onChange={(newValue) => updateForm('interval', newValue)}
                    chartType={symbolStore.newData.chartType}
                />
            </Form.Item>
            <Form.Item>
                <label>Visible</label>
                <br />
                <Switch
                    checked={symbolStore.newData.isVisible}
                    onChange={() =>
                        updateForm('isVisible', !symbolStore.newData.isVisible)
                    }
                />
            </Form.Item>
        </Form>
    )
})

export default SymbolForm
