const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const userId = req.user._id;

    const product = new Product({
        title,
        price,
        description,
        imageUrl,
        userId,
    });

    product
        .save()
        .then((result) => {
            console.log("Product has been added");
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    const prodId = req.params.productId;
    if (!editMode) {
        return res.redirect("/");
    }
    Product.findById(prodId)
        .then((product) => {
            if (!product) {
                return res.redirect("/404");
            }
            res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: editMode,
                product: product,
            });
        })
        .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.id;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    Product.findById(prodId)
        .then((product) => {
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.price = updatedPrice;
            product.description = updatedDescription;
            return product.save();
        })
        .then((result) => {
            console.log("Product has been updated");
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product.find()
        // .select("title price -_id")
        // .populate("userId", "name")
        .then((products) => {
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
            });
        })
        .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.id;
    Product.findByIdAndDelete(prodId)
        .then((result) => {
            console.log("Product has been deleted");
            res.redirect("/admin/products");
        })
        .catch((err) => console.log(err));
};
