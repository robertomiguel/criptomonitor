import { createContext } from 'react'
import { observable } from 'mobx'
import defaultSymbolTypeList from './symbolDefaultList.json'
import firebase from 'firebase/app'
import { pdaMessage } from '../../components/globalFunctions/pdaMessage'
import { addLast, removeAt, replaceAt, set } from 'timm'

export const newSymbolModel = {
    action: undefined,
    index: undefined,
    data: {
        code: '',
        name: '',
    },
}

const SettingStore = () =>
    observable({
        settings: {
            themeColor: 'Light',
            symbolCodeList: defaultSymbolTypeList,
            panel: {
                panel1: { updateTime: 5, switchPanelKey: 'ALT-X' },
                panel2: { show: true, updateTime: 5, switchPanelKey: 'ALT-1' },
                panel3: { show: true, updateTime: 5, switchPanelKey: 'ALT-2' },
            },
        },
        isSettingsReady: false,
        isInit: false,
        isThemeLoader: false,
        newSymbol: newSymbolModel,
        async init() {
            if (!this.isInit) {
                try {
                    const db = firebase.firestore()
                    const uid = firebase.auth().currentUser.uid

                    const storedSettings = (
                        await db.collection(uid).doc('settings').get()
                    ).data()
                    if (!storedSettings) {
                        const isRestored = await this.restoreSettings()
                        if (!isRestored) return
                    } else {
                        this.settings = storedSettings
                    }
                    this.isInit = true
                    this.isSettingsReady = true
                } catch (error) {
                    this.showError(error)
                    this.isSettingsReady = false
                    this.isInit = false
                }
            }
        },
        showError(error) {
            if (error.code) {
                pdaMessage(error.code, error.message, 'error')
            }
        },
        getSetting(key) {
            return this.settings[key]
        },
        getAllSetting() {
            return this.settings
        },
        setSetting(setting) {
            Object.assign(this.settings, setting)
        },
        setTheme(themeName) {
            try {
                const db = firebase.firestore()
                const uid = firebase.auth().currentUser.uid
                this.settings.themeColor = themeName
                db.collection(uid).doc('settings').set(this.settings)
                pdaMessage('Configuraciones', 'Actualizada')
                return true
            } catch (error) {
                this.showError(error)
                return false
            }
        },
        setNewSymbol() {
            const newList =
                this.newSymbol.action === 'new'
                    ? addLast(this.settings.symbolCodeList, this.newSymbol.data)
                    : this.newSymbol.action === 'update'
                    ? replaceAt(
                          this.settings.symbolCodeList,
                          this.newSymbol.index,
                          this.newSymbol.data
                      )
                    : this.newSymbol.action === 'delete'
                    ? removeAt(
                          this.settings.symbolCodeList,
                          this.newSymbol.index
                      )
                    : undefined
            if (newList) {
                const newSettings = set(
                    this.settings,
                    'symbolCodeList',
                    newList
                )
                try {
                    const db = firebase.firestore()
                    const uid = firebase.auth().currentUser.uid
                    db.collection(uid).doc('settings').set(newSettings)
                    this.settings = newSettings
                    this.newSettings = newSymbolModel
                    pdaMessage('Configuraciones', 'Actualizada')
                    return true
                } catch (error) {
                    this.showError(error)
                    return false
                }
            } else {
                return false
            }
        },
        async restoreSettings() {
            try {
                const db = firebase.firestore()
                const uid = firebase.auth().currentUser.uid
                await db.collection(uid).doc('settings').set(this.settings)
                await db.collection(uid).doc('panel1').set({ panel1: [] })
                await db.collection(uid).doc('panel2').set({ panel2: [] })
                await db.collection(uid).doc('panel3').set({ panel3: [] })
                pdaMessage('Configuración', 'Bienvenido')
                return true
            } catch (error) {
                this.showError(error)
                return false
            }
        },
    })

export default createContext(SettingStore())
