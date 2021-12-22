import { Select } from 'antd'
import React from 'react'

export const IntervalField = (props) => {
    const intervalData = {
        clock: [
            { id: '1m', name: 'Un minuto' },
            { id: '5m', name: '5 minutos' },
            { id: '15m', name: '15 minutos' },
            { id: '1h', name: '1 hora' },
            { id: '4h', name: '4 horas' },
            { id: '1W', name: '1 semana' },
            { id: '1M', name: 'Un mes' },
        ],
        bars: [
            { id: '1', name: 'Un minuto' },
            { id: '5', name: '5 minutos' },
            { id: '15', name: '15 minutos' },
            { id: '60', name: '1 hora' },
            { id: '240', name: '4 horas' },
            { id: 'W', name: '1 semana' },
            { id: 'D', name: 'Un día' },
            { id: 'M', name: 'Un mes' },
        ],
    }
    // tipos en version de script para bars
    //  [1,3,5,15,30,60,120,180,"1","3","5","15","30","60","120","180","D","W"]

    const { Option } = Select

    return (
        <div>
            {props && props.view && props.chartType && (
                <span>
                    {
                        intervalData[props.chartType].filter(
                            (f) => f.id === props.value
                        )[0] &&
                        intervalData[props.chartType].filter(
                            (f) => f.id === props.value
                        )[0].name
                    }
                </span>
            )}
            {props && !props.view && props.chartType && (
                <div>
                    <Select
                        disabled={props.chartType === ''}
                        value={props.value}
                        style={{ width: '100%' }}
                        onChange={(v) => props.onChange(v)}
                    >
                        {intervalData[props.chartType].map((interval) => (
                            <Option key={interval.id}>{interval.name}</Option>
                        ))}
                    </Select>
                </div>
            )}
        </div>
    )
}
