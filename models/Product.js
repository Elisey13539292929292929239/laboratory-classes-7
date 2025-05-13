const { getDatabase } = require('../database');

const COLLECTION_NAME = 'products'; 
class Product {

  static async getAll() {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).find().toArray();
  }

  async save() {
    const db = getDatabase();
    const existing = await db.collection(COLLECTION_NAME).findOne({ name: this.name });
    if (existing) {
      throw new Error("Продукт с таким именем уже существует.");
    }
    return db.collection(COLLECTION_NAME).insertOne(this);
  }

  static async findByName(name) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).findOne({ name });
  }

  static async deleteByName(name) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).deleteOne({ name });
  }

  static async getLast() {
    const db = getDatabase();
    const products = await db
      .collection(COLLECTION_NAME)
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .toArray();
    return products[0];
  }
}

module.exports = Product;
