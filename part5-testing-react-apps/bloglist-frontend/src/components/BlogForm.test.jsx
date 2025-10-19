import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlogForm from "./BlogForm";

describe("<BlogForm />", () => {
  // Test 5.16
  test("form calls event handler with right details when new blog created", () => {
    const createBlog = jest.fn();
    render(<BlogForm createBlog={createBlog} />);

    const titleInput = screen.getByPlaceholderText("write title here");
    const authorInput = screen.getByPlaceholderText("write author here");
    const urlInput = screen.getByPlaceholderText("write url here");
    const submitButton = screen.getByText("create");

    fireEvent.change(titleInput, { target: { value: "Test Title" } });
    fireEvent.change(authorInput, { target: { value: "Test Author" } });
    fireEvent.change(urlInput, { target: { value: "http://test.com" } });
    fireEvent.submit(submitButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: "Test Title",
      author: "Test Author",
      url: "http://test.com",
    });
  });
});
