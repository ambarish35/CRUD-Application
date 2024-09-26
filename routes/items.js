const express = require('express');
const router = express.Router();

// Item model
const Item = require('../models/Item');

// @route   GET api/items
// @desc    Get all items
// @access  Public
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST api/items
// @desc    Create an item
// @access  Public
router.post('/', async (req, res) => {
    const newItem = new Item({
        name: req.body.name,
    });

    try {
        const item = await newItem.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET api/items/:id
// @desc    Get a single item by id
// @access  Public
router.get('/:id', getItem, (req, res) => {
    res.json(res.item);
});

// @route   PUT api/items/:id
// @desc    Update an item by id
// @access  Public
router.put('/:id', getItem, async (req, res) => {
    if (req.body.name != null) {
        res.item.name = req.body.name;
    }

    try {
        const updatedItem = await res.item.save();
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   DELETE api/items/:id
// @desc    Delete an item by id
// @access  Public
router.delete('/:id', getItem, async (req, res) => {
    try {
        await res.item.remove();
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get an item by ID
async function getItem(req, res, next) {
    let item;
    try {
        item = await Item.findById(req.params.id);
        if (item == null) {
            return res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.item = item;
    next();
}

module.exports = router;
