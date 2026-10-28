import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue to your mobility account."
    >
      <LoginForm />
    </AuthLayout>
  );
}