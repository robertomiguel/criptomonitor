import TechnicalAnalysisWidget from 'react-tradingview-technical-analysis'
import { generateId } from '../../globalFunctions/generateId'

export const technicalAnalysis = (name, themeColor, interval) => {
    return (
        <TechnicalAnalysisWidget
            symbol={name}
            colorTheme={themeColor.toLowerCase()}
            interval={interval} // 1m, 5m, 15m, 1h, 4h, 1W, 1M
            containerId={generateId()}
            width={380}
            isTransparent={false}
            height={210}
            showIntervalTabs={false}
            locale="es"
        />
    )
}
