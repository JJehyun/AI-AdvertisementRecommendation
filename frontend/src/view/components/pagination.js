import React, { useState, useEffect } from "react";

const Pagination = (props) => {
  const { posts, show_count, page_count, setPost } = props;
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([]);

  const last_page = Math.ceil(posts.length / show_count);

  const paginate = (page_num) => {
    console.log(page_num);
    setPage(page_num);
  };

  const changePages = () => {
    const start_page = Math.floor(page / (page_count + 1)) * 5 + 1;
    const full_page = start_page + (page_count - 1);
    const end_page = full_page > last_page ? last_page : full_page;

    let page_list = [];
    for (let i = start_page; i <= end_page; i++) {
      page_list.push(i);
    }
    setPages(page_list);
    setPost(page);
  };

  useEffect(() => {
    changePages();
  }, [page]);

  useEffect(() => {
    changePages();
  }, [posts]);

  return (
    <>
      <ul className="pagination">
        <li onClick={() => paginate(1)}>&laquo;</li>
        {page > 1 ? (
          <li onClick={() => paginate(page - 1)}>&lt;</li>
        ) : (
          <li>&lt;</li>
        )}
        {pages.map((page_num) => (
          <li
            key={page_num}
            className={
              page == page_num ? "pagination_item selected" : "pagination_item"
            }
            onClick={() => paginate(page_num)}
          >
            {page_num}
          </li>
        ))}
        {page < last_page ? (
          <li onClick={() => paginate(page + 1)}>&gt;</li>
        ) : (
          <li>&gt;</li>
        )}
        <li onClick={() => paginate(last_page)}>&raquo;</li>
      </ul>
    </>
  );
};

export default Pagination;
