import { useState } from 'react'
import '../styles/index.css'
import axios from 'axios'
import FavoriteIcon from '@mui/icons-material/Favorite'
import EastIcon from '@mui/icons-material/East'
import { Button, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'

const Search = () => {
  // State to store the search query
  const [searchQuery, setSearchQuery] = useState('')
  // State to store the search results
  const [searchResults, setSearchResults] = useState([])
  // State to store the current page
  const [currentPage, setCurrentPage] = useState(0)

  // State for the loding functionality
  const [isLoading, setIsLoading] = useState(false)

  // Function to handle the form submission
  const handleSubmit = async () => {
    // Make the API call with the search query
    setIsLoading(true)
    try {
      const response =
        await axios.get(`https://api.jikan.moe/v4/characters?page=${currentPage}&limit=15&q=${searchQuery}&order_by=favorit
       es&sort=desc
       `)
      console.log(response)
      setSearchResults(response.data.data)
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  // Function to handle the pagination buttons
  const handlePagination = async (newPage) => {
    setCurrentPage(newPage)
    // Make the API call with the updated page number
    await handleSubmit()
  }

  return (
    <div>
      <div className="searchAreaParent">
        <div className="searchMain">
          <TextField
            size="small"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ background: 'white', borderRadius: '4px' }}
          />
          <LoadingButton
            type="submit"
            onClick={handleSubmit}
            variant="contained"
            loading={isLoading}
          >
            Search
          </LoadingButton>
        </div>

        {searchResults.length === 0 ? (
          <p>No results found.</p>
        ) : (
          `Total${searchResults.length} match found`
        )}
      </div>
      <div className="detailParent">
        {searchResults.length > 0 && (
          <div className="backnextBtn">
            <Button
              onClick={() => handlePagination(currentPage - 1)}
              disabled={currentPage === 0}
              variant="contained"
            >
              Back
            </Button>
            <Button
              onClick={() => handlePagination(currentPage + 1)}
              variant="contained"
            >
              Next
            </Button>
          </div>
        )}
        {searchResults.map((result, i) => (
          <div key={i} className="animeParent">
            <div className="animeMain">
              <div className="detailarea">
                <img
                  src={result.images.jpg.image_url}
                  alt="logo"
                  width="50px"
                />
                <div>
                  <h2>{result.name}</h2>
                  {result.nicknames.map((val, i) => (
                    <p key={i}>{val}</p>
                  ))}
                </div>
              </div>
              <div className="favourite">
                <FavoriteIcon fontSize="small" sx={{ color: 'red' }} />
                <h6>{result.favorites}</h6>
              </div>
            </div>
            <a
              href={result.url}
              className="arrow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <EastIcon fontSize="large" sx={{ color: 'black' }} />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Search
