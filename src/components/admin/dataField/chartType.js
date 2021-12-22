import { Select } from 'antd'
import React, { memo } from 'react'

export const ChartTypeField = memo((props) => {
    const chartTypeData = [
        { id: 'clock', name: 'Reloj' },
        { id: 'bars', name: 'Barras' },
    ]
    const { Option } = Select
    return (
        <div>
            {props && props.view && (
                <span>
                    {chartTypeData.filter((f) => f.id === props.value)[0].name}
                </span>
            )}

            {props && !props.view && (
                <div>
                    <Select
                        value={props.value}
                        style={{ width: '100%' }}
                        onChange={(v) => props.onChange(v)}
                    >
                        {chartTypeData.map((charType) => (
                            <Option key={charType.id}>{charType.name}</Option>
                        ))}
                    </Select>
                </div>
            )}
        </div>
    )
})
