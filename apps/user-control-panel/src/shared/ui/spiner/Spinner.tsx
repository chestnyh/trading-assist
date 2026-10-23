export  function Spinner() {
  return (
    <div className="flex justify-center items-center min-h-[400px]" role="status">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-neutral-200 border-t-forest-300 dark:border-neutral-800 dark:border-t-brand-300"></div>
    </div>
  );
}