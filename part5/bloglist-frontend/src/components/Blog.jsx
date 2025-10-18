import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id);
    }
  };

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user._id,
    };
    updateBlog(blog.id, updatedBlog);
  };

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-basic-info">
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(!detailsVisible)}>
          {detailsVisible ? "hide" : "view"}
        </button>
      </div>
      {detailsVisible && (
        <div className="blog-details">
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {user.username === blog.user.username && (
            <button onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      id: PropTypes.string,
      _id: PropTypes.string,
    }).isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default Blog;
