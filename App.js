import React, { useState, useEffect } from 'react';
import { View, SectionList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Card, Text, Image, Button } from 'react-native-elements';
import Modal from 'react-native-modal';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    axios.get('https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json')
      .then(response => {
        const pokemonByType = response.data.pokemon.reduce((acc, pokemon) => {
          pokemon.type.forEach(type => {
            if (!acc[type]) {
              acc[type] = [];
            }
            acc[type].push(pokemon);
          });
          return acc;
        }, {});
        const sortedPokemonByType = Object.entries(pokemonByType)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([type, pokemonOfType]) => ({ title: type, data: pokemonOfType }));
        setPokemonList(sortedPokemonByType);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <Card containerStyle={{ borderRadius: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={{ uri: item.img }}
              style={{ width: 100, height: 100 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text h4>{item.name}</Text>
              <Text>{item.type.join(', ')}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const handlePress = (item) => {
    setSelectedPokemon(item);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setSelectedPokemon(null);
    setIsModalVisible(false);
  };

  const renderSectionHeader = ({ section }) => {
    return (
      <Text h3 style={{ padding: 10 }}>{section.title}</Text>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SectionList
        sections={pokemonList}
        keyExtractor={(item) => item.num.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />

      <Modal isVisible={isModalVisible}>
        {selectedPokemon && (
          <Card containerStyle={{ borderRadius: 10 }}>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={{ uri: selectedPokemon.img }}
                style={{ width: 200, height: 200 }}
              />
              <Text h3>{selectedPokemon.name}</Text>
              <Text>Type: {selectedPokemon.type.join(', ')}</Text>
              <Text>Height: {selectedPokemon.height}</Text>
              <Text>Weight: {selectedPokemon.weight}</Text>
              <Button
                title="Close"
                onPress={handleClose}
                buttonStyle={{ marginTop: 10 }}
              />
            </View>
          </Card>
        )}
      </Modal>
    </View>
  );
};

export default App;
