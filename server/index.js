// // Load dependencies
// import express from "express";  //web framework for Node.js to handle http requests
// import dotenv from "dotenv";  //to load environment variable from .env
// import bodyParser from "body-parser";  //read request body data (JSON or forms)
// import cors from "cors";      // lets the frontend make request to backend across origin
// import { db } from "./db.js";   //  your db.js must export 'db' correctly
// import bcrypt from "bcrypt";    //password hashing 
// import passport from "passport";    //middleware for authentication
// import { Strategy as LocalStrategy } from "passport-local";   //"Local strategy" means username + password login,
// import session from "express-session";    //session middleware stores login sessions securely
// import chatRoutes from "./chat.js";     //Add OpenAI Chatbot api endpoint
// // Setup
// dotenv.config();  // loads environment varaibles
// const app = express();  //creates an express app instance
// const port = 5000;
// const saltRounds = 10;


// // Session setup
// app.use(session({
//   secret: process.env.SESSION_SECRET,    //signs the session id
//   resave: false,                      //Avoids saving unnecessary sessions
//   saveUninitialized: false,           //Avoids empty sessions
// }));

// console.log("ENV USER:", process.env.PG_USER);
// app.use("/api", chatRoutes);
// app.use(cors({
//   origin: "http://localhost:3000",  // ← Adjust based on your frontend port
//   credentials: true
// }));

// // Body + CORS
// app.use(bodyParser.json());    //parses JSON request bodies into req.body


// // Passport middleware
// app.use(passport.initialize());     // to handle user authentication
// app.use(passport.session());      //Enables persistant login sessions using express-sessions


// // GET route to te root path'/'
// app.get("/", (req, res) => {
//   res.send("HealthHabit API is running!");
// });


// // Register route
// app.post("/api/register", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const existing = await db.query("SELECT * FROM users WHERE email = $1", [username]);
//     if (existing.rows.length > 0) {
//       return res.status(400).json({ message: "User already exists." });
//     }

//     const hash = await bcrypt.hash(password, saltRounds);

//     const result = await db.query(
//       "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
//       [username, hash]
//     );

//     const user = result.rows[0];
//     res.json({ message: "User registered", user: { id: user.id, email: user.email } });

//   } catch (err) {
//     console.error("Registration error: ", err);
//     res.status(500).json({ message: "Registration failed", error: err });
//   }
// });

// // Passport login strategy
// passport.use(new LocalStrategy(
//   async (username, password, done) => {
//     try {
//       const result = await db.query("SELECT * FROM users WHERE email = $1", [username]);
//       if (result.rows.length === 0) {
//         return done(null, false, { message: "No user found" });
//       }

//       const user = result.rows[0];
//       const isMatch = await bcrypt.compare(password, user.password);

//       if (isMatch) {
//         return done(null, user);
//       } else {
//         return done(null, false, { message: "Incorrect password" });
//       }
//     } catch (err) {
//       return done(err);
//     }
//   }
// ));

// // Session support
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
//     const user = result.rows[0];
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// // Login route
// app.post("/api/login", passport.authenticate("local"), (req, res) => {
//   res.json({ message: "Login successful", user: req.user });
// });

// // Logout
// app.post("/api/logout", (req, res) => {
//   req.logout(err => {
//     if (err) return res.status(500).json({ message: "Logout failed" });
//     res.json({ message: "Logout successful" });
//   });
// });

// // Get current user info
// app.get("/api/user", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.json(req.user);
//   } else {
//     res.status(401).json({ message: "Not logged in" });
//   }
// });

// // Auth middleware
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.status(401).json({ message: "Unauthorized" });
// }

// // Save a habit
// app.post("/api/habits", ensureAuthenticated, async (req, res) => {
//   const { date, activity, value, reminder_time } = req.body;
//   const newHabit = await db.habits.create({
//   date,
//   activity,
//   value,
//   reminder_time,
//   completed: false,  // default
// });

//   try {
//     await db.query(
//       "INSERT INTO habits (user_id, date, activity, value,reminder_time) VALUES ($1, $2, $3, $4, $5)",
//       [req.user.id, date, activity, value, reminder_time]
//     );
//     res.json({ message: "Habit saved" });
//   } catch (err) {
//     res.status(500).json({ message: "Error saving habit" });
//   }
// });

// // PUT /api/habits/:id/complete
// // Toggle habit completion status
// app.put("/api/habits/:id/complete", ensureAuthenticated, async (req, res) => {
//   const { id } = req.params;
//   const { completed } = req.body;

//   try {
//     const result = await db.query(
//       `UPDATE habits 
//        SET completed = $1 
//        WHERE id = $2 AND user_id = $3 
//        RETURNING *`,
//       [completed, id, req.user.id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "Habit not found or unauthorized" });
//     }

//     res.json({ message: "Updated successfully", habit: result.rows[0] });
//   } catch (err) {
//     console.error("Error updating habit completion:", err);
//     res.status(500).json({ message: "Update failed", error: err.message });
//   }
// });



// // Get habits
// app.get("/api/habits", ensureAuthenticated, async (req, res) => {
//   try {
//     const result = await db.query(
//       "SELECT * FROM habits WHERE user_id = $1 ORDER BY date DESC",
//       [req.user.id]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ message: "Error retrieving habits" });
//   }
// });

// // Update a habit
// app.put("/api/habits/:id", ensureAuthenticated, async (req, res) => {
//   const { id } = req.params;
//   const { date, activity, value, reminder_time } = req.body;

