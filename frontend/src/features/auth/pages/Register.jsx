import AuthLayout from "../components/AuthLayout";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
  return (
    <AuthLayout
      title="Create your account"
      description="Enter your details to get started with GoSago."
    >
      <RegisterForm />
    </AuthLayout>
  );
}