const Cart = require('../models/cart.model');

const cartController = {
    addToCart: async (req, res) => {
        try {
            const { productId, quantity, name, price, image } = req.body;
            const userId = req.user.id; // From auth middleware

            let cart = await Cart.findOne({ userId });

            if (!cart) {
                cart = new Cart({
                    userId,
                    items: [],
                    total: 0
                });
            }

            const existingItem = cart.items.find(item => 
                item.productId.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ productId, quantity, name, price, image });
            }

            cart.total = cart.items.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0
            );

            await cart.save();
            res.status(200).json(cart);
        } catch (error) {
            console.error('Add to cart error:', error);
            res.status(500).json({ message: 'Error adding item to cart' });
        }
    },

    getCart: async (req, res) => {
        try {
            const { userId } = req.params;
            const cart = await Cart.findOne({ userId });
            res.json(cart || { userId, items: [], total: 0 });
        } catch (error) {
            console.error('Get cart error:', error);
            res.status(500).json({ message: 'Error fetching cart' });
        }
    },

    updateItem: async (req, res) => {
        try {
            const { productId } = req.params;
            const { quantity } = req.body;
            const userId = req.user.id;

            const cart = await Cart.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            const item = cart.items.find(item => 
                item.productId.toString() === productId
            );

            if (!item) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }

            item.quantity = quantity;
            cart.total = cart.items.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0
            );

            await cart.save();
            res.json(cart);
        } catch (error) {
            console.error('Update cart error:', error);
            res.status(500).json({ message: 'Error updating cart item' });
        }
    },

    removeItem: async (req, res) => {
        try {
            const { productId } = req.params;
            const userId = req.user.id;

            const cart = await Cart.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            cart.items = cart.items.filter(item => 
                item.productId.toString() !== productId
            );
            
            cart.total = cart.items.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0
            );

            await cart.save();
            res.json(cart);
        } catch (error) {
            console.error('Remove from cart error:', error);
            res.status(500).json({ message: 'Error removing item from cart' });
        }
    }
};

module.exports = cartController;