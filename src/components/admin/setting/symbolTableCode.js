import { Divider, Button, Popconfirm, Table, Tooltip } from 'antd'
import { useContext, useState } from 'react'
import PDAIcon from '../../common/pdaIcon'
import { generateId } from '../../globalFunctions/generateId'
import { SymbolEditModal } from './symbolEditModal'
import SymbolStore from '../../../store/symbol/index'
import SettingStore from '../../../store/globalSettings/index'
import { InfoCircleOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'

export const SymbolCodeTable = observer(() => {
    const settingStore = useContext(SettingStore)
    const symbolStore = useContext(SymbolStore)

    const [showModal, setShowModal] = useState(false)

    const columns = [
        {
            title: 'Código',
            dataIndex: 'code',
            key: generateId(),
        },
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: generateId(),
        },
        {
            title: 'En uso',
            dataIndex: 'used',
            key: generateId(),
        },
        {
            title: '',
            dataIndex: 'action',
            key: generateId(),
            align: 'center',
            width: '15em',
        },
    ]

    const actions = (symbol, index, canDelete) => (
        <div>
            {canDelete && (
                <Button
                    type="link"
                    onClick={() => {
                        settingStore.newSymbol = {
                            action: 'update',
                            index,
                            data: symbol,
                        }
                        setShowModal(() => true)
                    }}
                >
                    <PDAIcon name="MdEdit" content="Editar" />
                </Button>
            )}

            {!canDelete && (
                <Tooltip title="No se puede eliminar/editar Códigos de monedas que están en uso. Primero quite la monedas de los paneles en uso.">
                    <InfoCircleOutlined />
                </Tooltip>
            )}

            {canDelete && (
                <Popconfirm
                    title="¿ CONFIRMAR ELIMINACIÓN ?"
                    okText={<PDAIcon name="MdCheck" content="Eliminar" />}
                    cancelText={<PDAIcon name="MdClose" content="Cancelar" />}
                    onConfirm={() => {
                        settingStore.newSymbol = {
                            action: 'delete',
                            index,
                            data: undefined,
                        }
                        settingStore.setNewSymbol()
                    }}
                >
                    <Button type="link">
                        <PDAIcon name="MdDelete" content="Eliminar" />
                    </Button>
                </Popconfirm>
            )}
        </div>
    )

    return (
        <div>
            {showModal && (
                <SymbolEditModal onCancel={() => setShowModal(() => false)} />
            )}
            <Divider style={{ margin: '1em' }} />
            <Button
                onClick={() => {
                    settingStore.newSymbol = {
                        action: 'new',
                        index: undefined,
                        data: { name: '', code: '' },
                    }
                    setShowModal(() => true)
                }}
                type="primary"
                style={{
                    marginBottom: 16,
                    float: 'left',
                    marginLeft: '1em',
                }}
            >
                <PDAIcon name="MdAdd" content="Nuevo código" />
            </Button>

            <Table
                columns={columns}
                size="small"
                dataSource={settingStore.settings.symbolCodeList.map(
                    (symbol, index) => {
                        const usedOnPanel1 =
                            symbolStore.listPanel1.filter(
                                (f) => f.name === symbol.code
                            ).length > 0
                                ? true
                                : false
                        const usedOnPanel2 =
                            symbolStore.listPanel2.filter(
                                (f) => f.name === symbol.code
                            ).length > 0
                                ? true
                                : false
                        const usedOnPanel3 =
                            symbolStore.listPanel3.filter(
                                (f) => f.name === symbol.code
                            ).length > 0
                                ? true
                                : false
                        const codeUsedOn = `${usedOnPanel1 ? 'P1' : ''} ${
                            usedOnPanel2 ? 'P2' : ''
                        } ${usedOnPanel3 ? 'P3' : ''}`.trim()
                        return {
                            key: generateId(),
                            ...symbol,
                            used: codeUsedOn,
                            action: actions(
                                symbol,
                                index,
                                codeUsedOn.length > 0 ? false : true
                            ),
                        }
                    }
                )}
            />
        </div>
    )
})
