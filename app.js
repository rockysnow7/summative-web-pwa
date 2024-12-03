if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
}

const POSTS_PER_PAGE = 10;
let currentIndexLimit = POSTS_PER_PAGE;
let currentMostLikedLimit = POSTS_PER_PAGE;

const getLatestPosts = async (numPosts) => {
    const response = await fetch("/getLatestPosts?" + new URLSearchParams({ numPosts }), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const posts = await response.json();

    return posts;
};

const getMostLikedPosts = async (numPosts) => {
    const response = await fetch("/getMostLikedPosts?" + new URLSearchParams({ numPosts }), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const posts = await response.json();

    return posts;
};

const countPosts = async () => {
    const response = await fetch("/countPosts", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const count = await response.json();

    return count;
};

const likePost = async (id) => {
    const response = await fetch("/likePost", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    });

    return response;
};

const postMessageFromForm = async () => {
    const sender = document.getElementById("message-form-sender").value;
    const content = document.getElementById("message-form-content").value;

    if (!sender || !content) {
        return;
    }

    const response = await fetch("/insertPost", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender, content }),
    });

    return response;
};

const buildIndexPage = async () => {
    const latestPosts = await getLatestPosts(currentIndexLimit);
    const indexPostTemplate =
        '<div class="post">\n\
    <p class="message">\n\
        <span class="sender">POST_SENDER</span>: POST_CONTENT\n\
    </p>\n\
    <p class="likes">(POST_LIKES likes)</p>\n\
    <form class="like">\n\
        <button class="like" onclick="likePost(\'POST_ID\')">\n\
            <img src="/resources/like.png" data-src="/resources/like.png" alt="A pink heart-shaped like button." />\n\
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

    const loadMoreElem = document.getElementById("index-load-more");
    const loadMoreLink = document.getElementById("index-load-more-link");

    const numPostsTotal = await countPosts();
    if (numPostsTotal > currentIndexLimit) {
        loadMoreElem.style.display = "block";
        loadMoreLink.onclick = async (e) => {
            e.preventDefault();
            currentIndexLimit += POSTS_PER_PAGE;
            const page = await buildIndexPage();
            document.getElementById("index-posts").innerHTML = page;
        };
    } else {
        loadMoreElem.style.display = "none";
    }

    return content;
};

const buildMostLikedPage = async () => {
    const mostLikedPosts = await getMostLikedPosts(currentMostLikedLimit);
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

        const loadMoreElem = document.getElementById("most-liked-load-more");
        const loadMoreLink = document.getElementById("most-liked-load-more-link");

        const numPostsTotal = await countPosts();
        if (numPostsTotal > currentMostLikedLimit) {
            loadMoreElem.style.display = "block";
            loadMoreLink.onclick = async (e) => {
                e.preventDefault();
                currentMostLikedLimit += POSTS_PER_PAGE;
                const page = await buildMostLikedPage();
                document.getElementById("most-liked-posts").innerHTML = page;
            };
        } else {
            loadMoreElem.style.display = "none";
        }

        return content;
}

const initPage = async () => {
    switch (window.location.pathname) {
        case "/views/index.html":
            var page = await buildIndexPage();
            document.getElementById("index-posts").innerHTML = page;

            document.getElementById("message-form-sender").disabled = false;
            document.getElementById("message-form-content").disabled = false;
            document.getElementById("message-form-button").disabled = false;
            break;
        case "/views/about.html":
            var count = await countPosts();
            document.getElementById("num-posts").innerText = count;
            break;
        case "/views/most-liked.html":
            var page = await buildMostLikedPage();
            document.getElementById("most-liked-posts").innerHTML = page;
            break;
        default:
            break;
    }
};

initPage();