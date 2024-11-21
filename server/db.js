const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
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
const getLastPosts = async (numPosts) => {
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
module.exports.getLastPosts = getLastPosts;
module.exports.getMostLikedPosts = getMostLikedPosts;
module.exports.countPosts = countPosts;
