import React, { useRef, useState } from "react";
import { StyleSheet, View, Dimensions, TextInput, Button, Keyboard, Platform, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Constants from 'expo-constants';
import { Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

// Componente principal do app
export default function App() {
  // Ref para acessar métodos do MapView
  const mapRef = useRef(null);

  // Estado do texto digitado no campo de busca
  const [query, setQuery] = useState("");

  // Estado para armazenar o marcador que vamos posicionar após a busca
  const [marker, setMarker] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    title: "São Paulo",
    description: "Capital do estado de São Paulo",
  });

  // Função que chama a API de Geocoding do Google para transformar nome em coordenadas
  const searchLocation = async () => {
    // Esconde o teclado ao iniciar a busca
    Keyboard.dismiss();

    // Se não tem query, não faz nada
    if (!query || !query.trim()) return;

    // Obtém a chave da configuração (app.config.js -> extra) ou do env
    const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Chave da API do Google Maps não encontrada. Defina EXPO_PUBLIC_GOOGLE_MAPS_API_KEY.');
      Alert.alert('Erro', 'Chave da API do Google Maps não encontrada. Defina EXPO_PUBLIC_GOOGLE_MAPS_API_KEY.');
      return;
    }

    try {
      // Monta a URL da API de Geocoding — você precisa da chave em .env
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        query
      )}&key=${GOOGLE_MAPS_API_KEY}`;

      const resp = await fetch(url);
      const json = await resp.json();

      // Verifica se retornou resultados
      if (json.status === "OK" && json.results && json.results.length > 0) {
        const location = json.results[0].geometry.location;

        // Atualiza marcador com o local encontrado
        setMarker({
          latitude: location.lat,
          longitude: location.lng,
          title: json.results[0].formatted_address,
          description: "Resultado da busca",
        });

        // Centraliza o mapa nessa região com animação
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: location.lat,
              longitude: location.lng,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            },
            1000
          );
        }
      } else {
        // Se não encontrou, opcional: tratar erro / mostrar mensagem ao usuário
        // Aqui apenas console para desenvolvedor
        console.warn("Nenhum resultado encontrado para:", query, json.status);
      }
    } catch (error) {
      console.error("Erro ao buscar localização:", error);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        {/* Container principal */}
        <View style={styles.container}>
          {/* Barra de busca — posicionada sobre o mapa */}
          <View style={styles.searchContainer}>
            {/* Campo de texto para digitar o local desejado */}
            <TextInput
              placeholder="Buscar local"
              value={query}
              onChangeText={setQuery}
              style={styles.input}
              returnKeyType="search"
              onSubmitEditing={searchLocation}
              clearButtonMode="while-editing"
            />
            {/* Botão para confirmar a busca */}
            <View style={styles.buttonWrapper}>
              <Button title="Ir" onPress={searchLocation} />
            </View>
          </View>

          {/* MapView: componente que renderiza o mapa */}
          <MapView
            // Usa o provedor Google (útil quando deseja forçar Google Maps)
            provider={PROVIDER_GOOGLE}
            ref={mapRef}
            style={styles.map}
            // Região inicial centrada em São Paulo
            initialRegion={{
              latitude: -23.55052,
              longitude: -46.633308,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            // Tipo de mapa: 'standard' | 'satellite' | 'hybrid' | 'terrain'
            mapType={Platform.OS === "android" ? "standard" : "standard"}

          >
            {/* Marcador que mostra o local atual ou o resultado da busca */}
            <Marker
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={marker.title}
              description={marker.description}
              // pinColor pode customizar a cor do marcador
              pinColor="#FF5A5F"
            />
          </MapView>
        </View>
        {/* Footer com versão ou instruções de uso (opcional) */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Digite um local e pressione "Ir" para centralizar</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Estilos do componente
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  map: {
    // Faz o mapa preencher o espaço disponível de forma responsiva
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  searchContainer: {
    // Posiciona a barra de busca no topo, sobre o mapa
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 8,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
  },
  buttonWrapper: {
    marginLeft: 6,
  },
  footer: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    alignItems: "center",
  },
  footerText: {
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
});