import { Button, Input, Form, Avatar, Popover, Divider } from 'antd'
import React, { useContext, useState } from 'react'
import { pdaMessage } from '../components/globalFunctions/pdaMessage'
import FirebaseUserStore from '../store/firebase/user'
import firebase from 'firebase/app'
import { UserOutlined, FullscreenOutlined } from '@ant-design/icons'
import { PDA_COLOR_LOGO } from '../components/common/pdaColor'

export const Login = () => {
    const userStore = useContext(FirebaseUserStore)
    const [showMenu, setShowMenu] = useState(false)

    const login = async (values) => {
        const isLogged = await userStore.login({
            email: values.username.trim(),
            password: values.password.trim(),
        })
        if (isLogged) setShowMenu(() => false)
    }

    const PDAFormItem = (props) => (
        <Form.Item
            label={props.label}
            name={props.name}
            rules={[
                props.required
                    ? {
                          required: true,
                          message: 'Requerido',
                      }
                    : undefined,
                { whitespace: true, message: 'No puede estar vacio' },
            ]}
        >
            {props.content}
        </Form.Item>
    )

    const LoginForm = () => (
        <div>
            <Form
                name="basic"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                layout="vertical"
                onFinish={(values) => login(values)}
                onFinishFailed={() =>
                    pdaMessage(
                        'Inicio de sesión',
                        'Revisar datos ingresados',
                        'error'
                    )
                }
            >
                <PDAFormItem
                    label="Usuario/email"
                    name="username"
                    content={<Input />}
                    required
                />

                <PDAFormItem
                    label="Contraseña"
                    name="password"
                    content={<Input.Password />}
                    required
                />

                <Form.Item>
                    <Button
                        style={{ width: '100%' }}
                        type="primary"
                        htmlType="submit"
                    >
                        Iniciar sesión
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )

    const LoggedPanel = () => (
        <div style={{ maxWidth: '500px' }}>
            {firebase.auth().currentUser && firebase.auth().currentUser.email}
            <Divider style={{ margin: '10px' }} />
            <Button type="primary" onClick={() => userStore.logout()}>
                Cerrar Sesión
            </Button>
            {/* <SectionAdmin /> */}
        </div>
    )

    const elem = document.documentElement

    const openFullscreen = () => {
        if (elem.requestFullscreen) {
            elem.requestFullscreen()
        } else if (elem.webkitRequestFullscreen) {
            /* Safari */
            elem.webkitRequestFullscreen()
        } else if (elem.msRequestFullscreen) {
            /* IE11 */
            elem.msRequestFullscreen()
        }
    }

    return (
        <div
            style={{
                position: 'fixed',
                right: 2,
                top: 2,
                zIndex: 1000,
            }}
        >
            <Avatar
                style={{
                    color: PDA_COLOR_LOGO,
                    cursor: 'pointer',
                }}
                icon={<FullscreenOutlined />}
                size="large"
                onClick={() => openFullscreen()}
            />

            <Popover
                content={userStore.isLogged ? <LoggedPanel /> : <LoginForm />}
                title={userStore.user ? userStore.user.email : 'PDA 2021'}
                trigger="click"
                visible={showMenu}
                onVisibleChange={() => setShowMenu(() => !showMenu)}
                placement="bottomRight"
            >
                <Avatar
                    style={{
                        backgroundColor: PDA_COLOR_LOGO,
                        cursor: 'pointer',
                    }}
                    icon={<UserOutlined />}
                    size="large"
                />
            </Popover>
        </div>
    )
}
