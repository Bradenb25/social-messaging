CREATE TABLE users (
      id SERIAL PRIMARY KEY
    , email VARCHAR(150)
    , username VARCHAR(40) UNIQUE NOT NULL
    , hashed_password VARCHAR(255) NOT NULL
    , first_name VARCHAR(50)
    , picture BYTEA
);

CREATE TABLE user_types (
      id SERIAL PRIMARY KEY
    , name VARCHAR(50) NOT NULL
);

CREATE TABLE group_types (
      id SERIAL PRIMARY KEY
    , name VARCHAR(50) NOT NULL
);

CREATE TABLE groups (
      id SERIAL PRIMARY KEY
    , name VARCHAR(150)
    , picture BYTEA
    , group_type_id INT references group_types(id)
    , owner INT references users(id)
    , description VARCHAR(500)
);

CREATE TABLE groups_lookup (
      id SERIAL PRIMARY KEY
    , group_id INT references groups(id)
    , user_id INT references users(id)
    , user_type_id INT references user_types(id)
);

CREATE TABLE posts (
      id SERIAL PRIMARY KEY
    , time DATE
    , group_id INT references groups(id)
    , poster_id INT references users(id)
    , content VARCHAR(2000)
);

CREATE TABLE post_comments (
      id SERIAL PRIMARY KEY
    , content VARCHAR(500) NOT NULL
    , post_id INT references posts(id) ON DELETE CASCADE
    , poster_id INT references users(id)
    , time DATE NOT NULL
);

CREATE TABLE friends_lookup (
      user_id INT references users(id) NOT NULL
    , friend_id INT references users(id) NOT NULL
);

CREATE TABLE messages (
      id SERIAL PRIMARY KEY
    , content VARCHAR(500) NOT NULL
    , from_id INT references users(id)
    , to_id INT references users(id)
    , time_sent DATE
);

CREATE TABLE friend_requests (
        id SERIAL PRIMARY KEY
      , from_id INT references users(id)
      , to_id INT references users(id)
);

CREATE TABLE group_requests (
        id SERIAL PRIMARY KEY
      , from_id INT references users(id)
      , group_id INT references groups(id)
);

CREATE TABLE to_do (
        id SERIAL PRIMARY KEY
      , item VARCHAR(1000) NOT NULL
      , completed BOOLEAN NOT NULL
);

INSERT INTO users (email, username, hashed_password, first_name) VALUES
      ('bradenb25@gmail.com', 'bradenb25', 'Password123', 'Braden')
    , ('kkhromushina@gmail.com', 'kristina25', 'Password123', 'Kristina')
    , ('brigham25@gmail.com', 'brigham25', 'Password123', 'Brigham')
    , ('heather25@gmail.com', 'heather25', 'Password123', 'Heather');

INSERT INTO user_types (name) VALUES 
      ('Admin')
    , ('General');

INSERT INTO group_types (name) VALUES  
      ('Open')
    , ('Closed');

INSERT INTO groups (name, group_type_id, owner, description) VALUES
      ('Kristina & Braden', 1, 1, 'A group for me and Kristina to get married');

INSERT INTO groups_lookup (group_id, user_id, user_type_id) VALUES  
      (1, 2, 1)
    , (1, 1, 2);

INSERT INTO posts (time, group_id, poster_id, content) VALUES
      ('11/21/2018', 1, 1, 'Hey guys Kristina & I are getting married, we hope you can attend');

INSERT INTO post_comments (content, post_id, poster_id, time) VALUES    
      ('Yeah guys you better be there!!', 1, 2, '11/21/2018'),
      ('I hope you can come', 1, 2, '11/21/2018');

INSERT INTO friends_lookup (user_id, friend_id) VALUES
      (1, 2);

INSERT INTO messages (content, from_id, to_id, time_sent) VALUES   
      ('Hey Kristina what''s up?', 1, 2, '11/21/2018')
    , ('Hey not much Braden ready to get married!', 2, 1, '11/22/2018');

