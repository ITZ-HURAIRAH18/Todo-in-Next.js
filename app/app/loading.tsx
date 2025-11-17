export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-b-4 border-blue-600 border-t-4" />
        <p className="mt-4 text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
}
 
