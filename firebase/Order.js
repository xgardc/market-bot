const {
  doc,
  getDocs,
  deleteDoc,
  collection,
  setDoc,
} = require('firebase/firestore');
const { v4: generateToken } = require('uuid');
const { firestore } = require('.');

const database = collection(firestore, 'orders');

class Order {
  constructor({ owner, order }) {
    this.owner = owner;
    this.order = order;
  }

  async save() {
    const id = generateToken();
    const order = await setDoc(doc(database, id), {
      id,
      owner: this.owner,
      order: this.order,
      timestamp: Date.now(),
    });

    this.id = id;

    return true;
  }

  static async getAll() {
    const snapshots = await getDocs(database);
    const orders = snapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return orders;
  }

  static async remove(id) {
    await deleteDoc(doc(firestore, 'orders', id));
    return true;
  }
}

module.exports = Order;
