import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';


const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);

initializeApp(firebaseConfig);
const db = getFirestore();

export function getProducts(category) {

    const productsCollection = collection(db, 'items');
    const productQuery = category ? query(productsCollection, where('category', '==', category)) : productsCollection;
    
    return new Promise((resolve, reject) => {
        getDocs(productQuery)
            .then((snapshot) => {

                if (snapshot.size === 0) {
                    const errorMessage = category ? `No se encontraron productos con la categoría ${category}` : 'Productos no encontrados';
                    reject(errorMessage);
                }

                const products = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                resolve(products);
            })
            .catch((error) => {
                const errorMessage = 'Error al obtener documentos';
                console.log(errorMessage, error);
                reject(errorMessage);
            });
    });
}

export function getProductsById(id) {
    const productRef = doc(db, 'items', id);

    return new Promise((resolve, reject) => {
        getDoc(productRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    resolve({id: snapshot.id, ...snapshot.data()});
                } else {
                    reject('Producto no encontrado');
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}
