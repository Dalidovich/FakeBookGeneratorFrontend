import { useState, useEffect, useRef, useCallback } from 'react';
import { getFakeBooks, getFakeComments } from '../utils/api/fakeBooks';
import "../styles/books.css"
import { debounce } from 'lodash';

export const FakeBooksPage = () => {
  const [fakeBooks, setFakeBooks] = useState([]);
  const [fakeComments, setFakeComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRow, setExpandedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [language, setLanguage] = useState(1); 
  const [avgLike, setAvgLike] = useState(1); 
  const [avgComments, setAvgComments] = useState(0.5); 
  const [seed, setSeed] = useState(100); 
  const [useSeed, setUseSeed] = useState(true); 
  const observer = useRef();

  const languages = [
    { id: 0, name: 'ru' },
    { id: 1, name: 'en' },
    { id: 2, name: 'ja' }
  ];

  const fetchData = useCallback(async (pageNumber, lang = language, likeValue = avgLike, commentsValue = avgComments) => {
    try {
      setLoading(true);
      const booksResponse = await getFakeBooks(pageNumber, { 
        language: lang, 
        AVGLike: likeValue, 
        AVGComments: commentsValue, 
        Seed: useSeed ? seed : "" 
      });
      const booksData = await booksResponse.json();      
      
      if (booksData.length === 0) {
        setHasMore(false);
      } else {
        setFakeBooks(prevBooks => 
          pageNumber === 0 ? booksData : [...prevBooks, ...booksData]
        );
      }
    } catch (err) {
      setError('Loading data Error');
      console.error(err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [language, avgLike, avgComments, seed, useSeed]);

  // Debounced version of fetchData for filters
  const debouncedFetchData = useCallback(debounce(fetchData, 500), [fetchData]);

  useEffect(() => {
    // Load initial data
    fetchData(0);
  }, []);

  useEffect(() => {
    if (page > 0) {
      fetchData(page);
    }
  }, [page, fetchData]);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    debouncedFetchData(0);
    return () => debouncedFetchData.cancel();
  }, [language, avgLike, avgComments, seed, useSeed, debouncedFetchData]);

  const lastBookElementRef = useCallback(node => {
    if (loading || initialLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, initialLoading]);

  const toggleRow = async (id,count) => {
    const commentsResponse = await getFakeComments(id,count,language);
    const commentsData = await commentsResponse.json();
    setFakeComments(commentsData)
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleLanguageChange = (e) => {
    setLanguage(Number(e.target.value));
    setExpandedRow(null);
  };

  const handleAvgLikeChange = (e) => {
    setAvgLike(parseFloat(e.target.value));
  };

  const handleAvgCommentsChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAvgComments(value);
      setExpandedRow(null);
    }
  };

  const handleSeedChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setSeed(value);      
      setExpandedRow(null);
    }
  };

  const handleUseSeedChange = (e) => {
    setUseSeed(e.target.checked);
    setExpandedRow(null);
  };

  if (error) return <div className="error">{error}</div>;
    
  return (
    <div className="accounts-table" data-bs-theme="dark">
      {/* Toolbar */}
      <div className="toolbar mb-3">
        <div className="row">
          <div className="col-md-2">
            <div className="form-group">
              <label htmlFor="language-select" className="form-label">Language:</label>
              <select 
                id="language-select"
                className="form-select"
                value={language}
                onChange={handleLanguageChange}
              >
                {languages.map(lang => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="avgLike-slider" className="form-label">
                AVG Like: {avgLike.toFixed(1)}
              </label>
              <input
                type="range"
                className="form-range"
                id="avgLike-slider"
                min="0"
                max="10"
                step="0.1"
                value={avgLike}
                onChange={handleAvgLikeChange}
              />
              <div className="d-flex justify-content-between">
                <small>0</small>
                <small>10</small>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-group">
              <label htmlFor="avgComments-input" className="form-label">
                AVG Comments:
              </label>
              <input
                type="number"
                className="form-control"
                id="avgComments-input"
                min="0"
                step="0.1"
                value={avgComments}
                onChange={handleAvgCommentsChange}
              />
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-group">
              <label htmlFor="seed-input" className="form-label">
                Seed:
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  id="seed-input"
                  min="0"
                  step="1"
                  value={seed}
                  onChange={handleSeedChange}
                  disabled={!useSeed}
                />
                <div className="input-group-text">
                  <input
                    type="checkbox"
                    id="use-seed-checkbox"
                    checked={useSeed}
                    onChange={handleUseSeedChange}
                    className="form-check-input mt-0"
                  /> not random
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="table-container">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ISBN</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Publisher</th>
                  <th>Likes</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {fakeBooks.map((book, index) => (
                  <>
                    <tr 
                      key={book.id} 
                      onClick={() => toggleRow(book.id,book.comments)}
                      style={{ cursor: 'pointer' }}
                      ref={index === fakeBooks.length - 1 ? lastBookElementRef : null}
                    >
                      <td>{book.id}</td>
                      <td>{book.isbn}</td>
                      <td>{book.title}</td>
                      <td>{book.athor}</td>
                      <td>{book.publisher}</td>
                      <td>{book.likes}</td>
                      <td>{book.comments}</td>
                    </tr>
                    {expandedRow === book.id && (
                      <tr>
                        <td colSpan="8" className="p-0">
                          <div className="book-details-container">
                            <div className="book-cover-wrapper">
                              <div className="book-cover">
                                <img 
                                  src={book.image} 
                                  alt={book.title} 
                                  className="book-cover-image"
                                />
                              </div>
                            </div>
                            <div className="book-info">
                              <h3 className="book-title">{book.title}</h3>
                              <div className="book-meta">
                                <span className="book-author">by {book.athor}</span>
                                <span className="book-publisher">{book.publisher}</span>
                              </div>
                              <div className="book-stats">
                                <span className="book-likes">❤️ {book.likes} likes</span>
                                <span className="book-comments">💬 {book.comments} comments</span>
                              </div>
                              <div className="book-description">
                                <h4>Description</h4>
                                <p>{book.description}</p>
                              </div>
                                <div className="comments-container">
                                  <h4 className="comments-title">Reader Comments ({fakeComments.length})</h4>
                                  <div className="comments-grid">
                                    {fakeComments.map((comment, index) => (
                                      <div key={index} className="comment-card">
                                        <div className="comment-header">
                                          <span className="comment-author-badge">{comment.athor}</span>
                                        </div>
                                        <div className="comment-content">
                                          <p>{comment.content}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
          {loading && <div className="loading">Loading more books...</div>}
        </div>
      </div>
    </div>
  );
};