import Order from '../Order/models/orders.js';

export async function createOrder(req, res) {
  try {
    const { customerName, customerEmail, items, total } = req.body || {};

    const order = await Order.create({
      customerName,
      customerEmail,
      items: Array.isArray(items) ? items : [],
      total: typeof total === 'number' ? total : Number(total || 0),
      paymentMethod: 'COD',
      status: 'Pending',
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: String(err) });
  }
}

export async function listOrders(req, res) {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list orders', error: String(err) });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status', error: String(err) });
  }
}

