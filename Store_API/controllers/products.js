const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
    const search = 'abb';
    const products  = await Product.find({}).sort('-name -price');
    res.status(200).json({count: products.length,products})
};

const getAllProducts = async (req, res) => {
    const {featured, company, name, sort, fields, numericFilters} = req.query;
    
    const findArgument = {};

    if(featured) {
        findArgument.featured = featured === 'true'? true : false;
    }

    if(company) {
        findArgument.company = company;
    }

    if(name) {
        findArgument.name = {$regex: name, $options: 'i'};
    }

    if(numericFilters) {
        const operatorMap = {
            '>' : '$gt', 
            '>=' : '$gte', 
            '=' : '$eq', 
            '<' : '$lt', 
            '<=' : '$lte', 
        };
        const regexp = /\b(<|>|>=|=|<|<=)\b/g;
        // replace method return a new String, it doesnt modify the original string
        const filters = numericFilters.replace(regexp, (match) => `-${operatorMap[match]}-`);
    
        const options = ['price', 'rating'];
        filters.split(',').forEach(element => {
            const [field, operator, value] = element.split('-');
            if(options.includes(field)) {
                // since operator is in string Format, we need to use sq Bracs. generally obj property name is specified without quotes. but when you use quotes with property name, use sq bracs way of defining a property of an obj
                findArgument[field] = {[operator]: Number(value)};
            }
        });
    }

    console.log(findArgument)
    let result = Product.find(findArgument);
    
// sort
    if(sort) {
        // console.log(sort);
        const sortList = sort.split(',').join(' ');
        // console.log(sortList);
        result = result.sort(sortList);
    }

    if(fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }

    
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    result = result.skip(skip).limit(limit);
    
    const products = await result;
    
    res.status(200).json({ count: products.length, products });
};

module.exports = {getAllProducts, getAllProductsStatic,};