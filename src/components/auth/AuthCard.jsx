const AuthCard = ({ title, children }) => (
  <div className="login-form-wrapper d-flex align-items-center justify-content-center">
    <div className="card login-card">
      <div className="card-body">
        <h2 className="text-center text-dark mb-4">{title}</h2>
        {children}
      </div>
    </div>
  </div>
);

export default AuthCard;
