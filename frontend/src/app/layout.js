import './globals.css';

export const metadata = {
  title: 'DealDash Admin',
  description: 'Admin panel for DealDash',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">DealDash Admin</h1>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <a href="/" className="hover:underline">Dashboard</a>
                </li>
                <li>
                  <a href="/categories" className="hover:underline">Categories</a>
                </li>
                <li>
                  <a href="/vendors" className="hover:underline">Vendors</a>
                </li>
                <li>
                  <a href="/deals" className="hover:underline">Deals</a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          <p>© 2025 DealDash Admin</p>
        </footer>
      </body>
    </html>
  );
}