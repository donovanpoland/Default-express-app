import { createMetaData } from "../utils/meta.util.js"
import { siteConfig } from "./site.js"


export const pageMeta = {
    // home page
    home: createMetaData(
      "Home",
      ["Home", siteConfig.name, "Express", "MVC"],
      `Welcome to ${siteConfig.name}.`
    ),
    404: createMetaData(
      "Error 404 Page Not Found",
      ["missing page", siteConfig.name, "error 404"],
      "An error has occurred, the page you are looking for is missing or not available.",
      "noindex, nofollow",
    ),
    500: createMetaData(
      "500 Internal Server Error",
      ["server error", siteConfig.name, "error 500"],
      "Something Went Wrong, The server encountered an error while processing your request.",
      "noindex, nofollow",
    ),
    429: createMetaData(
          "429 Too Many Reached",
          ["rate limit", siteConfig.name, "error 429"],
          "Too many login or registration attempts were made. Please wait before trying again.",
          "noindex, nofollow",
        ),
    registration: createMetaData(
      "Registration",
      ["Create New user", "New account", "Join"],
      "Enter user details to register for an account."
    ),
    login: createMetaData(
      "Please login",
      ["login"],
      "You are not logged in, to gain access to your account again please enter your user name and password."
    ),
    dashboard: createMetaData(
      "Dashboard",
      ["dashboard", "user interface"],
      "Your personal user information is displayed here."
    ),
    userEdit: createMetaData(
      "Edit Your Information",
      ["edit user", "change user info", "update info"],
      "Edit your user information is here."
    ),
    allUsers: createMetaData(
      "All users",
      ["all users", "user list"],
      `List of all users for Admin use only.`
    ),

}
