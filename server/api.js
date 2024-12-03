const express = require("express");
const cors = require("cors");
const { insertPost, likePost, getLatestPosts, getMostLikedPosts, countPosts } = require("./db.js");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

app.post("/insertPost", async (req, res) => {
    const post = {
        sender: req.body.sender,
        content: req.body.content,
    };

    try {
        await insertPost(post);
        res.status(201).send("Post inserted.");
    } catch (e) {
        console.error(e);
        res.status(500).send("Error inserting post.");
    }
});

app.post("/likePost", async (req, res) => {
    try {
        console.log(JSON.stringify(req.body));
        await likePost(req.body.id);
        res.status(200).send("Post liked.");
    } catch (e) {
        console.error(e);
        res.status(500).send("Error liking post.");
    }
});

app.get("/getLatestPosts", async (req, res) => {
    try {
        const posts = await getLatestPosts(parseInt(req.query.numPosts));
        res.status(200).send(posts);
    } catch (e) {
        console.error(e);
        res.status(500).send("Error getting last posts.");
    }
});

app.get("/getMostLikedPosts", async (req, res) => {
    try {
        const posts = await getMostLikedPosts(parseInt(req.query.numPosts));
        res.status(200).send(posts);
    } catch (e) {
        console.error(e);
        res.status(500).send("Error getting most liked posts.");
    }
});

app.get("/countPosts", async (_req, res) => {
    try {
        const count = await countPosts();
        res.status(200).send(count.toString());
    } catch (e) {
        console.error(e);
        res.status(500).send("Error counting posts.");
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});