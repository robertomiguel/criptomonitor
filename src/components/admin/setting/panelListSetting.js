import { Button, Table } from 'antd'
import { useEffect, useState } from 'react'
import { PDA_COLOR_BACKGROUND_BLACK } from '../../common/pdaColor'
import PDAIcon from '../../common/pdaIcon'
import { generateId } from '../../globalFunctions/generateId'
import { ChartTypeField } from '../dataField/chartType'
import { IntervalField } from '../dataField/interval'
import { VisibleField } from '../dataField/visibleField'

export const PanelSetting = (props) => {
    const [list, setList] = useState([])

    useEffect(() => {
        setList(() => props.list)
    }, [props.list])

    /* useEffect(() => {
        setList(() => props.symbolStore.getList(props.panelNumber))
    }, [props]) */

    const columns = [
        {
            title: <PDAIcon name="MdMonetizationOn" content="Código" />,
            dataIndex: 'name',
            key: generateId(),
        },
        {
            title: <PDAIcon name="MdInfo" content="Observaciones" />,
            dataIndex: 'description',
            key: generateId(),
        },
        {
            title: <PDAIcon name="MdPieChartOutlined" content="Estilo" />,
            dataIndex: 'chartType',
            key: generateId(),
            render: (value) => <ChartTypeField value={value} view />,
        },
        {
            title: <PDAIcon name="FcClock" content="Intervalo" />,
            dataIndex: 'interval',
            key: generateId(),
            render: (value, fullData) => (
                <IntervalField
                    value={value}
                    view
                    chartType={fullData.chartType}
                />
            ),
        },
        {
            title: <PDAIcon name="MdVisibility" content="Visible" />,
            dataIndex: 'isVisible',
            key: generateId(),
            render: (value) => <VisibleField value={value} view />,
        },
        {
            title: <PDAIcon name="MdBuild_circle" content="Acciones" />,
            dataIndex: 'action',
            key: generateId(),
        },
    ]

    return (
        <div>
            <Button
                onClick={() => props.newCharts(props.panelNumber)}
                type="primary"
                style={{
                    marginBottom: 16,
                }}
            >
                <PDAIcon name="MdAdd" content="Nueva gráfica" />
            </Button>
            <div style={{ backgroundColor: PDA_COLOR_BACKGROUND_BLACK }}>
                <Table
                    columns={columns}
                    size="small"
                    style={{ maxWidth: '900px' }}
                    dataSource={list.map((symbol, index) => {
                        return {
                            key: generateId(),
                            ...symbol,
                            action: props.actions(
                                symbol.id,
                                props.panelNumber,
                                symbol.chartType,
                                index
                            ),
                        }
                    })}
                />
            </div>
        </div>
    )
}
