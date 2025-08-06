CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY ,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT CHECK(role IN ('mentor', 'learner')) NOT NULL,
  bio TEXT
);


CREATE TABLE IF NOT EXISTS skills (
  id  SERIAL PRIMARY KEY ,
  mentor_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(mentor_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY ,
  skill_id INTEGER NOT NULL,
  learner_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', 
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(skill_id) REFERENCES skills(id), 
  FOREIGN KEY(learner_id) REFERENCES users(id)
);

