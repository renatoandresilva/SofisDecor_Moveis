import {
    Firestore,
    collection,
    addDoc,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    DocumentData
} from "firebase/firestore"

// Types
import { Structure } from "../../pages/cost/costSettings"

// Types
export type IFirestore = Firestore
type Fields = {}
type DataRef = {
    docId: string,
    docData: DocumentData,
}
type UniqueList = {}[]


export const months = [
    {
        cod: 1,
        stamp: 'Jan'
    },
    {
        cod: 2,
        stamp: 'Fev'
    },
    {
        cod: 3,
        stamp: 'Mar'
    },
    {
        cod: 4,
        stamp: 'Abr'
    },
    {
        cod: 5,
        stamp: 'Mai'
    },
    {
        cod: 6,
        stamp: 'Jun'
    },
    {
        cod: 7,
        stamp: 'Jul'
    },
    {
        cod: 8,
        stamp: 'Ago'
    },
    {
        cod: 9,
        stamp: 'Set'
    },
    {
        cod: 10,
        stamp: 'Out'
    },
    {
        cod: 11,
        stamp: 'Nov'
    },
    {
        cod: 12,
        stamp: 'Dez'
    }
]

// Database Actions 
export const addDocFnc = async (db: Firestore, collectionName: string, docContent: {}): Promise<any> => {

    try {

        const list = collection(db, collectionName)
        const docs = (await getDocs(list)).docs
        console.log(list);
        console.log(docs);

        const idList: string[] = []

        if (docs.length > 0) {

            docs.forEach(item => {
                idList.push(item.data().id)
            })
        }

        const lastId = idList[idList.length - 1]

        const data = {
            ...docContent, id: 0
        }

        !lastId ? data.id = 1 : data.id = Number(lastId) + 1


        await addDoc(collection(db, collectionName), data)

    } catch (err) {

        console.info("Não foi pessível executar essa operação:" + err);
    }
}

export const getDocFnc = async (db: Firestore, collectionName: string, id: string) => {

    const docRef = await getDoc(doc(db, collectionName, id))

    if (!docRef.exists()) {
        return console.log('Documento inexistente');
    }

    return docRef.data()
}

export const getDocsFunc = async (db: Firestore, document: string) => {

    try {
        let data: DataRef[] = []
        const querySnapshot = await getDocs(collection(db, document))

        querySnapshot.docs.forEach((doc) => {

            const dataRef: DataRef = {
                docId: doc.id,
                docData: doc.data()
            }

            data.push(dataRef)
        });

        return data
    } catch (error) {
        console.log(error);

    }

}

export const updateDocFunc = async (db: Firestore, collection: string, id: string, content: Fields) => {

    const docRef = doc(db, collection, id)

    await updateDoc(docRef, content)
}

export async function deleteFunc(db: Firestore, collection: string, id: string) {

    await deleteDoc(doc(db, collection, id))
}


// Functions
export function newDateFunc(): string {
    const date = new Date()

    let dia = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
    let mes = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
    let year = date.getFullYear()

    return `${dia}/${mes}/${year}`
}

export function uniqueItemList(list: UniqueList): UniqueList {

    const uniqueItemList = [...new Set(list)]

    return uniqueItemList
}

export function getCurrentMonthAndYear(date: string) {
    const currTime = {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        date: new Date().getDate()
    }

    const arrDate = date.split('-')

    const [year, month,] = arrDate

    if (currTime.year === Number(year) && currTime.month === Number(month)) {

        return {
            month: currTime.month,
            year: currTime.year,
            date: currTime.date,
            result: true,
        }
    }

    return {
        month: currTime.month,
        year: currTime.year,
        date: currTime.date,
        result: false,
    }
}
