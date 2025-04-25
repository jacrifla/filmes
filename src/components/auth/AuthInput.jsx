import React from 'react';

const AuthInput = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange
}) => {
  const inputId = id || name;
  const inputName = name || id;

  return (
    <div className="form-group mb-3">
      <label htmlFor={inputId}>{label}</label>
      <input
        type={type}
        id={inputId}
        name={inputName}
        className="form-control"
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default AuthInput;
