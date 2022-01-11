const idPost = 90;

function getIndex(array, id) {
    return array.findIndex(x => x.id === id);
}

function postManager(name, post) {
    const tagName = document.getElementById('user-name').getElementsByTagName('p');
    tagName[0].innerText = name;

    const tagPost = document.getElementById('post-content');
    tagPost.innerText = post;
}

function commentsManager(comments) {
    const insert = document.getElementById('comments');
    const commentTags = document.getElementsByClassName('comment')[0];

    comments.forEach(comment => {
        const clonedTags = commentTags.cloneNode(true);
        const params = clonedTags.getElementsByTagName('p');
        params[0].innerText = comment['name'].replace('.', ' ');
        params[1].innerText = comment['comment'];
        insert.appendChild(clonedTags);
    })
    commentTags.remove();
    document.getElementById('posts').style.display = 'block';
}

function totalComments(commentArray) {
    const tComments = document.getElementById('interactions').getElementsByTagName('p');
    if (commentArray.length) {
        const word = commentArray.length > 1 ? 'comments' : 'comment';
        tComments[2].innerText = `${commentArray.length} ${word}`;
    }
}

const extractData = async () => {
    const [name, post, comments] = await postData(idPost);
    
    postManager(name, post);
    commentsManager(comments);
    totalComments(comments);
}

window.onload = extractData;

async function postData(id) { // Find specific name, post e comments
    const [users, posts, comms] = await grabData();
    const indexPost = getIndex(posts, id); // Index of post

    const indexName = getIndex(users, posts[indexPost]['userId']); // Index of name
    const postName = users[indexName]['name'];

    const postContent = `${posts[indexPost]['title']} ${posts[indexPost]['body']}`;

    const comments = new Array();
    comms.forEach( comment =>{
        if(comment['postId'] == id) {
            let name = comment['email'];
            const atIndex = name.search('@');
            name = name.substring(0, atIndex);
            comments.push({
                'name': name,
                'comment': `${comment['name']} ${comment['body']}`
            })
        }
    })
    return [postName, postContent, comments];
}

const grabData = async () => { // Load data thought API
    const [usersData, postsData, commsData] = await Promise.all ([
        fetch('https://jsonplaceholder.typicode.com/users'),
        fetch('https://jsonplaceholder.typicode.com/posts'),
        fetch('https://jsonplaceholder.typicode.com/comments')
    ]);

    const [users, posts, comms] = await Promise.all([usersData.json(), postsData.json(), commsData.json()]);

    return [users, posts, comms];
}
