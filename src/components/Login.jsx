import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const success = await login(data);
    if (success) {
      navigate('/aliases');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            {...register("email", { required: "Email is required" })} 
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            {...register("password", { required: "Password is required" })} 
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login; 