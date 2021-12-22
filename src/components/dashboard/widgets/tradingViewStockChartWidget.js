import { TradingViewStockChartWidget } from 'react-tradingview-components'

export const tradingViewStockChart = (name, themeColor, interval) => {
    return (
        <TradingViewStockChartWidget
            symbol={name}
            theme={themeColor}
            interval={interval}
            range="12m"
            height={210}
            width={380}
            locale="es"
        />
    )
}
