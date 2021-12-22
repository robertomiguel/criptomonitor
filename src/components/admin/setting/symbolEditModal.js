import PDAIcon from '../../common/pdaIcon'
import { Input, Form } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import SettingStore from '../../../store/globalSettings'
import { useContext, useState } from 'react'
import { setIn } from 'timm'
import { observer } from 'mobx-react-lite'
import * as yup from 'yup'
import { set } from 'timm'

const validatorSchema = yup.object().shape({
    code: yup.string().trim().min(1).required(),
    name: yup.string().trim().min(1).required(),
})

export const SymbolEditModal = observer((props) => {
    const settingStore = useContext(SettingStore)
    const [errorField, setErrorField] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const okButton = async () => {
        // validar
        setErrorField(() => undefined)
        setIsLoading(() => true)
        try {
            await validatorSchema.validate(settingStore.newSymbol.data, {
                abortEarly: false,
                stripUnknown: true,
            })
            settingStore.setNewSymbol()
            cancelButton()
        } catch (validationError) {
            for (const field of validationError.inner) {
                setErrorField((errorField) =>
                    set(errorField, field.path, 'Requerido')
                )
            }
            if (errorField.length === 0)
                return setErrorField(() => {
                    return { error: 'Error inesperado, intente de nuevo.' }
                })
            setIsLoading(() => false)
        }
    }

    const cancelButton = () => {
        settingStore.newSymbol = {
            index: undefined,
            data: { code: '', name: '' },
        }
        props.onCancel()
    }

    const updateForm = (key, newValue) => {
        const newData = setIn(settingStore.newSymbol, ['data', key], newValue)
        settingStore.newSymbol = newData
    }

    const validate = (key) =>
        errorField && errorField[key] ? errorField[key] : ''

    return (
        <Modal
            visible={true}
            title={<PDAIcon name="MdEdit" content="Símbolo" />}
            onOk={() => okButton(props.action)}
            onCancel={() => cancelButton()}
            okText="Aceptar"
            cancelText="Cancelar"
            confirmLoading={isLoading}
        >
            <Form>
                <Form.Item extra={validate('code')}>
                    <label>Código</label>
                    <Input
                        value={settingStore.newSymbol.data.code}
                        onChange={(newValue) =>
                            updateForm(
                                'code',
                                newValue.target.value.toUpperCase()
                            )
                        }
                    />
                </Form.Item>
                <Form.Item extra={validate('name')}>
                    <label>Nombre</label>
                    <Input
                        value={settingStore.newSymbol.data.name}
                        onChange={(newValue) =>
                            updateForm('name', newValue.target.value)
                        }
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
})
