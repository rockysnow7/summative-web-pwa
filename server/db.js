const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
console.log(`Mongo username: ${mongoUsername}`);
console.log(`Mongo password: ${mongoPassword}`);

const uri = `mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0.geh7v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const db = client.db("db");

/** Insert a post into the database. A post should be of the following form:
 *  {
 *      sender: string,
 *      content: string,
 *  }
 */
const insertPost = async (post) => {
    const postData = {
        sender: post.sender,
        content: post.content,
        likes: 0,
    };

    try {
        const collection = db.collection("posts");
        const result = await collection.insertOne(postData);
        console.log(`Inserted post with the id ${result.insertedId}`);

        return result;
    } catch (e) {
        console.error(e);

        throw e;
    }
};

/** Like a post in the database. */
const likePost = async (id) => {
    try {
        const collection = db.collection("posts");
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $inc: { likes: 1 } },
        );
        console.log(`Liked post with the id ${id}`);

        return result;
    } catch (e) {
        console.error(e);

        throw e;
    }
};

/** Get the latest numPosts posts from the database. */
const getLatestPosts = async (numPosts) => {
    try {
        const collection = db.collection("posts");
        const cursor = collection.find().sort({ _id: -1 }).limit(numPosts);
        const posts = await cursor.toArray();
        console.log(`Found ${posts.length} posts.`);

        return posts;
    } catch (e) {
        console.error(e);

        throw e;
    }
};

/** Get the most liked posts from the database. */
const getMostLikedPosts = async (numPosts) => {
    try {
        const collection = db.collection("posts");
        const cursor = collection.find().sort({ likes: -1 }).limit(numPosts);
        const posts = await cursor.toArray();
        console.log(`Found ${posts.length} posts.`);

        return posts;
    } catch (e) {
        console.error(e);

        throw e;
    }
};

/** Count the total number of posts in the database. */
const countPosts = async () => {
    try {
        const collection = db.collection("posts");
        const numPosts = await collection.countDocuments();
        console.log(`Counted ${numPosts} posts.`);

        return numPosts;
    } catch (e) {
        console.error(e);

        throw e;
    }
};

module.exports.insertPost = insertPost;
module.exports.likePost = likePost;
module.exports.getLatestPosts = getLatestPosts;
module.exports.getMostLikedPosts = getMostLikedPosts;
module.exports.countPosts = countPosts;
