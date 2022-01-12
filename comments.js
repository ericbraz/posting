const idPost = 90;

// I'm not using the getIndex function anymore so I removed it

function postManager(name, post) {
    const tagName = document.querySelector('#user-name p');
    tagName.innerText = name;

    const tagPost = document.getElementById('post-content');
    tagPost.innerText = post;
}

function commentsManager(comments) {
    const commentsDiv = document.getElementById('comments'); // remember that naming in programming is very important. Insert usually is a name for a function since it is a verb
    const commentTags = document.querySelector('.comment');

    comments.forEach(comment => {
        //cloneNode is okay here, but never use it for elements with id or name attributes, because they'll get copied too
        const clonedTags = commentTags.cloneNode(true);
        const params = clonedTags.getElementsByTagName('p'); //here getElementsByTagName is better than querySelector, because you call only one function instead of two
        params[0].innerText = comment['name'].replace('.', ' ');
        params[1].innerText = comment['comment'];
        commentsDiv.appendChild(clonedTags);
    })
    commentTags.remove();
    document.getElementById('posts').style.display = 'block';
}

function totalComments(commentArray) {
    const tComments = document.querySelector('#interactions p:last-child');
    if (commentArray.length) {
        const word = commentArray.length > 1 ? 'comments' : 'comment';
        tComments.innerText = `${commentArray.length} ${word}`;
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
    const [users, post, comms] = await grabData();

    const postName = users.find(user => user.id === post.userId).name

    // I personally like better using ".prop", it takes less characters. I use more the bracket notation when I want access a value based on a dynamic variable liek so: obj[variable]
    const postContent = `${post.title} ${post.body}`;

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
    const [usersData, postData, commsData] = await Promise.all ([
        fetch('https://jsonplaceholder.typicode.com/users'),
        fetch('https://jsonplaceholder.typicode.com/posts/' + idPost),
        fetch('https://jsonplaceholder.typicode.com/comments')
    ]);

    const [users, post, comms] = await Promise.all([usersData.json(), postData.json(), commsData.json()]);

    return [users, post, comms];
}
