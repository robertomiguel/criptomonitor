import { Collapse } from 'antd'
import { observer } from 'mobx-react-lite'

import { SymbolCodeTable } from './symbolTableCode'
import {
    PDAStyleBorder,
    PDAStyleBoxShadow,
    PDA_COLOR_BACKGROUND_BLACK,
} from '../../common/pdaColor'
import { SettingGlobalPanel } from './settingGlobalPanel'
import { useState } from 'react'

export const GlobalSetting = observer((props) => {
    const [activePanel, setActivePanel] = useState('panelSetting-2')
    const { Panel } = Collapse

    return (
        <div
            style={{ textAlign: 'center', width: '100%', position: 'relative' }}
        >
            <Collapse
                activeKey={activePanel}
                onChange={(keyPanel) => setActivePanel(() => keyPanel)}
                style={{ textAlign: 'left' }}
            >
                <Panel header="Configuraciones de paneles" key="panelSetting-1">
                    <SettingGlobalPanel />
                </Panel>
                <Panel
                    header="Lista de monedas disponibles"
                    key="panelSetting-2"
                >
                    <div
                        style={{
                            background: PDA_COLOR_BACKGROUND_BLACK,
                            display: 'block',
                            position: 'relative',
                            flexWrap: 'wrap',
                            minWidth: '300px',
                            width: '100%',
                            ...PDAStyleBorder,
                            ...PDAStyleBoxShadow,
                        }}
                    >
                        <SymbolCodeTable />
                    </div>
                </Panel>
            </Collapse>
        </div>
    )
})
