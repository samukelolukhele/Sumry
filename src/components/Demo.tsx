import { useState, useEffect, FormEvent } from "react";
import { useLazyGetSummaryQuery } from "../services/article";
import useCopyToClipboard from "../utils/hooks/useCopyToClipboard";

type ArticleProps = {
  url: string;
  summary: string;
};

const Demo = () => {
  const [article, setArticle] = useState<ArticleProps>({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState<ArticleProps[]>(
    JSON.parse(localStorage.getItem("articles")!) || []
  );

  const { copied, handleCopyToClipboard } = useCopyToClipboard();

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")!
    );

    if (articlesFromLocalStorage != null)
      return setAllArticles(articlesFromLocalStorage);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle: ArticleProps = {
        ...article,
        summary: data.summary,
      };

      const updatedAllArticles = [
        { url: newArticle.url, summary: newArticle.summary },
        ...allArticles,
      ];

      setAllArticles(updatedAllArticles);

      setArticle(newArticle);

      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      {/* Search */}
      <div className="flex flex-col w-full gap-2">
        <form
          action=""
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src="/assets/link.svg"
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url}
            onChange={(e) =>
              setArticle({
                ...article,
                url: e.target.value,
              })
            }
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            Submit
          </button>
        </form>
        {/* Browser Url History */}

        <div className="flex flex-col gap-1 max-h-60 w-full overflow-y-auto">
          {allArticles &&
            allArticles.map((item, index) => (
              <div
                key={`link-${index}`}
                className="link_card"
                onClick={() => setArticle(item)}
              >
                <div
                  className="copy_btn"
                  onClick={() => handleCopyToClipboard(item.url)}
                >
                  <img
                    src={
                      copied.status && copied.text == item.url
                        ? `/assets/tick.svg`
                        : `/assets/copy.svg`
                    }
                    className="w-[40%] h-[40%] object-contain"
                  />
                </div>
                <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                  {item.url}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Display Results */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img
            src="/assets/loader.svg"
            alt="loader"
            className="w-20 h-10 object-contain"
          />
        ) : error ? (
          <p className="font-inter font-bold text-black">
            Well that wasn't supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {"data" in error && error?.data.message}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl text-center">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
