const { getDatabase } = require('../database');
const Product = require('./Product');

const COLLECTION_NAME = 'carts';

class Cart {
  static async add(productName) {
    const db = getDatabase();
    const product = await Product.findByName(productName);

    if (!product) {
      throw new Error(`Product '${productName}' not found.`);
    }

    const existingItem = await db
      .collection(COLLECTION_NAME)
      .findOne({ productName });

    if (existingItem) {
      await db.collection(COLLECTION_NAME).updateOne(
        { productName },
        { $inc: { quantity: 1 } }
      );
    } else {
      await db.collection(COLLECTION_NAME).insertOne({
        productName,
        quantity: 1
      });
    }
  }

  static async getItems() {
    const db = getDatabase();
    const items = await db.collection(COLLECTION_NAME).find().toArray();

    const detailedItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findByName(item.productName);
      return {
        product,
        quantity: item.quantity
      };
    }));

    return detailedItems;
  }

  static async getProductsQuantity() {
    const items = await this.getItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  static async getTotalPrice() {
    const items = await this.getItems();
    return items.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  }

  static async clearCart() {
    const db = getDatabase();
    await db.collection(COLLECTION_NAME).deleteMany({});
  }
}

module.exports = Cart;
