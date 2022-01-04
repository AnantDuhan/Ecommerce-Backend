const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
    res.status(200).json({ 
        posts: [{
            _id: '1',
            title: 'First Post', 
            content: 'This is the first post!',
            imageUrl: 'images/Book.jpg',
            creator: {
                name: 'Anant Duhan',
            },
            createdAt: new Date()
        }] 
    });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req, res);
    if(!errors.isEmpty()) {
        return res
            .status(422)
            .json({
                message: 'Vaidation failed, entered data is incorrect', 
                errors: errors.array()
            })
    }
    
    // Create post in db
    const title = req.body.title;
    const content = req.body.content;
    res.status(201).json({ 
        message: 'Post created successfully!', 
        post: { _id: uuidv4(), 
            title: title, 
            content: content,
            creator: {
                name: 'Anant Duhan',
            },
            createdAt: new Date()
        }
    });
};