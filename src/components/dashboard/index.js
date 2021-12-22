import { Tabs, Tag } from 'antd'
import React, { useContext, useState } from 'react'
import SymbolAdmin from '../admin'
import SettingStore from '../../store/globalSettings/index'
import PDAIcon from '../common/pdaIcon'
import { DashPanel1 } from './panels/panel1'
import { DashPanel2 } from './panels/panel2'
import { DashPanel3 } from './panels/panel3'
import { observer } from 'mobx-react-lite'
import { useHotkeys } from 'react-hotkeys-hook'

const Dashboard = observer(() => {
    const settingStore = useContext(SettingStore)

    const [keyPanel, setKeyPanel] = useState('dashPanel-1')

    const { TabPane } = Tabs

    const tabPanelProps = (panelNumber) => {
        return {
            tab: (
                <div
                    style={{
                        position: 'relative',
                        width: '150px',
                        display: 'block',
                    }}
                >
                    <PDAIcon
                        name="MdPoll"
                        content={
                            <span>
                                Panel {panelNumber}{' '}
                                <Tag
                                    style={{ borderRadius: '15px' }}
                                    color="orange"
                                >
                                    CTRL+{panelNumber}
                                </Tag>{' '}
                            </span>
                        }
                    />
                </div>
            ),
            forceRender: false,
            style: {
                margin: 0,
                padding: 0,
                position: 'fixed',
            },
        }
    }

    useHotkeys('ctrl+1', (e) => {
        e.preventDefault()
        setKeyPanel(() => 'dashPanel-1')
    })
    useHotkeys('ctrl+2', (e) => {
        e.preventDefault()
        setKeyPanel(() => 'dashPanel-2')
    })
    useHotkeys('ctrl+3', (e) => {
        e.preventDefault()
        setKeyPanel(() => 'dashPanel-3')
    })
    useHotkeys('ctrl+4', (e) => {
        e.preventDefault()
        setKeyPanel(() => 'dashPanel-4')
    })
    return (
        <Tabs
            tabBarStyle={{ display: 'inline-block' }}
            style={{ marginLeft: '5px' }}
            activeKey={keyPanel}
            onChange={(key) => setKeyPanel(() => key)}
        >
            <TabPane {...tabPanelProps(1)} key="dashPanel-1">
                <DashPanel1 themeColor={settingStore.settings.themeColor} />
            </TabPane>
            <TabPane {...tabPanelProps(2)} key="dashPanel-2">
                <DashPanel2 themeColor={settingStore.settings.themeColor} />
            </TabPane>
            <TabPane {...tabPanelProps(3)} key="dashPanel-3">
                <DashPanel3 themeColor={settingStore.settings.themeColor} />
            </TabPane>

            <TabPane
                tab={
                    <PDAIcon
                        name="MdSettings"
                        content={
                            <span>
                                Configuración{' '}
                                <Tag
                                    style={{ borderRadius: '15px' }}
                                    color="orange"
                                >
                                    CTRL+4
                                </Tag>{' '}
                            </span>
                        }
                    />
                }
                key="dashPanel-4"
            >
                <div>
                    <SymbolAdmin />
                </div>
            </TabPane>
        </Tabs>
    )
})

export default Dashboard
