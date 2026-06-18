import Product from '../Product/models/products.js';

export async function listProducts(req, res) {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list products', error: String(err) });
  }
}

export async function createProduct(req, res) {
  try {
    const { name, description, image, price, discount } = req.body || {};
    if (!name || typeof price === 'undefined') {
      return res.status(400).json({ message: 'Name and price are required.' });
    }
    const product = await Product.create({ name, description, image, price: Number(price), discount: Number(discount || 0) });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: String(err) });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.status(200).json({ message: 'Deleted', _id: product._id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: String(err) });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    if (updates.price) updates.price = Number(updates.price);
    if (updates.discount) updates.discount = Number(updates.discount);
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: String(err) });
  }
}
