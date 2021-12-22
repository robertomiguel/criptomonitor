import { createContext } from 'react'
import { observable } from 'mobx'
import firebase from 'firebase/app'
import { pdaMessage } from '../../components/globalFunctions/pdaMessage'
import { configure } from 'mobx'

configure({
    enforceActions: 'never',
})

const FireUserStore = () => {
    return observable({
        isLogged: false,
        user: undefined,
        firebase: undefined,
        isInit: false,
        useApp: false,
        init() {
            if (!this.isInit) {
                this.isInit = true
            }
        },
        getUser() {
            return this.user
        },
        setUser(user) {
            if (user) {
                this.user = user
                this.isLogged = true
            } else {
                this.user = undefined
                this.isLogged = false
            }
        },
        async canUseApp() {
            try {
                const db = firebase.firestore()
                const uid = firebase.auth().currentUser.uid
                const session = (
                    await db.collection('session').doc(uid).get()
                ).data()

                console.log('sess ', session)

                if (session && session.isConnected) {
                    firebase.auth().signOut()
                    alert(
                        'Ya tiene una sesión iniciada, cerrar la sesión anterior antes de iniciar una nueva. Cualquier inconveniente, consulte al soporte técnico.'
                    )
                    return false
                } else {
                    this.setSession()
                    return true
                }
            } catch (error) {
                if (error.code) pdaMessage(error.code, error.message, 'error')
                return false
            }
        },
        async getIp() {
            const text = (url) => {
                return fetch(url).then((res) => res.text())
            }
            const data = await text('https://www.cloudflare.com/cdn-cgi/trace')
            const ipRegex = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/
            const ip = data.match(ipRegex)[0]
            return ip
        },
        async setSession() {
            try {
                const db = firebase.firestore()
                const uid = firebase.auth().currentUser.uid

                await db
                    .collection('session')
                    .doc(uid)
                    .set({
                        isConnected: true,
                        currentIp: await this.getIp(),
                    })
                this.useApp = true
            } catch (error) {
                if (error.code) pdaMessage(error.code, error.message, 'error')
                console.log('error: ', error)
            }
        },
        async login(credentials) {
            try {
                const user = await firebase
                    .auth()
                    .signInWithEmailAndPassword(
                        credentials.email,
                        credentials.password
                    )

                if (user) {
                    const db = firebase.firestore()
                    const uid = firebase.auth().currentUser.uid
                    const session = (
                        await db.collection('session').doc(uid).get()
                    ).data()
                    if (session && session.isConnected) {
                        this.useApp = false
                        firebase.auth().signOut()
                        alert(
                            'Ya tiene una sesión abierta, cierre la sesión anterior para iniciar una nueva sesión. Cualquier inconveniente, contacte al servico de post-venta.'
                        )
                        window.location.reload()
                        return false
                    } else {
                        await db
                            .collection('session')
                            .doc(uid)
                            .set({
                                isConnected: true,
                                currentIp: await this.getIp(),
                            })
                        this.useApp = true
                    }
                }
                firebase
                    .auth()
                    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                return true
            } catch (error) {
                if (error.code) pdaMessage(error.code, error.message, 'error')
                return false
            }
        },
        async logout() {
            try {
                const db = firebase.firestore()
                const uid = firebase.auth().currentUser.uid
                await db
                    .collection('session')
                    .doc(uid)
                    .set({ isConnected: false, lastIp: await this.getIp() })
                firebase.auth().signOut()
                window.location.reload()
            } catch (error) {
                if (error.code) pdaMessage(error.code, error.message, 'error')
                console.log('error: ', error)
            }
            return true
        },
    })
}
export default createContext(FireUserStore())
