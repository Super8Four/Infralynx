import { useState } from 'react';
import {
  Card,
  Form,
  Button,
  Alert,
} from 'react-bootstrap';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // TODO: Implement actual password reset request
      console.log('Password reset request for:', email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <Card className="forgot-password-card">
        <Card.Body>
          <div className="text-center mb-4">
            <h2>Forgot Password</h2>
            <p className="text-muted">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="mb-4">
              Password reset instructions have been sent to your email.
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Email</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <EmailIcon />
                </span>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </Form.Group>

            <div className="d-grid mb-3">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </Button>
            </div>

            <div className="text-center">
              <a href="/login" className="text-decoration-none d-inline-flex align-items-center">
                <ArrowBackIcon className="me-1" style={{ fontSize: 16 }} />
                Back to Login
              </a>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <style jsx>{`
        .forgot-password-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          padding: 20px;
        }

        .forgot-password-card {
          width: 100%;
          max-width: 400px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }

        .input-group-text {
          background-color: transparent;
          border-right: none;
        }

        .form-control {
          border-left: none;
        }

        .form-control:focus {
          box-shadow: none;
          border-color: #ced4da;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword; 