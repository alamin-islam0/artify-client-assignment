import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-6">
      <div className="text-center space-y-6">
        
        <h1 className="text-8xl font-bold text-primary inter-font">
          404
        </h1>

        <h2 className="text-3xl font-semibold inter-font">
          Page Not Found
        </h2>

        <p className="text-lg text-gray-600 montserrat-font max-w-lg mx-auto">
          The page you are looking for does not exist or has been moved.
          Please return to the homepage to continue exploring amazing artworks.
        </p>

        <Link to="/" className="btn btn-primary montserrat-font mt-4">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
