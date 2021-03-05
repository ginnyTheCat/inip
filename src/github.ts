import axios from "axios";

export async function createGitHubRepo(
  repo: string,
  _private: boolean,
  token: string
): Promise<string> {
  const api = axios.create({
    baseURL: "https://api.github.com",
    headers: {
      Authorization: `token ${token}`,
    },
  });
  const parts = repo.split("/");

  if (parts.length === 1) {
    const res = await api.post("user/repos", {
      name: parts[0],
      private: _private,
    });

    return res.data.html_url;
  } else if (parts.length === 2) {
    const res = await api.post(`orgs/${parts[0]}/repos`, {
      name: parts[1],
      private: _private,
    });

    return res.data.html_url;
  } else {
    throw "";
  }
}
