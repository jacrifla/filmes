import React, { useEffect, useState } from 'react';

const CommentBox = ({ movieId, initialComment = '', onSubmitComment }) => {
  const [comment, setComment] = useState('');

  useEffect(() => {
    setComment(initialComment);
  }, [initialComment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmitComment(movieId, comment);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="comment-box-container">
        <textarea
          className="form-control rounded mb-2"
          rows="3"
          placeholder="Deixe um comentário..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="btn btn-primary w-100 rounded" type="submit">
          Enviar
        </button>
      </div>
    </form>
  );
};

export default CommentBox;
