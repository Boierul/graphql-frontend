import './App.css';
import {ApolloClient, InMemoryCache, ApolloProvider} from "@apollo/client";
import DisplayData from "./components/display-graphql-data/DisplayData";

function App() {
    const client = new ApolloClient({
        cache: new InMemoryCache(),
        uri: "http://localhost:4000/graphql"
    })

    // Fetch data from API whenever the component renders

    return (
        <ApolloProvider client={client}>
           <DisplayData/>
        </ApolloProvider>
    );
}

export default App;
