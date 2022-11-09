import React, {useState} from 'react';

import Preloader from "../../preloader/Preloader";
import './DisplayData.css'

import {useQuery, useLazyQuery, gql, useMutation} from "@apollo/client";

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
            title
            year
        }
    }
`;

const GET_MOVIE_BY_NAME = gql`
    # Changed the name of the query because of GraphQL
    query Movie($title : String!) {
        movie(title : $title) {
            title
            year
        }
    }
`

const CREATE_USER_MUTATION = gql`
    mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
            name
            age
            username
            nationality
        }
    }
`

function DisplayData() {
    const {data: userData, loading, error: userError, refetch} = useQuery(QUERY_ALL_USERS)
    const {data: movieData} = useQuery(QUERY_ALL_MOVIES)

    // Grab info from the query. [] -> inside comes a func , {} -> what we want to grab from that func
    const [fetchMovie, {data: movieSearchedData, error: movieError}] = useLazyQuery(GET_MOVIE_BY_NAME)

    const [movieSearched, setMovieSearched] = useState("")

    // Create user states
    // TODO improve state management via useReducer hook
    // TODO change input nationality a dropbox box - include the list of all countries in FakeData.js from server
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [age, setAge] = useState(0)
    const [nationality, setNationality] = useState("")

    const [createUser] = useMutation(CREATE_USER_MUTATION)

    if (loading) return <Preloader/>
    if (userError) return `Error while fetching user data: ${userError}`
    if (movieError) console.log(movieError)


    return (
        <div className="full-section">
            <h1>User list:</h1>
            <div className="user-section">
                {userData &&
                    userData.users.map((user) => {
                        return <h2 className="user-section-return-names">
                            Username: {user?.username}
                        </h2>
                    })}
            </div>

            <div className="movie-section">

                <h1> Available movies:
                    {movieData ?
                        movieData.movies.map((movie) => {
                            return <h5 style={{fontSize: "15px", padding: "1rem"}}>{movie.title} </h5>
                        }) : "Nothing here"}
                </h1>

                <div className="movie-section-main">
                    <div className="movie-section-input">
                        <input
                            type="text"
                            placeholder="Movie Title..."
                            onChange={(event) => {
                                console.log(event.target.value)
                                setMovieSearched(event.target.value);
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
                        <span> Fetch Movie Data </span>
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

                <br/><br/>

                <div className="create-user-section">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        onChange={(event) => {
                            setName(event.target.value);
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Enter a username"
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Enter your age"
                        onChange={(event) => {
                            setAge(event.target.value);
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Indicate your nationality"
                        onChange={(event) => {
                            setNationality(event.target.value);
                        }}
                    />
                    <button onClick={() => {
                        console.log(name, username,age,nationality)

                        createUser({
                            variables: {
                                input: {
                                    name,
                                    username,
                                    age: Number(age),
                                    nationality }
                            }
                        })
                        refetch()
                    }}>
                        Create User
                    </button>
                </div>
            </div>

        </div>
    );
}

export default DisplayData;