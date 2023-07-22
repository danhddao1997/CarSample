Sample Application

This demo use Mapbox as an alternative to Google Map. To make it consistent Mapbox will also be used for iOS.

### Setup Mapbox Account and Token

1. Go to https://www.mapbox.com/ and create an account
2. Go to Dashboard account, in the "Access tokens", create a new secret token with secret scope `downloads:read`

### Setup Mapbox iOS

1. Open terminal, write these commands:

```
touch ~/.netrc
echo "machine api.mapbox.com" > ~/.netrc
echo "login mapbox" >> ~/.netrc
echo "password <SECRET_TOKEN(sk.....)>" >> ~/.netrc
```

(please omit "<" and ">")

2. Run pod-install

```
npx pod-install
```

### Setup Mapbox Android

In `gradle.properties`, please find key `MAPBOX_DOWNLOADS_TOKEN` and add your secret token

### Setup Mapbox public token

In `src/utils/constants/index.ts`, please update `MAPBOX_PUBLIC_APK` with your public token available in Mapbox account dashboard
