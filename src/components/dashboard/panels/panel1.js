import { useContext, useEffect, useState } from 'react'
import { generateId } from '../../globalFunctions/generateId'
import chartWidget from '../widgets'
import { observer } from 'mobx-react-lite'
import SymbolStore from '../../../store/symbol/index'
import { TimerUpdateReport } from './timerUpdateReport'

export const DashPanel1 = observer((props) => {
    const symbolStore = useContext(SymbolStore)
    const [refresh, setRefresh] = useState(false)
    const minutes = 30

    const chartType = (type, name, theme, pnumber) =>
        chartWidget[type](name, theme, pnumber)

    useEffect(() => {
        const interval = setInterval(() => {
            setRefresh(() => true)
            setRefresh(() => false)
        }, minutes * 60000) // 60000 * 5
        return () => clearInterval(interval)
    }, [minutes])

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                textAlign: 'center',
                position: 'fixed',
                overflow: 'scroll',
                paddingBottom: '100px',
            }}
        >
            <TimerUpdateReport minutes={minutes} />

            {!refresh &&
                symbolStore.listPanel1
                    .filter((f) => f.isVisible)
                    .map((symbol) => (
                        <div
                            key={generateId()}
                            style={{
                                display: 'inline-block',
                                position: 'relative',
                                flexWrap: 'wrap',
                            }}
                        >
                            {chartType(
                                symbol.chartType,
                                symbol.name,
                                props.themeColor,
                                symbol.interval
                            )}
                        </div>
                    ))}
        </div>
    )
})
