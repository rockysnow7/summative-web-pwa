//const { getLatestPosts } = require("./db.js");

const posts = [
    {
        sender: "Finn",
        content: "hey",
        likes: 0,
        _id: "0",
    },
    {
        sender: "Jake",
        content: "hello",
        likes: 1,
        _id: "1",
    },
];

const getLatestPosts = () => posts.slice(0, 10);
const getMostLikedPosts = () => posts.sort((a, b) => b.likes - a.likes);

const buildIndexPage = () => {
    const latestPosts = getLatestPosts();
    const indexPostTemplate =
        '<div class="post">\n\
    <p class="message">\n\
        <span class="sender">POST_SENDER</span>: POST_CONTENT\n\
    </p>\n\
    <p class="likes">(POST_LIKES likes)</p>\n\
    <form\n\
        action="like-post/POST_ID"\n\
        method="post"\n\
        class="like"\n\
    >\n\
        <button class="like">\n\
            <img src="../resources/like.png" data-src="../resources/like.png" alt="like button" />\n\
        </button>\n\
    </form>\n\
</div>';

    var content = "";
    latestPosts.forEach((post) => {
        const entry = indexPostTemplate
            .replace("POST_SENDER", post.sender)
            .replace("POST_CONTENT", post.content)
            .replace("POST_LIKES", post.likes)
            .replace("POST_ID", post._id);
        content += entry;
    });

    var imagesToLoad = document.querySelectorAll("img[data-src]");
    const loadImages = (image) => {
        image.setAttribute("src", image.getAttribute("data-src"));
        image.onload = () => {
            image.removeAttribute("data-src");
        };
    };

    if ("intersectionObserver" in window) {
        var observer = new IntersectionObserver((items, observer) => {
            items.forEach((item) => {
                if (item.isIntersecting) {
                    loadImages(item.target);
                    observer.unobserve(item.target);
                }
            });
        });

        imagesToLoad.forEach(observer.observe);
    } else {
        imagesToLoad.forEach(loadImages);
    }

    return content;
};

const buildMostLikedPage = () => {
    const mostLikedPosts = getMostLikedPosts();
    const mostLikedPostTemplate =
        '<div class="post">\n\
    <p class="message"><span class="sender">POST_SENDER</span>: POST_CONTENT</p>\n\
    <p class="likes">(POST_LIKES likes)</p>\n\
</div>';

        var content = "";
        mostLikedPosts.forEach((post) => {
            const entry = mostLikedPostTemplate
                .replace("POST_SENDER", post.sender)
                .replace("POST_CONTENT", post.content)
                .replace("POST_LIKES", post.likes);
            content += entry;
        });

        return content;
}

switch (window.location.pathname) {
    case "/views/index.html":
        document.getElementById("posts").innerHTML = buildIndexPage();
        break;
    case "/views/about.html":
        document.getElementById("numPosts").innerText = posts.length;
        break;
    case "/views/most-liked.html":
        document.getElementById("posts").innerHTML = buildMostLikedPage();
        break;
    default:
        break;
}
