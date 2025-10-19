const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
];

test("dummy returns one", () => {
  const blogs = [];
  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  test("of empty list is zero", () => {
    assert.strictEqual(listHelper.totalLikes([]), 0);
  });

  test("when list has only one blog equals the likes of that", () => {
    assert.strictEqual(listHelper.totalLikes([blogs[0]]), 7);
  });

  test("of a bigger list is calculated right", () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 24);
  });
});

describe("favorite blog", () => {
  test("of empty list is null", () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null);
  });

  test("when list has only one blog returns that blog", () => {
    const result = listHelper.favoriteBlog([blogs[0]]);
    assert.deepStrictEqual(result, {
      title: "React patterns",
      author: "Michael Chan",
      likes: 7,
    });
  });

  test("returns blog with most likes", () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});

describe("most blogs", () => {
  test("of empty list is null", () => {
    assert.strictEqual(listHelper.mostBlogs([]), null);
  });

  test("when list has only one blog returns that author", () => {
    const result = listHelper.mostBlogs([blogs[0]]);
    assert.deepStrictEqual(result, {
      author: "Michael Chan",
      blogs: 1,
    });
  });

  test("returns author with most blogs", () => {
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      blogs: 2,
    });
  });
});

describe("most likes", () => {
  test("of empty list is null", () => {
    assert.strictEqual(listHelper.mostLikes([]), null);
  });

  test("when list has only one blog returns that author", () => {
    const result = listHelper.mostLikes([blogs[0]]);
    assert.deepStrictEqual(result, {
      author: "Michael Chan",
      likes: 7,
    });
  });

  test("returns author with most total likes", () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
