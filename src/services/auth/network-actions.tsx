import { User } from "../../types";
import { AUTH_TOKEN_KEY, createApolloClient } from "../../utils/apollo";
import { LOGIN, ME } from "./graphql";
import { Context } from "./types";
import jwt from "jsonwebtoken";

export const login = async ({ token }: Context) => {
  try {
    const client = createApolloClient();
    const {
      data: { loginWithGoogle },
      errors,
    } = await client.mutate({
      mutation: LOGIN,
      variables: { token },
    });

    // Report Error
    if (errors) throw Error("Oops! an error occured, please try again");

    // Persit Token
    if (localStorage)
      localStorage.setItem(AUTH_TOKEN_KEY, loginWithGoogle.accessToken);

    // Decode token
    const decode: any = jwt.decode(loginWithGoogle.accessToken);

    // Report Error
    if (!decode) throw Error("Oops! an error occured, please try again");

    // Fetch user's profile
    const { data, error } = await createApolloClient().query({ query: ME });

    if (error)
      throw Error("Oops! could not get user profile, please try again");

    return data.me as User;
  } catch (e) {
    throw e;
  }
};
