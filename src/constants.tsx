export const API_URL: string = process.env.REACT_APP_API_URL === undefined ? 
                                  "http://localhost:5000": process.env.REACT_APP_API_URL;