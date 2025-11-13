import 'dotenv/config';

export default ({ config }) => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return {
    ...config,
    expo: {
      ...(config.expo || {}),
      ios: {
        ...(config.expo?.ios || {}),
        config: {
          ...(config.expo?.ios?.config || {}),
          googleMapsApiKey: apiKey,
        },
      },
      android: {
        ...(config.expo?.android || {}),
        config: {
          ...(config.expo?.android?.config || {}),
          googleMaps: {
            ...(config.expo?.android?.config?.googleMaps || {}),
            apiKey: apiKey,
          },
        },
      },
      extra: {
        ...(config.expo?.extra || {}),
        EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: apiKey,
      },
    },
  };
};
