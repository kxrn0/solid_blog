import { baseUrl } from "../data";

export default async function verify_token(
  token: string,
  set_token: (token: string) => void,
  set_error: (message: string) => void
) {
  try {
    const response = await fetch(`${baseUrl}/api/auth/log_in/verify`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await response.json();

    switch (response.status) {
      case 200:
        if (json.newToken) set_token(json.newToken);
        else set_token(token);
        break;
      case 401:
        set_token("");
        set_error("Invalid credentials!");
        break;
      case 500:
        set_token("");
        set_error("Something went wrong!");
    }
  } catch (error) {
    console.log(error);

    set_error("Something went wrong!");
  }
}
