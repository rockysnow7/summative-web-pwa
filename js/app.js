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
    {
        sender: "Marceline",
        content: "What's up?",
        likes: 5,
        _id: "2",
    },
    {
        sender: "Princess Bubblegum",
        content: "Science is so cool!",
        likes: 10,
        _id: "3",
    },
    {
        sender: "BMO",
        content: "I am your little buddy!",
        likes: 3,
        _id: "4",
    },
    {
        sender: "Ice King",
        content: "Anyone want to hear a song?",
        likes: 2,
        _id: "5",
    },
    {
        sender: "Lumpy Space Princess",
        content: "Oh my glob, hi!",
        likes: 7,
        _id: "6",
    },
    {
        sender: "Tree Trunks",
        content: "Who wants some apple pie?",
        likes: 8,
        _id: "7",
    },
    {
        sender: "Flame Princess",
        content: "It's getting hot in here.",
        likes: 4,
        _id: "8",
    },
    {
        sender: "Peppermint Butler",
        content: "Dark magic is fascinating.",
        likes: 6,
        _id: "9",
    },
    {
        sender: "Lady Rainicorn",
        content: "안녕하세요!",
        likes: 9,
        _id: "10",
    },
    {
        sender: "Gunter",
        content: "Wenk wenk.",
        likes: 1,
        _id: "11",
    },
    {
        sender: "Finn",
        content: "Adventure is out there!",
        likes: 12,
        _id: "12",
    },
    {
        sender: "Jake",
        content: "Time for bacon pancakes.",
        likes: 15,
        _id: "13",
    },
    {
        sender: "Marceline",
        content: "I'm a thousand years old, and this never gets boring.",
        likes: 11,
        _id: "14",
    },
    {
        sender: "Princess Bubblegum",
        content: "Candy science rules.",
        likes: 13,
        _id: "15",
    },
    {
        sender: "BMO",
        content: "Who wants to play video games?",
        likes: 7,
        _id: "16",
    },
    {
        sender: "Ice King",
        content: "Why don't people like me?",
        likes: 3,
        _id: "17",
    },
    {
        sender: "Lumpy Space Princess",
        content: "Whatever, I'm fabulous.",
        likes: 9,
        _id: "18",
    },
    {
        sender: "Tree Trunks",
        content: "This apple pie is the best yet.",
        likes: 5,
        _id: "19",
    },
    {
        sender: "Flame Princess",
        content: "Don't make me angry.",
        likes: 8,
        _id: "20",
    },
    {
        sender: "Peppermint Butler",
        content: "I know things you wouldn't believe.",
        likes: 6,
        _id: "21",
    },
    {
        sender: "Lady Rainicorn",
        content: "Let's go for a ride!",
        likes: 10,
        _id: "22",
    },
    {
        sender: "Gunter",
        content: "Wenk wenk wenk!",
        likes: 2,
        _id: "23",
    },
    {
        sender: "Finn",
        content: "Mathematical!",
        likes: 14,
        _id: "24",
    },
];

const POSTS_PER_PAGE = 10;
let currentIndexLimit = POSTS_PER_PAGE;
let currentMostLikedLimit = POSTS_PER_PAGE;

const getLatestPosts = () => posts.slice(0, currentIndexLimit);
const getMostLikedPosts = () => posts.sort((a, b) => b.likes - a.likes).slice(0, currentMostLikedLimit);

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

    const loadMoreElem = document.getElementById("index-load-more");
    const loadMoreLink = document.getElementById("index-load-more-link");

    if (posts.length > currentIndexLimit) {
        loadMoreElem.style.display = "block";
        loadMoreLink.onclick = (e) => {
            e.preventDefault();
            currentIndexLimit += POSTS_PER_PAGE;
            document.getElementById("index-posts").innerHTML = buildIndexPage();
        };
    } else {
        loadMoreElem.style.display = "none";
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

        const loadMoreElem = document.getElementById("most-liked-load-more");
        const loadMoreLink = document.getElementById("most-liked-load-more-link");

        if (posts.length > currentMostLikedLimit) {
            loadMoreElem.style.display = "block";
            loadMoreLink.onclick = (e) => {
                e.preventDefault();
                currentMostLikedLimit += POSTS_PER_PAGE;
                document.getElementById("most-liked-posts").innerHTML = buildMostLikedPage();
            };
        } else {
            loadMoreElem.style.display = "none";
        }

        return content;
}

switch (window.location.pathname) {
    case "/views/index.html":
        document.getElementById("index-posts").innerHTML = buildIndexPage();
        break;
    case "/views/about.html":
        document.getElementById("numPosts").innerText = posts.length;
        break;
    case "/views/most-liked.html":
        document.getElementById("most-liked-posts").innerHTML = buildMostLikedPage();
        break;
    default:
        break;
}
