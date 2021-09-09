const SpotifyWebApi = require("spotify-web-api-node");
const SpotifyApi = new SpotifyWebApi({
  clientId: "5e5d4eb669814f9eb9547defe8fbad9f",
  clientSecret: "8761388b35ce4de3bd1a3146b7a64634",
  redirectUri: "https://api.spotify.com/v1",
});
SpotifyApi.setAccessToken(
  "BQAnR9drtTAmdftqB2uAVPIQND134DXIUrJMQcvItZ8PlJt-_9HV8KsiTvEVPiKVcDXLBu7_KQazJAfbN60Q1SH8B_KkTYyxO3DcxTP4JLHzLicfDTH4EfMzNcaut-Fgo9PqTJkwWEz5EFk_Yprb0w-bZdX6G2qYqShx6sdqAaG-z3P3FyZ_afNK0obkBglHYjfrxJWudSUXDFqH4hw3CzZlIPH54j0WZptwNj7sY4jdiaiMyrhaxxJazf5AZdHjPhwEJqGavLPp556fWndHmuRoh39vhZzv9I6OC810"
);

module.exports = {
  SpotifyApi: SpotifyApi,
};
