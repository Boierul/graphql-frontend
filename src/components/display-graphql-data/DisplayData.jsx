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

const UPDATE_USER_USERNAME = gql`
    mutation UpdateUsername($input: UpdateUsernameInput!) {
        updateUsername(input: $input) {
            id
            username
        }
    }
`

const DELETE_USER = gql`
    mutation DeleteUser($deleteUserId: ID!) {
        deleteUser(id: $deleteUserId) {
            id
        }
    }
`


    function
DisplayData()
{
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

    // Update user username
    const [userId, setUserId] = useState(0)
    const [userUsername, setUserUsername] = useState("")
    const [updateUsername] = useMutation(UPDATE_USER_USERNAME)

    // Delete an user
    const [deleteUserId, setDeleteUserId] = useState(0)
    const [deleteUser] = useMutation(DELETE_USER)


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
                            ID: {user?.id}; Username: {user?.username};
                        </h2>
                    })}
            </div>

            <div className="movie-section">

                <h1> Available movies
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
                    <h1>Add an user</h1>

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
                            const countryToUppercase = event.target.value.toUpperCase()
                            setNationality(countryToUppercase)
                        }}
                    />

                    <div className="create-user-section-button">
                        <button onClick={() => {
                            console.log(name, username, age, nationality)

                            createUser({
                                variables: {
                                    input: {
                                        name,
                                        username,
                                        age: Number(age),
                                        nationality
                                    }
                                }
                            })
                            // In order to re-fetch the data for a responsive UI and improved UX
                            refetch()

                        }}>
                            Create User
                        </button>
                    </div>
                </div>

                <div className="update-user-username-section">
                    <h1>Edit an user's username</h1>

                    <div className="update-user-username-input">
                        <input
                            type="number"
                            placeholder="Enter your id to change the username"
                            onChange={(event) => {
                                setUserId(event.target.value);
                            }}
                        />

                        <input
                            type="text"
                            placeholder="Enter your new username"
                            onChange={(event) => {
                                setUserUsername(event.target.value);
                            }}
                        />
                    </div>

                    <div className="update-user-username-button">
                        <button onClick={() => {
                            console.log(userId, userUsername)
                            updateUsername({
                                variables: {
                                    input: {
                                        id: Number(userId),
                                        newUsername: String(userUsername)
                                    }
                                }
                            })


                            refetch()

                        }}>
                            Update User
                        </button>
                    </div>


                </div>

                <div className="delete-user-section">
                    <h1>Delete an user</h1>

                    <div className="delete-user-section-input">
                        <input
                            type="number"
                            placeholder="Enter your id to delete the user"
                            onChange={(event) => {
                                setDeleteUserId(event.target.value);
                            }}
                        />
                    </div>

                    <div className="delete-user-section-button">
                        <button onClick={() => {
                            console.log(deleteUserId)
                            deleteUser({
                                variables: {
                                    deleteUserId: Number(deleteUserId)
                                }
                            })


                            refetch()

                        }}>
                            Delete User
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default DisplayData;