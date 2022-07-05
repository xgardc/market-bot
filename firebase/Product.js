const {
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  collection,
  getDoc,
} = require('firebase/firestore');
const { firestore } = require('.');

const database = collection(firestore, 'products');

class Product {
  constructor({ product, price }) {
    this.product = product;
    this.price = price;
  }

  async save() {
    const product = await addDoc(database, {
      product: this.product,
      price: this.price,
      timestamp: Date.now(),
    });

    this.id = product.id;

    return true;
  }

  static async getAll() {
    const snapshots = await getDocs(database);
    const products = snapshots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return products;
  }

  static async remove(id) {
    await deleteDoc(doc(database, id));
    return true;
  }
}

module.exports = Product;
