import React, { memo, useContext, useEffect, useState } from 'react'
// import 'antd/dist/antd.css'
import SymbolStore from '../../store/symbol/index'
import { Tabs, Popconfirm, Button } from 'antd'
import SettingStore from '../../store/globalSettings/index'
import { GlobalSetting } from './setting/globalSetting'
import { PanelSetting } from './setting/panelListSetting'
// import { useCookies } from "react-cookie";
import PDAIcon from '../common/pdaIcon'
import { generateId } from '../globalFunctions/generateId'
import { PanelEditorModal } from './formModal'
import { PDA_COLOR_BACKGROUND_BLACK } from '../common/pdaColor'
import { observer } from 'mobx-react-lite'

const SymbolAdmin = observer(() => {
    const symbolStore = useContext(SymbolStore)
    const settingStore = useContext(SettingStore)
    const [list, setList] = useState([[], [], []])
    const tabKeys = ['tab-edit-0', 'tab-edit-1', 'tab-edit-2', 'tab-edit-3']
    const [tabSel, setTabSel] = useState(tabKeys[0])

    useEffect(() => {
        setList(() => [
            symbolStore.listPanel1,
            symbolStore.listPanel2,
            symbolStore.listPanel3,
        ])
    }, [symbolStore.listPanel1, symbolStore.listPanel2, symbolStore.listPanel3])

    const [editorModalSetting, setEditorModalSetting] = useState({
        isOpen: false,
        data: {},
        title: 'Editar',
        okButton: undefined,
        cancelButton: undefined,
        isNew: false,
    })

    const newCharts = (panelNumber) => {
        setEditorModalSetting(() => {
            symbolStore.newData = { id: generateId() }
            return {
                ...editorModalSetting,
                isOpen: true,
                title: `Nuevo en panel ${panelNumber}`,
                isNew: true,
                panelNumber,
            }
        })
    }

    const actions = (symbolId, panelNumber, chartType) => (
        <div>
            <Button
                type="link"
                onClick={() =>
                    setEditorModalSetting(() => {
                        const data = symbolStore.getById(symbolId, panelNumber)
                        symbolStore.newData = data
                        return {
                            ...editorModalSetting,
                            isOpen: true,
                            title: `Editar en panel ${panelNumber}`,
                            isNew: false,
                            panelNumber,
                            chartType,
                            data
                        }
                    })
                }
            >
                <PDAIcon name="MdEdit" content="Editar" />
            </Button>

            <Popconfirm
                title="¿ CONFIRMAR ELIMINACIÓN ?"
                onConfirm={async () => {
                    const isDeleted = await symbolStore.delete(
                        symbolId,
                        panelNumber
                    )
                    if (isDeleted) symbolStore.getList(panelNumber)
                }}
                okText={<PDAIcon name="MdCheck" content="Eliminar" />}
                cancelText={<PDAIcon name="MdClose" content="Cancelar" />}
            >
                <Button type="link">
                    <PDAIcon name="MdDelete" content="Eliminar" />
                </Button>
            </Popconfirm>
        </div>
    )

    const { TabPane } = Tabs

    return (
        <div
            style={{
                padding: '5px',
                maxWidth: '900px',
                marginLeft: '25%',
                marginRight: 'auto',
                backgroundColor: PDA_COLOR_BACKGROUND_BLACK,
                borderRadius: '7px',
                overflow: 'hidden'
            }}
        >
            {editorModalSetting.isOpen && (
                <PanelEditorModal
                    editorModalSetting={editorModalSetting}
                    cancel={() =>
                        setEditorModalSetting(() => {
                            symbolStore.newData = {}
                            return {
                                ...editorModalSetting,
                                isOpen: false,
                            }
                        })
                    }
                />
            )}

            <Tabs
                defaultActiveKey={tabKeys[0]}
                activeKey={tabSel}
                onChange={(key) => setTabSel(() => key)}
            >
                <TabPane
                    tab={
                        <PDAIcon
                            name="MdSettings"
                            content={'Configuraciones generales'}
                        />
                    }
                    key={tabKeys[0]}
                    forceRender
                >
                    <GlobalSetting settingStore={settingStore} />
                </TabPane>
                {[1, 2, 3].map((panelNumber, idx) => (
                    <TabPane
                        tab={
                            <PDAIcon
                                name="MdBuild"
                                content={`Panel ${panelNumber}`}
                            />
                        }
                        key={tabKeys[panelNumber]}
                    >
                        <PanelSetting
                            list={list[idx]}
                            panelNumber={panelNumber}
                            newCharts={(v) => newCharts(v)}
                            actions={(v, n, c) => actions(v, n, c)}
                        />
                    </TabPane>
                ))}
            </Tabs>
        </div>
    )
})

export default memo(SymbolAdmin)
