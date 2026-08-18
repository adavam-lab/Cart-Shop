import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
        Welcome to the E-Commerce App
      </h1>
      <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-2xl">
        A simple, fast, and secure way to buy the best products online.
      </p>
      <div className="flex space-x-4">
        <Link href="/products" className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition">
          Shop Now
        </Link>
        <Link href="/login" className="bg-gray-100 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-200 transition font-medium">
          Sign In
        </Link>
      </div>
    </div>
  );
}
