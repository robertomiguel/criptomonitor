import React, { useContext, useEffect } from 'react'
import Dashboard from './components/dashboard'
import { Login } from './login'
import { observer } from 'mobx-react-lite'
import FireUserStore from './store/firebase/user'
import SymbolStore from './store/symbol/'
import SettingStore from './store/globalSettings'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const InitApp = () => {
    const firebaseConfig = {
        apiKey: process.env.REACT_APP_APIKEY,
        authDomain: process.env.REACT_APP_AUTHDOMAIN,
        databaseURL: process.env.REACT_APP_DATABASEURL,
        projectId: process.env.REACT_APP_PROJECTID,
        storageBucket: process.env.REACT_APP_STORAGEBUCKET,
        messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
        appId: process.env.REACT_APP_APPID,
        measurementId: process.env.REACT_APP_MEASUREMENTID,
    }

    try {
        firebase.initializeApp(firebaseConfig)
        firebase.firestore().enablePersistence()
    } catch (error) {
        alert('No se pudo conectar ¿Hay internet?')
    }
}

const App = observer(() => {
    const userStore = useContext(FireUserStore)
    const symbolStore = useContext(SymbolStore)
    const settingStore = useContext(SettingStore)

    useEffect(() => {
        InitApp()
    }, [])

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                userStore.isLogged = true
                userStore.useApp = true
            } else {
                userStore.isLogged = false
                userStore.useApp = true
            }
            if (userStore.isLogged && !settingStore.isInit) settingStore.init()
        })
    }, [userStore, settingStore, symbolStore])

    useEffect(() => {
        if (
            userStore.isLogged &&
            settingStore.isInit &&
            settingStore.isSettingsReady &&
            !symbolStore.isInit
        )
            symbolStore.init()
    }, [
        settingStore.isInit,
        settingStore.isSettingsReady,
        symbolStore,
        userStore.isLogged,
    ])

    // const [colorBackground] = useState('white')

    return (
        <div>
            {userStore.useApp &&
                userStore.isLogged &&
                settingStore.isInit &&
                settingStore.isSettingsReady && <Dashboard />}
            <Login />
        </div>
    )
})

export default React.memo(App)
