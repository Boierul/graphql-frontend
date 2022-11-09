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

const CREATE_USER = gql`
    mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
            id,
            name,
            age
        }
    }
`

function DisplayData() {
    const {data: userData, loading, error: userError} = useQuery(QUERY_ALL_USERS)
    const {data: movieData} = useQuery(QUERY_ALL_MOVIES)

    // Grab info from the query. [] -> inside comes a func , {} -> what we want to grab from that func
    const [fetchMovie, {data: movieSearchedData, error: movieError}] = useLazyQuery(GET_MOVIE_BY_NAME)

    const [movieSearched, setMovieSearched] = useState("");

    if (loading) return <Preloader/>;
    if (userError) return `Error while fetching user data: ${userError}`;
    if (movieError) console.log(movieError)


    return (
        <>
            <div>
                <h1>User list:</h1>
                <div style={{fontSize: 10, color: "rebeccapurple", paddingBottom: "40px"}}>
                    {userData &&
                        userData.users.map((user) => {
                            return <h2
                                style={{border: "1px solid black", padding: "5px"}}>Username: {user?.username}
                            </h2>
                        })}
                </div>
            </div>

            <div style={{paddingTop: "20px"}}>

                <h1> Available movies:
                    {movieData ?
                        movieData.movies.map((movie) => {
                            return <h5 style={{fontSize: "15px", padding: "1rem"}}>{movie.title} </h5>
                        }) : "Nothing here"}
                </h1>

                <div style={{
                    display: "flex",
                    justifyContent: "left",
                    flexFlow: "column",
                    width: "200px",
                    gap: "1rem"
                }}>
                    <div style={{border: "1px solid black", width: "100vw"}}>
                        <input
                            type="text"
                            placeholder="Movie Title..."
                            onChange={(event) => {
                                console.log(event.target.value)
                                setMovieSearched(event.target.value);
                            }}
                            style={{
                                border: "none",
                                width: "100vw",
                                borderStyle: "none"
                            }}
                        />
                    </div>

                    {/*OnClick will call the fetchMovie func from useLazyQuery hook*/}
                    <button onClick={() => {
                        fetchMovie({
                            variables: {
                                title: movieSearched,
                            }
                        })
                    }}>
                        Fetch Movie Data
                    </button>
                </div>
                <br/>

                <div>
                    {movieSearchedData &&
                        <div>
                            <h1>Movie: {movieSearchedData.movie.title}</h1>
                            <h1>Year: {movieSearchedData.movie.year}</h1>
                        </div>
                    }

                    {movieError &&
                        <h1 style={{color: movieError ? "red" : "black"}}>There was an error while fetching </h1>}
                </div>
            </div>
        </>
    );
}

export default DisplayData;