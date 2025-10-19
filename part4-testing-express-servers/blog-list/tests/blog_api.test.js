const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");

let token = null;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  // Create test user
  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({ username: "root", passwordHash });
  await user.save();

  // Login and get token
  const response = await api
    .post("/api/login")
    .send({ username: "root", password: "sekret" });

  token = response.body.token;

  // Create initial blogs
  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: user._id })
  );
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("when there are initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("blogs have id property named id instead of _id", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0].id).toBeDefined();
    expect(response.body[0]._id).not.toBeDefined();
  });
});

describe("addition of a new blog", () => {
  test("succeeds with valid data and token", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Test Author",
      url: "http://test.com",
      likes: 0,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).toContain("Test Blog");
  });

  test("fails with status code 401 if token is not provided", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Test Author",
      url: "http://test.com",
      likes: 0,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
  });
});

describe("deletion of a blog", () => {
  test("succeeds with status code 204 if id is valid", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
