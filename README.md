# 📍 React Native Maps – Busca de Localização

Este projeto é um aplicativo em **React Native (Expo)** que permite ao usuário pesquisar qualquer local pelo nome e visualizar sua posição no mapa utilizando a **API de Geocoding do Google Maps**.

O app exibe um mapa interativo com marcador, centraliza na localização pesquisada e possui uma barra de busca fixa na parte superior.

---

## Funcionalidades

- Buscar localizações por nome (ex.: "Avenida Paulista", "Rio de Janeiro", etc.)
- Exibir marcador no mapa do local encontrado
- Centralizar o mapa automaticamente na pesquisa
- Interface limpa e responsiva
- Uso da **Google Maps Geocoding API**

---

## Tecnologias utilizadas

- **React Native** (Expo)
- **react-native-maps**
- **expo-constants**
- **Google Geocoding API**
- **react-native-safe-area-context**

---

## Instalação

git clone https://github.com/SEU-USUARIO/SEU-REPO.git
cd SEU-REPO
npm install

## Configurar API Key
crie um arquivo .env na raiz do projeto

EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=SUA_API_KEY_AQUI

## OBS:

É necessário habilitar a API de Geocoding no Google Cloud.