//   try {
//     const result = await db.query(
//          "UPDATE habits SET date = $1, activity = $2, value = $3, reminder_time = $4 WHERE id = $5 AND user_id = $6",
//      [date, activity, value, reminder_time || null, habitId, req.user.id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "Habit not found or unauthorized" });
//     }

//     res.json({ message: "Habit updated", habit: result.rows[0] });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating habit" });
//   }
// });


// // Delete a habit
// app.delete("/api/habits/:id", ensureAuthenticated, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await db.query(
//       "DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING *",
//       [id, req.user.id]
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: "Habit not found or unauthorized" });
//     }

//     res.json({ message: "Habit deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting habit" });
//   }
// });



// // Get current user profile
// app.get("/api/profile", ensureAuthenticated, async (req, res) => {
//   try {
//     const result = await db.query(
//       "SELECT id, email, display_name, avatar_url, joined_at FROM users WHERE id = $1",
//       [req.user.id]
//     );

//     const user = result.rows[0];
//     res.json(user);
//   } catch (err) {
//     console.error("Profile fetch error:", err);
//     res.status(500).json({ message: "Failed to fetch profile" });
//   }
// });


// // Get user profile
// app.get("/api/profile", ensureAuthenticated, async (req, res) => {
//   try {
//     const result = await db.query("SELECT id, email, name, avatar FROM users WHERE id = $1", [req.user.id]);
//     res.json(result.rows[0]);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching profile" });
//   }
// });

// // Update profile
// app.put("/api/profile", ensureAuthenticated, async (req, res) => {
//   const { name, avatar } = req.body;
//   try {
//     await db.query(
//       "UPDATE users SET name = $1, avatar = $2 WHERE id = $3",
//       [name, avatar, req.user.id]
//     );
//     res.json({ message: "Profile updated" });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating profile" });
//   }
// });


// app.post("/api/habits", (req, res, next) => {
//   console.log("AUTH:", req.isAuthenticated(), "USER:", req.user);
//   next();
// });





// // Start server
// app.listen(port, () => {
//   console.log(`✅ Server running on http://localhost:${port}`);
// });
// Load dependencies
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { db } from "./db.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import chatRoutes from "./chat.js";

// Setup
dotenv.config();
const app = express();
const port = 5000;
const saltRounds = 10;

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// Chatbot routes
app.use("/api", chatRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("HealthHabit API is running!");
});

// Register route
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existing = await db.query("SELECT * FROM users WHERE email = $1", [username]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const result = await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [username, hash]
    );

    const user = result.rows[0];
    res.json({ message: "User registered", user: { id: user.id, email: user.email } });

  } catch (err) {
    console.error("Registration error: ", err);
    res.status(500).json({ message: "Registration failed", error: err });
  }
});

// Passport login strategy
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [username]);
    if (result.rows.length === 0) return done(null, false, { message: "No user found" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? done(null, user) : done(null, false, { message: "Incorrect password" });

  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

// Login
app.post("/api/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "Login successful", user: req.user });
});

// Logout
app.post("/api/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logout successful" });
  });
});

// Get current user info
app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

// Auth middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}

// Save a habit
app.post("/api/habits", (req, res, next) => {
  console.log("AUTH:", req.isAuthenticated(), "USER:", req.user);
  next();
}, ensureAuthenticated, async (req, res) => {
  const { date, activity, value, reminder_time } = req.body;

  try {
    await db.query(
      "INSERT INTO habits (user_id, date, activity, value, reminder_time) VALUES ($1, $2, $3, $4, $5)",
      [req.user.id, date, activity, value, reminder_time]
    );
    res.json({ message: "Habit saved" });
  } catch (err) {
    console.error("Error saving habit:", err);
    res.status(500).json({ message: "Error saving habit", error: err.message });
  }
});

// Toggle completion
app.put("/api/habits/:id/complete", ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    const result = await db.query(
      `UPDATE habits SET completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
      [completed, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Habit not found or unauthorized" });
    }

    res.json({ message: "Updated successfully", habit: result.rows[0] });
  } catch (err) {
    console.error("Error updating habit completion:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// Get habits
app.get("/api/habits", ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM habits WHERE user_id = $1 ORDER BY date DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch habits error:", err);
    res.status(500).json({ message: "Error retrieving habits" });
  }
});

// Update habit
app.put("/api/habits/:id", ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { date, activity, value, reminder_time } = req.body;

  try {
    const result = await db.query(
      "UPDATE habits SET date = $1, activity = $2, value = $3, reminder_time = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
      [date, activity, value, reminder_time || null, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Habit not found or unauthorized" });
    }

    res.json({ message: "Habit updated", habit: result.rows[0] });
  } catch (err) {
    console.error("Error updating habit:", err);
    res.status(500).json({ message: "Error updating habit" });
  }
});

// Delete habit
app.delete("/api/habits/:id", ensureAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Habit not found or unauthorized" });
    }

    res.json({ message: "Habit deleted" });
  } catch (err) {
    console.error("Error deleting habit:", err);
    res.status(500).json({ message: "Error deleting habit" });
  }
});

// Get & update user profile
app.get("/api/profile", ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, email, display_name, avatar_url, joined_at FROM users WHERE id = $1",
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

app.put("/api/profile", ensureAuthenticated, async (req, res) => {
  const { name, avatar } = req.body;

  try {
    await db.query(
      "UPDATE users SET display_name = $1, avatar_url = $2 WHERE id = $3",
      [name, avatar, req.user.id]
    );
    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
