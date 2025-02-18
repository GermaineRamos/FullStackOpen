import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

describe("<Blog />", () => {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "http://testurl.com",
    likes: 0,
    user: {
      username: "testuser",
      name: "Test User",
      id: "123",
    },
  };

  const user = {
    username: "testuser",
    name: "Test User",
  };

  // Test 5.13
  test("renders title and author but not url or likes by default", () => {
    render(<Blog blog={blog} user={user} />);

    expect(screen.getByText(`${blog.title} ${blog.author}`)).toBeDefined();
    expect(screen.queryByText(blog.url)).toBeNull();
    expect(screen.queryByText(`likes ${blog.likes}`)).toBeNull();
  });

  // Test 5.14
  test("shows url and likes when view button is clicked", () => {
    render(<Blog blog={blog} user={user} />);

    const button = screen.getByText("view");
    fireEvent.click(button);

    expect(screen.getByText(blog.url)).toBeDefined();
    expect(screen.getByText(`likes ${blog.likes}`)).toBeDefined();
  });

  // Test 5.15
  test("like button clicked twice, event handler called twice", () => {
    const mockHandler = jest.fn();
    render(<Blog blog={blog} updateBlog={mockHandler} user={user} />);

    const viewButton = screen.getByText("view");
    fireEvent.click(viewButton);

    const likeButton = screen.getByText("like");
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
