import { getCurrentUser } from "aws-amplify/auth";
import { get } from "aws-amplify/api";

/**
 * Retrieves the details of the currently authenticated user.
 * @returns {object|null} User details or null if retrieval fails.
 */
export async function currentAuthenticatedUser() {
  try {
    const { username, userId, signInDetails } = await getCurrentUser();
    // Return the user details instead of just logging them
    return { username, userId, signInDetails };
  } catch (err) {
    console.error("Failed to fetch user details:", err);
    return null; // Return null or throw an error based on how you want to handle this failure
  }
}

/**
 * Fetches todo data based on client name and product name.
 * @param {function} setAlert - Function to set alerts/messages.
 * @param {function} getMostRecentItemImageUrl - Function to get the most recent item image URL.
 * @param {function} setLoading - Function to set loading state.
 * @param {string} clientName - Client name for todo data.
 * @param {string} productName - Product name for todo data.
 */
export async function getTodo(
  setAlert,
  getMostRecentItemImageUrl,
  setLoading,
  clientName,
  productName
) {
  console.log(clientName);
  console.log(productName);
  setLoading(true); // Show loader at the beginning of the request
  try {
    const operation = await get({
      apiName: "qadetection",
      path: "/cans",
      options: {
        queryParams: {
          clientName: clientName,
          productName: productName,
        },
      },
    });

    const response = await operation.response;

    if (response.statusCode === 200) {
      setAlert({
        message: "Capture successful! Fetching image...",
        type: "success",
      });

      setTimeout(async () => {
        await getMostRecentItemImageUrl(setLoading);
      }, 6000);
    } else {
      console.error("Server responded with error: ", response);
      setAlert({
        message: `Capture failed: Server responded with status ${response.statusCode}`,
        type: "error",
      });
      setLoading(false); // Hide loader on non-200 response
    }
  } catch (e) {
    console.error("Error caught in getTodo:", e);
    setAlert({
      message: "Capture failed due to network or request error.",
      type: "error",
    });
    setLoading(false); // Hide loader on catch
  }
}
