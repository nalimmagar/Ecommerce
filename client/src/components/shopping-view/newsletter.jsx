// components/NewsletterSection.tsx
const NewsletterSection = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-16 text-white">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <h2 className="text-4xl font-extrabold mb-4">Join Our Newsletter</h2>
        <p className="mb-6 text-lg">
          Subscribe to receive updates, access to exclusive deals, and more.
        </p>
        <form className="flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="email"
            placeholder="Your email"
            className="px-6 py-3 rounded-full w-full sm:w-auto text-gray-800 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
