const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const Post = require("../models/post");

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
        const error = new Error("Vaidation failed, entered data is incorrect.");
        error.statusCode = 422;
        throw error;
    }
    
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({
        title: title, 
        content: content,
        imageUrl: 'images/Book.jpg',
        creator: {
            name: 'Anant Duhan',
        }
    });
    post.save()
    .then((result) => {
        res.status(201).json({
          message: "Post created successfully!",
          post: result,
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            error.statusCode = 500;
        }
        next(err);
    });
};