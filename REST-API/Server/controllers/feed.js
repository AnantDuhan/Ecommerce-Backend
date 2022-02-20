const fs  = require('fs');
const path = require("path");

const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const Post = require("../models/post");
const User = require("../models/user");

exports.getPosts = async (req, res, next) => {
    const currPage = req.query.page || 1;
    const perPage = 2;
    // let totalItems;
    try {
      const totalItems = await Post.find().countDocuments();
      const posts = await Post.find()
        .populate("creator")
        .skip((currPage - 1) * perPage)
        .limit(perPage);

      res.status(200).json({
        message: "Fetched posts successfully.",
        posts: posts,
        totalItems: totalItems
      });
    }
    catch (err) {
      if (!err.statusCode) {
          error.statusCode = 500;
        }
        next(err);
    }
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req, res);
    if(!errors.isEmpty()) {
        const error = new Error("Vaidation failed, entered data is incorrect.");
        error.statusCode = 422;
        throw error;
    }
    
    if(!req.file) {
        const error = new Error("No image provided");
        error.statusCode = 422;
        throw error;
    }

    const imageUrl = req.file.path.replace("\\", "/");
    const title = req.body.title;
    const content = req.body.content;
    let creator;
    const post = new Post({
        title: title, 
        content: content,
        imageUrl: imageUrl,
        creator: req.userId
    });
    post.save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then(user => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then(result => {
        res.status(201).json({
          message: "Post created successfully!",
          post: post,
          creator: { _id: creator._id, name: creator.name }
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then((post) => {
        if(!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Post fetched',
            post: post
        });
    })
    .catch (err => {
        if (!err.statusCode) {
          error.statusCode = 500;
        }
        next(err);
    })
};

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req, res);
    if (!errors.isEmpty()) {
      const error = new Error("Vaidation failed, entered data is incorrect.");
      error.statusCode = 422;
      throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.imageUrl;
    if(req.file) {
        imageUrl = req.file.path;
    }
    if(!imageUrl) {
        const error = new Error('No file picked');
        error.statusCode = 422;
        throw error;
    }
    Post.findById(postId)
      .then(post => {
          if (!post) {
            const error = new Error("Could not find post.");
            error.statusCode = 404;
            throw error;
          }
          if(post.creator.toString() !== req.userId) {
            const error = new Error('Not Authorized');
            error.statusCode = 422;
            throw error;
          }
          if(imageUrl !== post.imageUrl) {
              clearImage(post.imageUrl);
          }
          post.title = title;
          post.imageUrl = imageUrl;
          post.content = content;
          return post.save();
      })
      .then(result => {
          res.status(200).json({ message: 'Post Updated', post: result });
      })
      .catch((err) => {
        if (!err.statusCode) {
          error.statusCode = 500;
        }
        next(err);
      });
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
        .then(post => {
            if (!post) {
              const error = new Error("Could not find post.");
              error.statusCode = 404;
              throw error;
            }
            if (post.creator.toString() !== req.userId) {
              const error = new Error("Not Authorized");
              error.statusCode = 422;
              throw error;
            }
            // check loggedIn User
            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then(result => {
          return User.findById(req.userId);
        })
        .then(user => {
          user.posts.pull(postId);
          return user.save();
        })
        .then(result => {
          res.status(200).json({ message: "Deleted Post" });
        })
        .catch((err) => {
            if (!err.statusCode) {
            error.statusCode = 500;
            }
            next(err);
        });
}

exports.getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if(!user) {
      const error = new Error('User not Exist');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: user.status
    });
  }
  catch(error) {
    if(!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

exports.putStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("User not exist");
      error.statusCode = 404;
      throw error;
    }

    user.status = status;
    const respose = await user.save();

    res.status(200).json({
      message: "Status updated!!",
      status: respose.status,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};