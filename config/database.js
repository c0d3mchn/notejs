if(process.env.NODE_ENV ==='production'){
    module.exports = {
        mongoURI: 'mongodb+srv://c0d3mchn:%2Ad3v%211D%2A@cluster0-bfftn.mongodb.net/test?retryWrites=true&w=majority'
    } 
} else {
    module.exports = {mongoURI: 'mongodb://localhost/notejs'}
}