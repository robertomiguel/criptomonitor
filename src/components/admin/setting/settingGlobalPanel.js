import { Form, Radio } from 'antd'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import SettingStore from '../../../store/globalSettings'
import {
    PDAStyleBorder,
    PDAStyleBoxShadow,
    PDA_COLOR_BACKGROUND_BLACK,
} from '../../common/pdaColor'
// import { PDADescription } from '../../common/pdaDescription'

export const SettingGlobalPanel = observer(() => {
    const settingStore = useContext(SettingStore)

    return (
        <Form
            style={{
                background: PDA_COLOR_BACKGROUND_BLACK,
                display: 'inline-block',
                position: 'relative',
                flexWrap: 'wrap',
                minWidth: '300px',
                maxWidth: '400px',
                ...PDAStyleBorder,
                ...PDAStyleBoxShadow,
                paddingLeft: '1em',
                paddingTop: '1em',
            }}
        >
            <Form.Item style={{ textAlign: 'center' }}>
                <label>Tema visual para gráficas</label>
                <Radio.Group
                    value={settingStore.settings.themeColor}
                    buttonStyle="solid"
                    style={{
                        display: 'block',
                    }}
                >
                    <Radio.Button
                        value="Light"
                        onClick={() => {
                            settingStore.setTheme('Light')
                        }}
                    >
                        Claro
                    </Radio.Button>

                    <Radio.Button
                        value="Dark"
                        onClick={() => {
                            settingStore.setTheme('Dark')
                        }}
                    >
                        Oscuro
                    </Radio.Button>
                </Radio.Group>
            </Form.Item>
            {/* <Form.Item>
        <label>Activar Paneles</label>
        <PDADescription
            label="Activar panel 2"
            content={
                <Switch
                    disabled
                    checked={
                        settingStore.settings.panel.panel2
                            .show
                    }
                    style={{ float: 'right' }}
                />
            }
        />
        <PDADescription
            label="Activar panel 3"
            content={
                <Switch
                    disabled
                    checked={
                        settingStore.settings.panel.panel3
                            .show
                    }
                    style={{ float: 'right' }}
                />
            }
        />
    </Form.Item> */}
            {/* <Form.Item>
                <label>Tiempo de actualización (minutos)</label>
                <PDADescription
                    label="Panel 1"
                    content={
                        <Input
                            disabled
                            value={
                                settingStore.settings.panel.panel1.updateTime
                            }
                        />
                    }
                />
                <PDADescription
                    label="Panel 2"
                    content={
                        <Input
                            disabled
                            value={
                                settingStore.settings.panel.panel2.updateTime
                            }
                        />
                    }
                />
                <PDADescription
                    label="Panel 3"
                    content={
                        <Input
                            disabled
                            value={
                                settingStore.settings.panel.panel3.updateTime
                            }
                        />
                    }
                />
            </Form.Item> */}
            {/* <Form.Item>
        <label>Accesos de teclado</label>
        <PDADescription
            label="Intercambio de paneles (circular)"
            content={
                <Input
                    disabled
                    value={
                        settingStore.settings.panel.panel1
                            .switchPanelKey
                    }
                />
            }
        />
        <PDADescription
            label="Cambio rápido entre panel 1 y 2"
            content={
                <Input
                    disabled
                    value={
                        settingStore.settings.panel.panel2
                            .switchPanelKey
                    }
                />
            }
        />
        <PDADescription
            label="Cambio rápido entre panel 1 y 3"
            content={
                <Input
                    disabled
                    value={
                        settingStore.settings.panel.panel3
                            .switchPanelKey
                    }
                />
            }
        />
    </Form.Item> */}
        </Form>
    )
})
