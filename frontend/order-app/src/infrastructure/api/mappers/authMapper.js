export function mapLoginResponse(response) {
  return {
    accessToken: response.access_token,
  }
}
