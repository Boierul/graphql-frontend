import React, {useState} from 'react';
import {useQuery, useLazyQuery, gql} from "@apollo/client";
import Preloader from "../preloader/Preloader";

const QUERY_ALL_USERS = gql`
    query GetAllUsers {
        users {
            id
            name
            age
            username
            nationality
        }
    }
`;

const QUERY_ALL_MOVIES = gql`
    query GetAllMovies {
        movies {
            title,
            year
        }
    }
`;

// Changed the name of the query because of GraphQL
const GET_MOVIE_BY_NAME = gql`
    query Movie($title : String!) {
        movie(title : $title) {
            title,
            year
        }
    }
`

function DisplayData() {
    const {data: userData, loading, error} = useQuery(QUERY_ALL_USERS)
    const {data: movieData} = useQuery(QUERY_ALL_MOVIES)

    // Grab info from the query. [] -> inside comes a func , {} -> what we want to grab from that func
    const [fetchMovie, {data: movieSearchedData, error: movieError}] = useLazyQuery(GET_MOVIE_BY_NAME)

    const [movieSearched, setMovieSearched] = useState("");

    // if (userData) console.log(userData)
    if (loading) return <Preloader/>;
    if (error) return `Error while fetching user data: ${error}`;


    return (
        <>
            <h1>User list:</h1>
            <div style={{fontSize: 10, color: "rebeccapurple"}}>
                {userData &&
                    userData.users.map((user) => {
                        return <h2>Username: {user?.username}</h2>
                    })}
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Name..."
                    onChange={(event) => {
                        console.log(event.target.value)
                        setMovieSearched(event.target.value);
                    }}
                />

                {/*OnClick will call the fetchMovie func from useLazyQuery hook*/}
                <button onClick={() => {
                    fetchMovie({variables: {
                            title: movieSearched,
                        }
                    })
                }}>
                    Fetch Movie Data</button>
                <br/>

                <div>
                    {movieSearchedData &&
                        <div>
                            <h1>Movie: {movieSearchedData.movie.title}</h1>
                            <h1>Year: {movieSearchedData.movie.year}</h1>
                        </div>}
                </div>
            </div>
        </>
    );
}

export default DisplayData;