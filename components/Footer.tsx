export function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 mb-2">データは毎週月曜9:00（JST）に自動更新されます</p>
          <p className="text-sm text-gray-500">
            Made with ❤️ by{' '}
            <a
              href="https://github.com/shotaCoffee"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              @shotaCoffee
            </a>
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <a
              href="https://github.com/shotaCoffee/github-weekly-jp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
