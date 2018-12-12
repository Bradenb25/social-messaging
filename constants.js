module.exports = {

    //#region posts
    CREATE_POST:
        `
        INSERT INTO posts (time, group_id, poster_id, content) 
        VALUES ($1, $2, $3, $4) RETURNING id;
    `,
    GET_POSTS:
        `
        SELECT p.id, p.time, p.group_id, p.poster_id, p.content, u.username, u.first_name as name
        FROM posts p
        JOIN groups g ON g.id = p.group_id
        JOIN users u ON u.id = p.poster_id
        WHERE g.id = $1
        ORDER BY p.time DESC;
    `,
    UPDATE_POST:
        `
        UPDATE posts
        SET content = $1
        WHERE id = $2;
    `,
    DELETE_POST:
        `
        DELETE from posts
        WHERE id = $1;
    `,

    CREATE_POST_COMMENT:
        `
        INSERT INTO post_comments (content, post_id, poster_id, time) VALUES    
        ($1, $2, $3, $4) RETURNING id;
    `,
    GET_COMMENTS_FOR_POST:
        `
        SELECT pc.content, u.first_name as name, pc.id as post_comment_id, u.username, post_id
        FROM post_comments pc
        JOIN users u ON pc.poster_id = u.id
        WHERE pc.post_id = $1
    `,
    UPDATE_COMMENT:
        `
        UPDATE post_comments
        SET content = $1
        WHERE id = $2 AND post_id = $3;
    `,
    DELETE_COMMENT:
        `
        DELETE from post_comments
        WHERE id = $1;
    `,
    //#endregion

    //#region users
    CREATE_USER:
        `
        INSERT INTO users (email, username, hashed_password, first_name) VALUES
        ($1, $2, $3, $4); 
    `,
    GET_USER_BY_NAME:
        `
        SELECT * 
        FROM users 
        WHERE username = $1;
    `,
    GET_USERS_BY_NAME:
        `
        SELECT first_name as name, username, id, picture
        FROM users  
        WHERE lower(first_name) LIKE $1 AND id != $2;  
    `,
    UPDATE_USER:
        `
        UPDATE users
        SET email = $1,
        first_name = $2
        WHERE userName = $3;    
    `,
    DELETE_USER:
        `
        DELETE FROM users
        WHERE id = $1;
    `,

    GET_GROUPS_USER_IS_IN:
        `
        SELECT g.name, g.id
        FROM groups_lookup gl
        JOIN groups g ON g.id = gl.group_id
        WHERE gl.user_id = $1;
    `,

    //#endregion


    //#region messages
    CREATE_MESSAGE:
        `
        INSERT INTO messages (content, from_id, to_id, time_sent) VALUES 
        ($1, $2, $3, $4);
    `,

    GET_MESSAGES:
        `
        SELECT * 
        FROM messages
        WHERE from_id = $1,
    `,

    GET_CONVERSATIONS:
        `
        SELECT DISTINCT ON (u.username) u.username, u.first_name
        FROM messages m
        JOIN users u ON u.id = m.from_id
        WHERE to_id = $1;
    `,

    UPDATE_MESSAGE:
        `
        UPDATE messages
        SET content = $1,
        WHERE from_id = $2 AND id = $3;
    `,

    DELETE_MESSAGE:
        `
        DELETE 
        FROM messages
        WHERE id = $1 AND from_id = $2;
    `,
    //#endregion

    //#region groups
    CREATE_GROUP:
        `
        INSERT INTO groups (name, group_type_id, owner, description) 
            VALUES ($1, $2, $3, $4) RETURNING id;
    `,

    UPDATE_GROUP_PIC:
        `
        UPDATE groups
        SET picture = $1
        WHERE id = $2;
    `,

    GET_GROUP_PIC:
        `
        SELECT picture 
        FROM groups
        WHERE id = $1;
    `,

    GET_GROUP:
        `
        SELECT g.id, g.name, g.picture, g.group_type_id, g.description, gt.icon, gt.name as group_type_name
        FROM groups g
        JOIN group_types gt ON g.group_type_id = gt.id
        WHERE g.id = $1;
    `,

    GET_GROUPS:
    `
        SELECT DISTINCT ON (g.id) g.id, g.name 
        FROM groups g
        JOIN group_types gt ON gt.id = g.group_type_id
        WHERE lower(g.name) LIKE '%%' AND (gt.id = 1 OR gt.id = 2);
    `,

    UPDATE_GROUP:
        `
        UPDATE groups
        SET name = $1,
        group_type_id = $2,
        owner = $3,
        description = $4
        WHERE id = $5;    
    `,

    DELETE_GROUP:
        `
        DELETE 
        FROM groups
        WHERE id = $1 AND owner = $2;
    `,

    ADD_USER_TO_GROUP:
        `
        INSERT INTO groups_lookup (group_id, user_id, user_type_id) VALUES  
        ($1, $2, $3);
    `,

    REMOVE_USER_FROM_GROUP:
        `
        DELETE 
        FROM groups_lookup gl
        JOIN groups g ON gl.group_id = g.id
        WHERE user_id = $1 AND g.ownder = $2;
    `,

    GET_USERS_BY_GROUP:
        `
        SELECT u.first_name as name, u.id, username
        FROM users u
        JOIN groups_lookup g ON g.user_id = u.id
        WHERE g.group_id = $1;
    `,

    CREATE_REQUEST_TO_JOIN_GROUP:
        `
        INSERT INTO group_requests (from_id, group_id)
        VALUES ($1, $2);
    `,

    GET_JOIN_REQUESTS_FOR_GROUP:
        `
        SELECT 
        FROM group_requests gr
        JOIN groups g ON gr.group_id = g.id
        JOIN users u ON gr.from_id = u.id
        WHERE gr.group_id = $1;
    `,

    DELETE_JOIN_REQUEST:
        `
        DELETE 
        FROM group_requests
        WHERE id = $1;
    `,

    GET_GROUP_TYPES:
        `
        SELECT id, name as type, icon, description
        FROM group_types
    `,
    //#endregion

    //#region friends
    ADD_FRIEND:
        `
        INSERT INTO friends_lookup (user_id, friend_id) VALUES
        ($1, $2);
    `,

    GET_USERS_FRIENDS:
        `
        SELECT id, email, username, first_name 
        FROM users u
        JOIN friends_lookup f ON f.friend_id = u.id
        Where f.user_id = $1
        UNION ALL
        SELECT id, email, username, first_name
        FROM users u
        JOIN friends_lookup f ON f.user_id = u.id
        Where f.friend_id = $1;
    `,

    DELETE_FRIEND:
        `
        DELETE 
        FROM friends_lookup
        WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1);
    `,

    CREATE_FRIEND_REQUEST:
        `
        INSERT INTO friend_requests (from_id, to_id) 
        VALUES ($1, $2);
    `,

    GET_FRIEND_REQUESTS:
        `
        SELECT u.first_name, u.username, u.id
        FROM friend_requests fr
        JOIN users u ON u.id = fr.from_id
        WHERE fr.to_id = $1;
    `,

    DELETE_FRIEND_REQUEST:
        `
        DELETE
        FROM friend_requests
        WHERE from_id = $1 AND to_id = $2;
    `,

    //#endregion
};
