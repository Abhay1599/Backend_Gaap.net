const express = require('express');
const Blog = require('../models/blog');
const multer = require('multer');
const router = express.Router();

// Set up multer for file uploads

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Route to add a new blog entry
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { title, content, author, category, date } = req.body;
        const image = req.file ? req.file.path : '';

        const newBlog = new Blog({ title, content, author, category, date, image });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add blog entry' });
    }
});

// Route to get all blog entries
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve blog entries' });
    }
});

module.exports = router;
