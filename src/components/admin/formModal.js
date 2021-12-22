import Modal from 'antd/lib/modal/Modal'
import { useContext, useState } from 'react'
import SymbolForm from './symbolForm'
import PDAIcon from '../common/pdaIcon'
import SymbolStore from '../../store/symbol/index'
import { observer } from 'mobx-react-lite'
import * as yup from 'yup'
import { set } from 'timm'

const symbolSchema = yup.object().shape({
    chartType: yup.string().trim().min(1).required(),
    description: yup.string().trim().min(1).optional(),
    id: yup.string().optional().required(),
    interval: yup.string().trim().min(1).required(),
    isVisible: yup.boolean().optional(),
    name: yup.string().trim().min(1).required(),
})

export const PanelEditorModal = observer((props) => {
    const symbolStore = useContext(SymbolStore)
    const [errorField, setErrorField] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const okButton = async () => {
        // validar
        setErrorField(() => undefined)
        setIsLoading(() => true)
        try {
            await symbolSchema.validate(symbolStore.newData, {
                abortEarly: false,
                stripUnknown: true,
            })
            if (props.editorModalSetting.isNew) {
                await symbolStore.create(props.editorModalSetting.panelNumber)
            } else
                await symbolStore.update(props.editorModalSetting.panelNumber)
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

    const cancelButton = () => props.cancel()

    return (
        <Modal
            visible={true}
            title={
                <PDAIcon
                    name="MdEdit"
                    content={props.editorModalSetting.title}
                />
            }
            confirmLoading={isLoading}
            onOk={() => okButton()}
            onCancel={() => cancelButton()}
            okText="Aceptar"
            cancelText="Cancelar"
        >
            <SymbolForm
                isNew={props.editorModalSetting.isNew}
                chartType={props.editorModalSetting.chartType}
                errorField={errorField}
            />
        </Modal>
    )
})
