import { createContext } from 'react'
import { observable } from 'mobx'
import symbolListPanel1 from './symbolListPanel1.json'
import symbolListPanel2 from './symbolListPanel2.json'
import symbolListPanel3 from './symbolListPanel3.json'
import firebase from 'firebase/app'
import { pdaMessage } from '../../components/globalFunctions/pdaMessage'

const SymbolStore = () =>
    observable({
        listPanel1: [],
        isPanel1Ready: false,
        listPanel2: [],
        isPanel2Ready: false,
        listPanel3: [],
        isPanel3Ready: false,
        docPanel: undefined,
        userData: undefined,
        isInit: false,
        newData: {
            chartType: '',
            description: '',
            id: '',
            interval: '',
            isVisible: undefined,
            name: '',
        },
        init() {
            if (!this.isInit) {
                this.isInit = true
                const db = firebase.firestore()
                const uid = firebase.auth().currentUser.uid
                this.userData = db.collection(uid)
                this.getList(1)
                this.getList(2)
                this.getList(3)
            }
        },
        showError(error) {
            if (error.code) {
                pdaMessage(error.code, error.message, 'error')
            }
        },
        async getList(panelNumber) {
            switch (panelNumber) {
                case 1:
                    if (!this.isPanel1Ready) {
                        try {
                            const db = firebase.firestore()
                            const uid = firebase.auth().currentUser.uid
                            this.listPanel1 = (
                                await db.collection(uid).doc('panel1').get()
                            ).data()['panel1']
                            this.isPanel1Ready = true
                        } catch (error) {
                            this.showError(error)
                            this.isPanel1Ready = false
                            return []
                        }
                    }
                    return this.listPanel1
                case 2:
                    if (!this.isPanel2Ready) {
                        try {
                            const db = firebase.firestore()
                            const uid = firebase.auth().currentUser.uid
                            const list2 = await db
                                .collection(uid)
                                .doc('panel2')
                                .get()
                            this.listPanel2 = list2.data()['panel2']
                            this.isPanel2Ready = true
                        } catch (error) {
                            this.showError(error)
                            this.isPanel2Ready = false
                            return []
                        }
                    }
                    return this.listPanel2
                case 3:
                    if (!this.isPanel3Ready) {
                        try {
                            const db = firebase.firestore()
                            const uid = firebase.auth().currentUser.uid
                            const list3 = await db
                                .collection(uid)
                                .doc('panel3')
                                .get()
                            this.listPanel3 = list3.data()['panel3']
                            this.isPanel3Ready = true
                        } catch (error) {
                            this.showError(error)
                            this.isPanel3Ready = false
                            return []
                        }
                    }
                    return this.listPanel3
                default:
                    return []
            }
        },
        getById(id, panelNumber) {
            switch (panelNumber) {
                case 1:
                    return this.listPanel1.filter((f) => f.id === id)[0]
                case 2:
                    return this.listPanel2.filter((f) => f.id === id)[0]
                case 3:
                    return this.listPanel3.filter((f) => f.id === id)[0]
                default:
                    return {}
            }
        },
        async update(panelNumber) {
            switch (panelNumber) {
                case 1:
                    const editSymbol1 = this.listPanel1.filter(
                        (f) => f.id === this.newData.id
                    )[0]
                    Object.assign(editSymbol1, this.newData)
                    Object.assign(this.listPanel1, editSymbol1)
                    try {
                        await this.userData
                            .doc('panel1')
                            .set({ panel1: this.listPanel1 })
                        pdaMessage('Panel 3', 'ACTUALIZADO PANEL 1')
                    } catch (error) {
                        this.showError(error)
                    }

                    break
                case 2:
                    const editSymbol2 = this.listPanel2.filter(
                        (f) => f.id === this.newData.id
                    )[0]
                    Object.assign(editSymbol2, this.newData)
                    Object.assign(this.listPanel2, editSymbol2)
                    try {
                        await this.userData.doc('panels').update({
                            [`panel2`]: this.listPanel2,
                        })
                        pdaMessage('Panel 3', 'Gráfica actualizada')
                    } catch (error) {
                        this.showError(error)
                    }

                    break
                case 3:
                    const newList = this.listPanel3.map((sym) => {
                        if (sym.id === this.newData.id) return this.newData
                        else return sym
                    })
                    try {
                        await this.userData.doc('panel3').update({
                            [`panel3`]: newList,
                        })
                        this.isPanel3Ready = false
                        await this.getList(3)
                        pdaMessage('Panel 3', 'Gráfica actualizada')
                        return true
                    } catch (error) {
                        this.showError(error)
                        return false
                    }
                default:
                    return []
            }
        },
        async delete(id, panelNumber) {
            let newList = []
            switch (panelNumber) {
                case 1:
                    newList = this.listPanel1.filter((f) => f.id !== id)
                    this.listPanel1 = newList
                    break
                case 2:
                    newList = this.listPanel2.filter((f) => f.id !== id)
                    this.listPanel2 = newList
                    break
                case 3:
                    newList = this.listPanel3.filter((f) => f.id !== id)
                    this.listPanel3 = newList
                    break
                default:
                    return false
            }
            try {
                const panelKey = `panel${panelNumber}`
                this.userData.doc(panelKey).set({ [panelKey]: newList })
                pdaMessage('Panel', 'GRAFICA ELIMINADA')
            } catch (error) {
                this.showError(error)
            }

            return true
        },
        async create(panelNumber) {
            switch (panelNumber) {
                case 1:
                    const newList1 = [...this.listPanel1, this.newData]
                    try {
                        await this.userData
                            .doc('panel1')
                            .set({ panel1: newList1 })
                        pdaMessage('Panel 1', 'Nueva gráfica creada')
                        this.listPanel1 = newList1
                        return true
                    } catch (error) {
                        this.showError(error)
                        return false
                    }
                case 2:
                    const newList2 = [...this.listPanel2, this.newData]
                    try {
                        await this.userData
                            .doc('panel2')
                            .set({ panel2: newList2 })
                        pdaMessage('Panel 2', 'Nueva gráfica creada')
                        this.listPanel2 = newList2
                        return true
                    } catch (error) {
                        this.showError(error)
                        return false
                    }
                case 3:
                    const newList3 = [...this.listPanel3, this.newData]
                    try {
                        await this.userData
                            .doc('panel3')
                            .set({ panel3: newList3 })
                        pdaMessage('Panel 3', 'Nueva gráfica creada')
                        this.listPanel3 = newList3
                        return true
                    } catch (error) {
                        this.showError(error)
                        return false
                    }
                default:
                    return false
            }
        },
        async savePanel(panelNumber) {
            const panel = {
                panel1: symbolListPanel1,
                panel2: symbolListPanel2,
                panel3: symbolListPanel3,
            }

            const panelKey = `panel${panelNumber}`

            try {
                await this.userData
                    .doc(panelKey)
                    .set({ [panelKey]: panel[panelKey] })
                pdaMessage('Panel 3', 'Nueva gráfica creada')
            } catch (error) {
                this.showError(error)
            }
        },
    })

export default createContext(SymbolStore())
